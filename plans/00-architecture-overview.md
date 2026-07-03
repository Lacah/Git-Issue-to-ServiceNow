# Plan 00: Architecture Overview

## App: Git Issue Sync (`x_snc_git_issue`)

### Purpose

Provide a way to synchronize GitHub Issues and Milestones from a remote GitHub
repository into a local ServiceNow instance. This enables the ServiceNow Build
Agent (and other users/tools) to work off of GitHub issues directly within
ServiceNow.

---

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  UI Page (React SPA)                     │
│  - Repo URL input                                       │
│  - Credential selector (reference field)                │
│  - Sync mode: Mirror | Map to User Stories              │
│  - Issue state filter: Open | Closed | All              │
│  - "Update existing" checkbox (re-sync)                 │
│  - Real-time progress display                           │
│  - Results summary + redirect                           │
└────────────────────────┬────────────────────────────────┘
                         │ Table API / REST calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Server-Side Script Includes                 │
│  - GitHubAPIClient (REST calls to GitHub)               │
│  - SyncOrchestrator (coordinates the sync)              │
│  - MarkdownConverter (MD → HTML / plain text)           │
│  - AcceptanceCriteriaParser (extract AC section)        │
│  - LabelManager (create/link ServiceNow labels)         │
│  - SyncLogger (audit/history)                           │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────────┐
│ Mirror Mode  │ │ Story Mode  │ │  Shared Tables   │
│              │ │             │ │                  │
│ git_issue_   │ │ rm_story    │ │ Sync History Log │
│   record     │ │ rm_epic     │ │ (audit table)    │
│ git_issue_   │ │             │ │                  │
│   milestone  │ │             │ │                  │
└──────────────┘ └─────────────┘ └──────────────────┘
```

---

### Sync Modes

| Mode | Target Tables | Issues → | Milestones → | Labels → |
|------|--------------|----------|--------------|----------|
| **Mirror Repository Structure** | Custom tables | `x_snc_git_issue_record` (extends Task) | `x_snc_git_issue_milestone` | `label` table (global) |
| **Map to User Stories** | OOTB Agile tables | `rm_story` | `rm_epic` | `label` table (global) |

---

### Authentication Strategy

1. **Primary**: Reference field pointing to a `sys_auth_credential` record (PAT or OAuth stored there).
2. **Check existing**: If the repo is already linked to an application on the instance, attempt to reuse that credential.
3. **Public repos**: Authentication is optional but recommended (rate limits: 60/hr unauthenticated vs 5000/hr authenticated).

---

### Deduplication Strategy

Each synced issue is uniquely identified by:
- **Repository URL** (normalized, e.g., `github.com/owner/repo`)
- **GitHub Issue Number** (unique within a repo)

This combination is stored on the target record and used to detect duplicates on re-sync.

---

### Re-Sync Behavior

- Manual trigger only (no scheduled sync for V1)
- If "Update existing" is **unchecked** (default): skip records that already exist
- If "Update existing" is **checked**: update existing records with latest data from GitHub

---

### Access Control

- **Admin only** for V1
- Future: custom role (`x_snc_git_issue.sync_admin` or similar)

---

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Technology | React UI Page | Modern, ServiceNow-branded, SPA experience |
| GitHub API | Scripted REST (sn_ws.RESTMessageV2) | Better pagination handling, dynamic URL construction |
| Markdown conversion | External npm library (`marked` or similar) | Robust, well-tested, handles edge cases |
| Progress tracking | Real-time updates via polling or streaming | Better UX during long syncs |
| Acceptance Criteria parsing | Configurable regex patterns | Easily adjustable patterns |
| No AI dependency | Pure script/regex logic | Reliable, predictable, no external AI calls |

---

### File Structure (Planned)

```
src/
├── fluent/
│   ├── tables/
│   │   ├── git-issue-record.now.ts
│   │   ├── git-issue-milestone.now.ts
│   │   └── sync-history.now.ts
│   ├── ui-page/
│   │   ├── git-issue-sync-page.now.ts    (page definition)
│   │   ├── main.tsx                       (React app)
│   │   ├── styles.css                     (styling)
│   │   └── components/
│   │       ├── SyncForm.tsx
│   │       ├── ProgressTracker.tsx
│   │       └── ResultsSummary.tsx
│   └── script-includes/
│       ├── github-api-client.now.ts
│       ├── sync-orchestrator.now.ts
│       ├── markdown-converter.now.ts
│       ├── acceptance-criteria-parser.now.ts
│       ├── label-manager.now.ts
│       └── sync-logger.now.ts
```

---

### V2 Considerations (Parked)

- Sync GitHub issue comments → ServiceNow work notes
- GitHub Projects V2 support
- Assignee mapping to ServiceNow users
- Scheduled/automatic sync
- Custom role for non-admin access
- Webhook-based real-time sync (GitHub → ServiceNow)
