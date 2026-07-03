# Plan 05: UI Page (React SPA)

## Overview

A single-page React application served as a ServiceNow UI Page. It provides the
full user interface for configuring and executing GitHub issue syncs.

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
│  ┌───────────────┐                                              │
│  │ GitHub Icon   │  Git Issue Sync                              │
│  └───────────────┘  Synchronize GitHub issues to ServiceNow     │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  ┌─── CONFIGURATION CARD ────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Repository URL                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ https://github.com/owner/repo                        │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Credential                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ [Reference field → sys_auth_credential]              │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │  ℹ️  Optional for public repos. Required for private.      │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────     │  │
│  │                                                            │  │
│  │  Sync Mode                                                 │  │
│  │  ┌─────────────────────────┐ ┌──────────────────────────┐ │  │
│  │  │ 🪞 Mirror Repository    │ │ 📖 Map to User Stories   │ │  │
│  │  │    Structure            │ │                          │ │  │
│  │  │                         │ │ Issues → Stories         │ │  │
│  │  │ Issues → Custom Table   │ │ Milestones → Epics      │ │  │
│  │  │ Milestones → Custom     │ │                          │ │  │
│  │  └─────────────────────────┘ └──────────────────────────┘ │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────     │  │
│  │                                                            │  │
│  │  Issue State Filter                                        │  │
│  │  ○ Open (default)   ○ Closed   ○ All                      │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────     │  │
│  │                                                            │  │
│  │  Re-sync Options                                           │  │
│  │  ☐ Update existing records                                 │  │
│  │  (If unchecked, already-synced issues will be skipped)     │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────     │  │
│  │                                                            │  │
│  │        ┌──────────────────────────────┐                    │  │
│  │        │    🔄  Start Sync            │                    │  │
│  │        └──────────────────────────────┘                    │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Progress View (replaces form after sync starts)

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
│  Git Issue Sync — Syncing...                                    │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  ┌─── PROGRESS CARD ─────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Repository: github.com/owner/repo                         │  │
│  │  Mode: Mirror Repository Structure                         │  │
│  │                                                            │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░  68%          │  │
│  │                                                            │  │
│  │  📋 Phase: Processing Issues                               │  │
│  │  📄 Current: Issue #23 — "Fix authentication flow"         │  │
│  │  📊 Progress: 32 of 47 issues                              │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────     │  │
│  │                                                            │  │
│  │  Activity Log:                                             │  │
│  │  ✅ Connected to repository                                │  │
│  │  ✅ Fetched 3 milestones                                   │  │
│  │  ✅ Created 3 milestone records                            │  │
│  │  ✅ Fetched 47 issues (1 page)                             │  │
│  │  ⏳ Processing issues... (32/47)                           │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Results View (after sync completes)

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
│  Git Issue Sync — Complete ✅                                   │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  ┌─── RESULTS CARD ──────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ✅ Sync completed successfully!                           │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │  Summary                                           │    │  │
│  │  │                                                    │    │  │
│  │  │  Issues Created:    35                             │    │  │
│  │  │  Issues Updated:     8                             │    │  │
│  │  │  Issues Skipped:     4                             │    │  │
│  │  │  Milestones Created: 3                             │    │  │
│  │  │  Labels Created:    12                             │    │  │
│  │  │  ──────────────────────────────                    │    │  │
│  │  │  Total Time:        12.3 seconds                   │    │  │
│  │  │                                                    │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  │  ┌────────────────────────┐  ┌─────────────────────────┐  │  │
│  │  │  📋 View Issues List   │  │  🔄 Sync Another Repo  │  │  │
│  │  └────────────────────────┘  └─────────────────────────┘  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## React Component Architecture

```
App (main.tsx)
├── Header
├── SyncForm (configuration inputs)
│   ├── RepoUrlInput
│   ├── CredentialSelector (reference field)
│   ├── SyncModeSelector (card-based toggle)
│   ├── StateFilter (radio buttons)
│   ├── ResyncOptions (checkbox)
│   └── StartButton
├── ProgressTracker (shown during sync)
│   ├── ProgressBar
│   ├── PhaseIndicator
│   └── ActivityLog
└── ResultsSummary (shown after completion)
    ├── SummaryStats
    └── ActionButtons (view list, sync another)
```

---

## State Management

```typescript
// App states
type AppView = 'form' | 'progress' | 'results' | 'error';

interface AppState {
  view: AppView;
  
  // Form state
  repoUrl: string;
  credentialSysId: string;
  syncMode: 'mirror' | 'user_story';
  stateFilter: 'open' | 'closed' | 'all';
  updateExisting: boolean;
  
  // Progress state
  syncHistoryId: string;
  phase: string;
  currentItem: number;
  totalItems: number;
  message: string;
  percentComplete: number;
  activityLog: LogEntry[];
  
  // Results state
  results: SyncResults;
}
```

---

## API Calls (UI → Server)

### 1. Start Sync

```
POST /api/now/table/x_snc_git_issue_sync_history
or
Custom Scripted REST API endpoint: POST /api/x_snc_git_issue/sync/start
```

**Request Body:**
```json
{
  "repository_url": "https://github.com/owner/repo",
  "credential_sys_id": "abc123...",
  "sync_mode": "mirror",
  "state_filter": "open",
  "update_existing": false
}
```

**Response:**
```json
{
  "sync_id": "xyz789...",
  "status": "started"
}
```

### 2. Poll Progress

```
GET /api/now/table/x_snc_git_issue_sync_history/{sync_id}?sysparm_fields=status,current_phase,current_item,total_items,message,percent_complete
```

### 3. Get Results

```
GET /api/now/table/x_snc_git_issue_sync_history/{sync_id}
```

---

## Credential Reference Field

The credential selector needs to query `sys_auth_credential` and let the user
pick a record. Implementation options:

1. **Simple dropdown**: Fetch credentials via Table API, display as `<select>`
2. **Typeahead/autocomplete**: For instances with many credentials
3. **Optional**: Show "(Optional for public repos)" helper text

```
GET /api/now/table/sys_auth_credential?sysparm_fields=sys_id,name,type&sysparm_limit=50
```

---

## Styling Approach

- Use ServiceNow design tokens (CSS variables) throughout
- Dark mode support via token-based theming
- Responsive layout (though primarily desktop-focused)
- Card-based UI with clear visual hierarchy
- Smooth transitions between views (form → progress → results)
- ServiceNow Horizon design system patterns

---

## Key UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sync mode selector | Visual cards (not dropdown) | More engaging, clearer descriptions |
| State filter | Radio buttons | Only 3 options, all visible |
| Progress | Progress bar + activity log | Real-time feedback without overwhelming |
| Results redirect | Button (not auto-redirect) | User can review results first |
| Error display | Inline alert (not modal) | Less intrusive, allows retry |

---

## Navigation After Completion

When user clicks "View Issues List":
- **Mirror mode**: Navigate to `/now/nav/ui/list/x_snc_git_issue_record`
- **Story mode**: Navigate to `/now/nav/ui/list/rm_story`

When user clicks "Sync Another Repo":
- Reset form, return to form view

---

## Accessibility

- All form inputs have labels
- Progress bar has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Activity log uses `aria-live="polite"` for screen reader updates
- Color is not the only indicator of state (icons + text + color)
- Focus management when switching views
- Keyboard navigation for sync mode cards
