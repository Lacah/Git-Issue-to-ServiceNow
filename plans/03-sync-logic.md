# Plan 03: Sync Logic & Orchestration

## Overview

The Sync Orchestrator coordinates the entire sync process: fetching data from
GitHub, processing it, creating/updating ServiceNow records, managing labels,
and tracking progress.

---

## Script Include: `SyncOrchestrator`

### Responsibilities

1. Coordinate the full sync workflow
2. Determine sync mode and route accordingly
3. Track progress and report back to UI
4. Handle deduplication logic
5. Manage the sync history log
6. Handle errors gracefully (partial success is OK)

---

## Sync Workflow (Step by Step)

```
┌─────────────────────────────────────────────────┐
│ 1. VALIDATE INPUTS                              │
│    - Parse and validate repo URL                │
│    - Validate credential (test API access)      │
│    - Confirm sync mode selection                │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 2. CREATE SYNC HISTORY RECORD                   │
│    - Status: in_progress                        │
│    - Record repo, mode, user, start time        │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 3. FETCH MILESTONES (if any)                    │
│    - Call GitHubAPIClient.getMilestones()        │
│    - Report progress: "Fetching milestones..."  │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 4. PROCESS MILESTONES                           │
│    - Mirror mode → create x_snc_git_issue_      │
│      milestone records                          │
│    - Story mode → create rm_epic records        │
│    - Dedup check before creating                │
│    - Build milestone_number → sys_id map        │
│    - Report progress: "Created X milestones"    │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 5. FETCH ISSUES                                 │
│    - Call GitHubAPIClient.getIssues(state)       │
│    - Filter out pull requests                   │
│    - Report progress: "Fetching issues..."      │
│    - Report: "Found X issues (Y pages)"         │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 6. PROCESS ISSUES (iterate)                     │
│    For each issue:                              │
│    a. Check if exists (dedup)                   │
│    b. If exists & !updateExisting → skip        │
│    c. If exists & updateExisting → update       │
│    d. If new → create record                    │
│    e. Convert markdown body                     │
│    f. Parse acceptance criteria (story mode)    │
│    g. Link to milestone (if applicable)         │
│    h. Process labels                            │
│    i. Report progress: "Processing issue X/Y"  │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 7. PROCESS LABELS                               │
│    For each unique label across all issues:     │
│    a. Check if label exists in ServiceNow       │
│    b. If not, create it                         │
│    c. Create label_entry associations           │
│    - Report progress: "Processing labels..."    │
└────────────────────────┬────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│ 8. FINALIZE                                     │
│    - Update sync history: status=completed      │
│    - Record counts (created/updated/skipped)    │
│    - Record end time                            │
│    - Return summary to UI                       │
└─────────────────────────────────────────────────┘
```

---

## Deduplication Logic

### Mirror Mode

```javascript
// Check if issue already exists
var gr = new GlideRecord('x_snc_git_issue_record');
gr.addQuery('repository_url', repoUrl);
gr.addQuery('github_issue_number', issueNumber);
gr.query();

if (gr.next()) {
    if (updateExisting) {
        // Update the record
        return { action: 'updated', sysId: gr.getUniqueValue() };
    } else {
        // Skip
        return { action: 'skipped', sysId: gr.getUniqueValue() };
    }
}
// Else: create new
return { action: 'created', sysId: null };
```

### Story Mode

For `rm_story`, we need a way to track which stories came from GitHub. Options:
1. **Custom field on rm_story** (dictionary override to add `github_repo_url` and `github_issue_number`) — cleanest but may have scope restrictions
2. **Cross-reference table** (`x_snc_git_issue_story_xref`) — more flexible, no OOTB table modifications
3. **Store in a custom field** if dictionary override is feasible

**Recommended**: Use a lightweight cross-reference table:

| Field | Type | Notes |
|-------|------|-------|
| `story` | Reference → rm_story | |
| `repository_url` | URL | |
| `github_issue_number` | Integer | |

This allows dedup without modifying OOTB tables.

---

## Progress Reporting

### Mechanism

Use a **progress record** (custom table or `sys_progress_worker` pattern):

The sync runs server-side. The UI polls a progress endpoint to get real-time updates.

### Progress Record Fields

```
- sync_history_id (reference to the sync history record)
- current_phase: "fetching_milestones" | "processing_milestones" | "fetching_issues" | "processing_issues" | "processing_labels" | "complete" | "error"
- current_item: 15
- total_items: 47
- message: "Processing issue 15 of 47: Fix login bug"
- percent_complete: 32
```

### UI Polling

```
Every 1-2 seconds:
1. UI calls Table API to read progress record
2. Updates progress bar / status message
3. When phase == "complete" → show summary + redirect button
4. When phase == "error" → show error message
```

---

## Mirror Mode: Record Creation

