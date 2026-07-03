# Plan 01: Data Model (Custom Tables)

## Overview

Define the custom tables for "Mirror Repository Structure" mode, plus a shared
sync history table used by both modes.

---

## Table 1: `x_snc_git_issue_record` (GitHub Issue)

**Extends**: `task` (inherits short_description, description, state, number, sys_id, etc.)

### Purpose
Stores GitHub issues when using "Mirror Repository Structure" mode.

### Custom Fields

| Field Label | Column Name | Type | Max Length | Mandatory | Notes |
|-------------|-------------|------|-----------|-----------|-------|
| GitHub Issue Number | `github_issue_number` | Integer | — | Yes | The issue # from GitHub (unique within repo) |
| Repository URL | `repository_url` | URL | 1024 | Yes | Full GitHub repo URL (for dedup + linking back) |
| GitHub URL | `github_url` | URL | 1024 | No | Direct link to the issue on GitHub |
| Issue State | `github_state` | Choice | — | Yes | `open`, `closed` (mirrors GitHub state) |
| Opened By | `github_author` | String | 255 | No | GitHub username who opened the issue |
| Milestone | `milestone` | Reference | — | No | → `x_snc_git_issue_milestone` |
| GitHub Created At | `github_created_at` | Date/Time | — | No | Original creation date on GitHub |
| GitHub Updated At | `github_updated_at` | Date/Time | — | No | Last update date on GitHub |
| GitHub Closed At | `github_closed_at` | Date/Time | — | No | Close date (if closed) |
| Body HTML | `body_html` | HTML | 65000 | No | Issue body converted from Markdown to HTML |

### Inherited Fields Used

| Inherited Field | Mapped From |
|----------------|-------------|
| `short_description` | GitHub issue `title` |
| `description` | GitHub issue `body` (HTML converted) |
| `state` | Mapped from `github_state` (open→1/Active, closed→3/Closed Complete) |

### Unique Key (Deduplication)

Composite: `repository_url` + `github_issue_number`

### Labels

GitHub labels are mapped to ServiceNow `label` records and associated via the
standard label entry mechanism (`label_entry` table).

---

## Table 2: `x_snc_git_issue_milestone` (GitHub Milestone)

**Extends**: None (standalone table, or could extend `task` for consistency — TBD during implementation)

### Purpose
Stores GitHub milestones when using "Mirror Repository Structure" mode.

### Fields

| Field Label | Column Name | Type | Max Length | Mandatory | Notes |
|-------------|-------------|------|-----------|-----------|-------|
| Title | `title` | String | 255 | Yes | Milestone title |
| Description | `description` | HTML | 65000 | No | Milestone description (MD→HTML) |
| Milestone Number | `milestone_number` | Integer | — | Yes | GitHub milestone number (unique per repo) |
| Repository URL | `repository_url` | URL | 1024 | Yes | Full GitHub repo URL |
| GitHub URL | `github_url` | URL | 1024 | No | Direct link to milestone on GitHub |
| State | `state` | Choice | — | Yes | `open`, `closed` |
| Due Date | `due_date` | Date | — | No | Milestone due date |
| GitHub Created At | `github_created_at` | Date/Time | — | No | Original creation date on GitHub |
| GitHub Updated At | `github_updated_at` | Date/Time | — | No | Last update date on GitHub |
| GitHub Closed At | `github_closed_at` | Date/Time | — | No | Close date (if closed) |

### Unique Key (Deduplication)

Composite: `repository_url` + `milestone_number`

---

## Table 3: `x_snc_git_issue_sync_history` (Sync History Log)

**Extends**: None (standalone table)

### Purpose
Audit log of all sync operations performed.

### Fields

| Field Label | Column Name | Type | Max Length | Mandatory | Notes |
|-------------|-------------|------|-----------|-----------|-------|
| Repository URL | `repository_url` | URL | 1024 | Yes | Repo that was synced |
| Sync Mode | `sync_mode` | Choice | — | Yes | `mirror`, `user_story` |
| Issue State Filter | `state_filter` | Choice | — | Yes | `open`, `closed`, `all` |
| Update Existing | `update_existing` | True/False | — | No | Whether existing records were updated |
| Synced By | `synced_by` | Reference | — | Yes | → `sys_user` (who ran it) |
| Sync Start | `sync_start` | Date/Time | — | Yes | When the sync started |
| Sync End | `sync_end` | Date/Time | — | No | When the sync completed |
| Status | `status` | Choice | — | Yes | `in_progress`, `completed`, `failed` |
| Issues Created | `issues_created` | Integer | — | No | Count of new issue records |
| Issues Updated | `issues_updated` | Integer | — | No | Count of updated issue records |
| Issues Skipped | `issues_skipped` | Integer | — | No | Count of skipped (duplicate) records |
| Milestones Created | `milestones_created` | Integer | — | No | Count of new milestone records |
| Milestones Updated | `milestones_updated` | Integer | — | No | Count of updated milestones |
| Labels Created | `labels_created` | Integer | — | No | Count of new label records |
| Error Message | `error_message` | String | 4000 | No | Error details if sync failed |
| Credential Used | `credential` | Reference | — | No | → `sys_auth_credential` |

---

## Relationships Diagram

```
┌──────────────────────────┐
│  x_snc_git_issue_record  │
│  (extends task)          │
│                          │
│  milestone ─────────────────────┐
│  repository_url          │      │
│  github_issue_number     │      │
└──────────────────────────┘      │
                                  ▼
                    ┌──────────────────────────────┐
                    │  x_snc_git_issue_milestone   │
                    │                              │
                    │  milestone_number            │
                    │  repository_url              │
                    └──────────────────────────────┘

┌──────────────────────────────────┐
│  x_snc_git_issue_sync_history    │
│                                  │
│  synced_by → sys_user            │
│  credential → sys_auth_credential│
└──────────────────────────────────┘

┌────────────────┐       ┌─────────────┐
│  label_entry   │──────▶│   label     │
│  (OOTB)       │       │   (OOTB)    │
└────────────────┘       └─────────────┘
     ▲
     │ (associated via standard label mechanism)
     │
┌──────────────────────────┐
│  x_snc_git_issue_record  │
└──────────────────────────┘
```

---

## User Story Mode Mapping (No custom tables needed)

When "Map to User Stories" is selected:

| GitHub Entity | ServiceNow Target | Key Mapping |
|--------------|-------------------|-------------|
| Issue | `rm_story` | title→short_description, body (above AC)→description, AC section→acceptance_criteria |
| Milestone | `rm_epic` | title→short_description, description→description |
| Issue↔Milestone link | `rm_story.epic` | Reference to the created epic |

**Dedup for Story mode**: Store `repository_url` + `github_issue_number` in a custom field on `rm_story` or use a dictionary override / cross-reference table.

---

## Implementation Notes

1. **State Mapping** (Mirror mode):
   - GitHub `open` → Task state `1` (New/Open)
   - GitHub `closed` → Task state `3` (Closed Complete)

2. **Labels**: Use the global `label` table. Check if label with matching name exists; if not, create it. Then create `label_entry` to associate it with the issue record.

3. **Markdown Conversion**: 
   - For HTML fields (`body_html`, `description` on milestone): convert MD → HTML
   - For plain string fields (OOTB `description` on `rm_story`): convert MD → plain text (strip formatting)
   - For `acceptance_criteria` on `rm_story`: check field type — if HTML, convert; if string, strip to plain text

4. **Unique Constraint**: Consider adding a unique index on the composite key fields to enforce dedup at the database level.
