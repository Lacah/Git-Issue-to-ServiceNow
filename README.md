# Git Issue Sync

A ServiceNow scoped application that synchronizes GitHub Issues and Milestones into a ServiceNow instance. It provides a modern React-based UI for configuration, real-time progress tracking, and results display.

| Property | Value |
|----------|-------|
| **Scope** | `x_snc_git_issue` |
| **Version** | 1.0.0 |
| **SDK** | Now SDK (Fluent) 4.8.1 |
| **UI** | React 18 SPA |
| **Access** | Admin-only (V1) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  UI Page (React SPA)                     │
│  - Repo URL input                                       │
│  - Credential selector                                  │
│  - Sync mode: Mirror | Map to User Stories              │
│  - Issue state filter / Update existing toggle          │
│  - Real-time progress + Results summary                 │
└────────────────────────┬────────────────────────────────┘
                         │ Scripted REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Server-Side Script Includes                 │
│  - GitHubAPIClient       - SyncOrchestrator             │
│  - MarkdownConverter     - AcceptanceCriteriaParser      │
│  - LabelManager                                         │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────────┐
│ Mirror Mode  │ │ Story Mode  │ │  Sync History    │
│ git_issue_   │ │ rm_story    │ │  (audit table)   │
│   record     │ │ rm_epic     │ │                  │
│ git_issue_   │ │             │ │                  │
│   milestone  │ │             │ │                  │
└──────────────┘ └─────────────┘ └──────────────────┘
```

---

## Features

### Two Sync Modes

| Mode | Target | Issues → | Milestones → |
|------|--------|----------|--------------|
| **Mirror Repository Structure** | Custom tables | `x_snc_git_issue_record` (extends Task) | `x_snc_git_issue_milestone` |
| **Map to User Stories** | OOTB Agile tables | `rm_story` | `rm_epic` |

### Core Capabilities

- **GitHub API Integration** — Full REST client with pagination (100/page), rate limit awareness, and PAT/OAuth authentication
- **Deduplication** — Composite key (`repository_url` + `github_issue_number`) prevents duplicates on re-sync
- **Re-sync Options** — Skip existing records or update them with latest data
- **Markdown Conversion** — GitHub-Flavored Markdown → HTML or plain text via `marked` library
- **Acceptance Criteria Parsing** — Splits issue body into description and AC sections using configurable regex patterns
- **Label Syncing** — GitHub labels mapped to ServiceNow `label` records with automatic associations
- **State Filtering** — Sync only Open, only Closed, or All issues
- **Progress Tracking** — Real-time polling during sync execution
- **Audit Logging** — Full sync history with counts (created/updated/skipped), timestamps, and errors

---

## Custom Tables

| Table | Label | Extends | Purpose |
|-------|-------|---------|---------|
| `x_snc_git_issue_record` | GitHub Issue | `task` | Stores issues in Mirror mode (auto-number: GHI) |
| `x_snc_git_issue_milestone` | GitHub Milestone | — | Stores milestones in Mirror mode |
| `x_snc_git_issue_sync_history` | Sync History | — | Audit log of all sync operations |
| `x_snc_git_issue_story_xref` | Story Cross-Reference | — | Dedup mapping for User Story mode |

---

## REST API

**Base Path:** `/api/x_snc_git_issue/v1/sync`

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/start` | Trigger a new sync operation |
| `GET` | `/progress/{sync_id}` | Poll current sync progress |
| `GET` | `/credentials` | List available auth credentials |

### Start Sync — Request Body

```json
{
  "repository_url": "https://github.com/owner/repo",
  "credential_sys_id": "abc123...",
  "sync_mode": "mirror",
  "state_filter": "open",
  "update_existing": false
}
```

---

## Script Includes

| Script Include | Responsibility |
|----------------|----------------|
| **GitHubAPIClient** | GitHub REST API communication, pagination, rate limiting |
| **SyncOrchestrator** | Full sync workflow coordination, dedup, progress tracking |
| **MarkdownConverter** | Markdown → HTML / plain text conversion |
| **AcceptanceCriteriaParser** | Splits issue body at configurable AC headings |
| **LabelManager** | Creates/finds ServiceNow labels and associations |

---

## UI Page

- **URL:** `x_snc_git_issue_sync.do`
- **Framework:** React 18 with `@servicenow/react-components`
- **Design:** ServiceNow Horizon design system with CSS design tokens
- **Flow:** Configuration form → Progress display → Results summary

---

## Project Structure

```
src/
├── client/                    # React SPA (UI Page frontend)
│   ├── app.tsx               # Main application component
│   ├── index.html            # HTML entry point
│   ├── main.tsx              # React mount point
│   └── styles.css            # Design-token-based styling
├── fluent/                    # Fluent DSL metadata definitions
│   ├── tables/               # 4 custom table definitions
│   ├── script-includes/      # 5 script include definitions
│   ├── rest-api/             # Scripted REST API (3 routes)
│   ├── ui-pages/             # UI Page definition
│   ├── views/                # Form views for each table
│   ├── navigation/           # App menu navigation module
│   └── properties/           # System property (AC patterns)
├── server/
│   ├── rest-api/             # REST route handler scripts
│   └── script-includes/      # Server-side business logic (JS)
└── modules/server/           # npm module wrappers (marked)
```

---

## Prerequisites

1. **ServiceNow Instance** — A running instance with admin access
2. **Now SDK** — Version 4.8.1+ installed
3. **GitHub Credential** — Create a `sys_auth_credential` record with a Personal Access Token (recommended: 5000 req/hr vs 60/hr unauthenticated)

---

## Setup & Deployment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to instance
npm run deploy
```

---

## Configuration

| System Property | Purpose | Default |
|-----------------|---------|---------|
| `x_snc_git_issue.ac_patterns` | Newline-separated regex patterns for detecting Acceptance Criteria headings | `^#{1,3}\s*Acceptance\s*Criteria\s*:?\s*$` and variants |

---

## Authentication

| Priority | Method |
|----------|--------|
| 1 | User-selected credential from `sys_auth_credential` |
| 2 | Public repo (no auth, 60 req/hr rate limit) |

Supported types: Personal Access Token (`token <PAT>`), OAuth (`Bearer <token>`)

---

## Future Roadmap (V2)

- Sync GitHub issue comments → ServiceNow work notes
- GitHub Projects V2 support
- Assignee mapping to ServiceNow users
- Scheduled/automatic sync
- Webhook-based real-time sync
- Custom role for non-admin access

---

## License

Proprietary — ServiceNow Scoped Application
