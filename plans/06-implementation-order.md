# Plan 06: Implementation Order & Dependencies

## Overview

This document defines the order in which components should be built, considering
dependencies between them.

---

## Implementation Phases

### Phase 1: Foundation (Data Model)

**Goal**: Establish the tables and data structures.

| # | Task | Depends On | Output |
|---|------|-----------|--------|
| 1.1 | Create `x_snc_git_issue_milestone` table | — | Table with all fields |
| 1.2 | Create `x_snc_git_issue_record` table (extends task) | 1.1 (milestone ref) | Table with all fields |
| 1.3 | Create `x_snc_git_issue_sync_history` table | — | Audit log table |
| 1.4 | Create `x_snc_git_issue_story_xref` table (cross-ref for story mode dedup) | — | Lightweight xref table |
| 1.5 | Add `marked` npm dependency | — | package.json updated |

**Deliverable**: All tables created and deployable.

---

### Phase 2: Core Logic (Script Includes)

**Goal**: Build the server-side logic that powers the sync.

| # | Task | Depends On | Output |
|---|------|-----------|--------|
| 2.1 | Build `MarkdownConverter` script include | 1.5 (marked dep) | MD→HTML, MD→plaintext |
| 2.2 | Build `AcceptanceCriteriaParser` script include | — | Body splitting logic |
| 2.3 | Build `GitHubAPIClient` script include | — | GitHub REST calls + pagination |
| 2.4 | Build `LabelManager` script include | — | Label creation + association |
| 2.5 | Build `SyncOrchestrator` script include | 2.1, 2.2, 2.3, 2.4, Phase 1 tables | Full sync coordination |

**Deliverable**: All sync logic functional, testable via background script.

---

### Phase 3: API Layer

**Goal**: Expose the sync functionality to the UI.

| # | Task | Depends On | Output |
|---|------|-----------|--------|
| 3.1 | Create Scripted REST API endpoint: `POST /sync/start` | Phase 2 | Kicks off sync, returns sync_id |
| 3.2 | Create Scripted REST API endpoint: `GET /sync/progress/{id}` | Phase 1 (sync_history table) | Returns current progress |
| 3.3 | Create Scripted REST API endpoint: `GET /sync/credentials` | — | Returns available credentials |

**OR** (simpler approach): Use the Table API directly for sync_history polling
and a single custom endpoint to trigger the sync.

**Deliverable**: UI can communicate with server-side logic.

---

### Phase 4: UI Page

**Goal**: Build the React-based user interface.

| # | Task | Depends On | Output |
|---|------|-----------|--------|
| 4.1 | Create UI Page definition (.now.ts) | — | Page registered in ServiceNow |
| 4.2 | Build main.tsx (app shell, routing between views) | — | React app structure |
| 4.3 | Build SyncForm component | — | Configuration form |
| 4.4 | Build ProgressTracker component | — | Real-time progress display |
| 4.5 | Build ResultsSummary component | — | Results + action buttons |
| 4.6 | Build styles.css | — | Full styling with design tokens |
| 4.7 | Wire up API calls (form → start sync → poll → results) | 4.2-4.5, Phase 3 | End-to-end flow |

**Deliverable**: Fully functional UI page.

---

### Phase 5: Polish & Configuration

**Goal**: System properties, access control, final touches.

| # | Task | Depends On | Output |
|---|------|-----------|--------|
| 5.1 | Create system property for AC patterns | — | Configurable regex patterns |
| 5.2 | Verify admin-only access (ACLs on custom tables) | Phase 1 | Security |
| 5.3 | Add navigation module (link in app menu) | Phase 4 | Easy access to UI page |
| 5.4 | End-to-end testing | All phases | Verified working |

**Deliverable**: Production-ready V1.

---

## Dependency Graph

```
Phase 1 (Tables)
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 2 (Scripts)    Phase 4.1-4.5 (UI components, parallel)
    │                      │
    ▼                      │
Phase 3 (API)              │
    │                      │
    └──────────┬───────────┘
               ▼
         Phase 4.7 (Wire up)
               │
               ▼
         Phase 5 (Polish)
```

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| `marked` lib doesn't work in SN Script Include context | High | Test early in Phase 2.1. Fallback: build regex-based converter |
| GitHub API pagination edge cases | Medium | Test with repos of varying sizes (0, 30, 100, 500+ issues) |
| Label table access from scoped app | Medium | Test label creation early. May need global scope or cross-scope access |
| rm_story / rm_epic access from scoped app | Medium | Verify table API access to OOTB Agile tables from our scope |
| Real-time progress polling performance | Low | Use reasonable poll interval (2s), limit returned fields |
| Large repos causing timeout | Medium | Process in batches, consider async pattern if needed |
| Credential access from scoped app | Medium | Verify sys_auth_credential readable from this scope |

---

## Estimation (Rough)

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1: Tables | Small | Straightforward Fluent DSL |
| Phase 2: Script Includes | Large | Core logic, most complexity |
| Phase 3: API Layer | Small | Thin wrapper around orchestrator |
| Phase 4: UI Page | Large | React app with multiple views |
| Phase 5: Polish | Small | Configuration + testing |

---

## What to Build First (Recommended)

If building incrementally with the Build Agent:

1. **Start with Phase 1** (tables) — quick win, establishes data model
2. **Then Phase 2.3** (GitHubAPIClient) — validates GitHub connectivity works
3. **Then Phase 2.1-2.2** (converters) — isolated, testable
4. **Then Phase 2.4-2.5** (label manager + orchestrator) — ties it together
5. **Then Phase 4** (UI) — visualization of the working backend
6. **Then Phase 3** (API) — connects UI to backend
7. **Finally Phase 5** (polish) — clean up and secure

This order allows testing at each stage and catching integration issues early.