### Issue → `x_snc_git_issue_record`

```javascript
var gr = new GlideRecord('x_snc_git_issue_record');
gr.initialize();
gr.setValue('short_description', issue.title);
gr.setValue('description', markdownConverter.toHTML(issue.body));
gr.setValue('body_html', markdownConverter.toHTML(issue.body));
gr.setValue('github_issue_number', issue.number);
gr.setValue('repository_url', repoUrl);
gr.setValue('github_url', issue.html_url);
gr.setValue('github_state', issue.state);
gr.setValue('github_author', issue.user.login);
gr.setValue('state', issue.state === 'open' ? '1' : '3');
gr.setValue('github_created_at', convertGitHubDate(issue.created_at));
gr.setValue('github_updated_at', convertGitHubDate(issue.updated_at));
if (issue.closed_at) gr.setValue('github_closed_at', convertGitHubDate(issue.closed_at));
if (issue.milestone) gr.setValue('milestone', milestoneSysIdMap[issue.milestone.number]);
gr.insert();
```

### Milestone → `x_snc_git_issue_milestone`

```javascript
var gr = new GlideRecord('x_snc_git_issue_milestone');
gr.initialize();
gr.setValue('title', milestone.title);
gr.setValue('description', markdownConverter.toHTML(milestone.description || ''));
gr.setValue('milestone_number', milestone.number);
gr.setValue('repository_url', repoUrl);
gr.setValue('github_url', milestone.html_url);
gr.setValue('state', milestone.state);
if (milestone.due_on) gr.setValue('due_date', convertGitHubDate(milestone.due_on));
gr.setValue('github_created_at', convertGitHubDate(milestone.created_at));
gr.setValue('github_updated_at', convertGitHubDate(milestone.updated_at));
if (milestone.closed_at) gr.setValue('github_closed_at', convertGitHubDate(milestone.closed_at));
gr.insert();
```

---

## Story Mode: Record Creation

### Issue → `rm_story`

```javascript
var parsed = acceptanceCriteriaParser.parse(issue.body);
// parsed = { description: "...", acceptanceCriteria: "..." }

var gr = new GlideRecord('rm_story');
gr.initialize();
gr.setValue('short_description', issue.title);
gr.setValue('description', markdownConverter.toPlainText(parsed.description));
gr.setValue('acceptance_criteria', markdownConverter.toPlainText(parsed.acceptanceCriteria));
gr.setValue('state', issue.state === 'open' ? '1' : '3');  // Draft / Closed
// Link to epic if milestone exists
if (issue.milestone && epicSysIdMap[issue.milestone.number]) {
    gr.setValue('epic', epicSysIdMap[issue.milestone.number]);
}
gr.insert();

// Create cross-reference for dedup
createStoryXref(gr.getUniqueValue(), repoUrl, issue.number);
```

### Milestone → `rm_epic`

```javascript
var gr = new GlideRecord('rm_epic');
gr.initialize();
gr.setValue('short_description', milestone.title);
gr.setValue('description', markdownConverter.toPlainText(milestone.description || ''));
if (milestone.due_on) gr.setValue('due_date', convertGitHubDate(milestone.due_on));
gr.insert();
```

---

## Label Management

### Script Include: `LabelManager`

```javascript
LabelManager.processLabels(recordSysId, tableName, githubLabels)

// For each label:
// 1. Search label table for matching name (case-insensitive)
// 2. If not found → create new label record
// 3. Create label_entry to associate label with the record
```

### Label Table Fields

Using OOTB `label` table:
- `name`: Label text (e.g., "bug", "enhancement")
- `owner`: sys_user who created it (use current user)

### Label Entry Association

Using OOTB `label_entry` table:
- `label`: Reference to label record
- `table`: Target table name
- `table_key`: sys_id of the record

---

## Error Handling Strategy

| Error | Behavior |
|-------|----------|
| Invalid repo URL format | Fail immediately, inform user |
| Auth failure (401) | Fail immediately, inform user to check credential |
| Repo not found (404) | Fail immediately, inform user |
| Rate limit hit (403) | Stop sync, inform user, record partial progress |
| Single issue fails to create | Log error, skip issue, continue with others |
| Network timeout | Retry once, then fail with error |

### Partial Success

If some issues fail but others succeed:
- Mark sync as `completed_with_errors`
- Record error count and details
- Still show results for what was created

---

## Date Conversion

GitHub dates are ISO 8601 format: `2024-01-15T10:30:00Z`

Convert to ServiceNow GlideDateTime:
```javascript
function convertGitHubDate(isoString) {
    if (!isoString) return '';
    var gdt = new GlideDateTime();
    // Parse ISO 8601 → ServiceNow internal format
    gdt.setValue(isoString.replace('T', ' ').replace('Z', ''));
    return gdt;
}
```
