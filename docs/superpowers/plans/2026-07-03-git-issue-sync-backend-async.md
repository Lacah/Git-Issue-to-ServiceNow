# Git Issue Sync — Backend Async Foundation Implementation Plan

> **For any executor:** This plan is self-contained. Steps use checkbox (`- [ ]`) syntax for tracking. Do tasks in order; each ends with a verification gate you must pass before moving on. There is **no client/unit test harness** in this ServiceNow scoped app and you must **not** add build/test configs — verification is done by deploying to the instance and observing behavior.

**Goal:** Make the GitHub sync run asynchronously so `POST /start` returns a `sync_id` immediately and the UI can poll `GET /progress/{sync_id}` for live progress.

**Architecture:** `POST /start` inserts a `x_snc_git_issue_sync_history` record with `status='queued'` and returns its `sys_id`. An **async Business Rule** (fires on insert when `status=='queued'`) runs `SyncOrchestrator.runExisting(sys_id)` in the background. The orchestrator writes phase/percent/counts to that record as it runs; `/progress` (already implemented) reads them back.

**Tech Stack:** ServiceNow Now SDK (Fluent) 4.8.1, scoped app `x_snc_git_issue`, server JS/TS (Rhino engine), GlideRecord, Business Rules.

## Global Constraints

- Scope: `x_snc_git_issue` (from `now.config.json`). Always use full scoped table name `x_snc_git_issue_sync_history`.
- Deploy with: `npm install` (first time) → `npm run build` → `npm run deploy` (these map to `now-sdk build` / `now-sdk install`). Never add webpack/vite/babel/tsconfig or npm build scripts.
- Sync-mode values are exactly `mirror` and `user_story` (never `story_map`).
- `x_snc_git_issue_sync_history.status` valid values after Task 1: `queued`, `in_progress`, `completed`, `completed_with_errors`, `failed`. Terminal-success = `completed` or `completed_with_errors`; terminal-failure = `failed`.
- `sync_start` and `synced_by` are **mandatory** columns — always set them when inserting a history record.
- Server files follow the repo's existing import style: `import { gs, GlideRecord } from '@servicenow/glide';` and scoped script includes via `import { X } from '@servicenow/glide/x_snc_git_issue';` (with `// @ts-ignore` on the generated-types import).

---

### Task 1: Add `queued` status choice to the Sync History table

**Files:**
- Modify: `src/fluent/tables/sync-history.now.ts:58-68` (the `status` ChoiceColumn)

**Interfaces:**
- Produces: a `queued` choice value usable by `/start` (Task 3) and the Business Rule condition (Task 4).

- [ ] **Step 1: Add the `queued` choice**

Replace the `status` column's `choices` block so it reads:

```ts
        status: ChoiceColumn({
            label: "Status",
            mandatory: true,
            dropdown: "dropdown_without_none",
            choices: {
                queued: { label: "Queued", sequence: 0 },
                in_progress: { label: "In Progress", sequence: 1 },
                completed: { label: "Completed", sequence: 2 },
                completed_with_errors: { label: "Completed with Errors", sequence: 3 },
                failed: { label: "Failed", sequence: 4 },
            },
        }),
```

- [ ] **Step 2: Verify the build accepts it**

Run: `npm run build`
Expected: build completes with no errors mentioning `sync-history` or `status`.

- [ ] **Step 3: Commit**

```bash
git add src/fluent/tables/sync-history.now.ts
git commit -m "feat: add 'queued' status to sync history table"
```

---

### Task 2: Add `runExisting()` to SyncOrchestrator

**Files:**
- Modify: `src/server/script-includes/SyncOrchestrator.js:13-49` (split `startSync`, add `runExisting` + `_run`)

**Interfaces:**
- Consumes: existing private methods `_createSyncHistory`, `_updateProgress`, `_processMilestones`, `_processIssues`, `_completeSyncHistory`, `_failSyncHistory`, and `this._config`, `this._apiClient`, `this._syncHistorySysId` (all already present).
- Produces: `runExisting(syncHistorySysId: string): string` — runs the sync against an already-created history record and returns its sys_id. `startSync()` keeps its existing behavior.

- [ ] **Step 1: Replace the `startSync` method (lines 13-49) with three methods**

```js
    startSync: function() {
        this._createSyncHistory();
        return this._run();
    },

    runExisting: function(syncHistorySysId) {
        this._syncHistorySysId = syncHistorySysId;
        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        if (gr.get(syncHistorySysId)) {
            gr.setValue('status', 'in_progress');
            gr.setValue('sync_start', new GlideDateTime().getDisplayValue());
            gr.update();
        }
        return this._run();
    },

    _run: function() {
        try {
            this._updateProgress('Validating', 0, 1, 0, 'Validating repository access...');
            this._apiClient.getRepoInfo();

            this._updateProgress('Milestones', 0, 0, 5, 'Fetching milestones...');
            var milestones = this._apiClient.getMilestones(this._config.stateFilter === 'all' ? 'all' : this._config.stateFilter);
            this._updateProgress('Milestones', 0, milestones.length, 10, 'Processing milestones...');
            this._processMilestones(milestones);

            this._updateProgress('Issues', 0, 0, 30, 'Fetching issues...');
            var issues = this._apiClient.getIssues(this._config.stateFilter === 'all' ? 'all' : this._config.stateFilter);

            var filteredIssues = [];
            for (var i = 0; i < issues.length; i++) {
                if (!issues[i].pull_request) {
                    filteredIssues.push(issues[i]);
                }
            }

            this._updateProgress('Issues', 0, filteredIssues.length, 35, 'Processing issues...');
            this._processIssues(filteredIssues);

            this._completeSyncHistory('completed');
        } catch (e) {
            this._failSyncHistory(e.message || String(e));
            throw e;
        }

        return this._syncHistorySysId;
    },
```

Leave every other method in the file unchanged.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/server/script-includes/SyncOrchestrator.js
git commit -m "feat: add SyncOrchestrator.runExisting for async execution"
```

---

### Task 3: Rewrite `POST /start` to enqueue and return immediately

**Files:**
- Modify: `src/server/rest-api/sync-start.ts` (whole file)

**Interfaces:**
- Consumes: request body `{repository_url, credential_sys_id, sync_mode, state_filter, update_existing}`.
- Produces: HTTP 200 `{success:true, sync_id}` on success; 400 `{success:false, error}` on validation failure; 500 on exception. No longer runs the sync inline; no longer imports `SyncOrchestrator`.

- [ ] **Step 1: Replace the entire file**

```ts
import { gs, GlideRecord } from '@servicenow/glide';

export function startSync(request: any, response: any) {
    try {
        var body = request.body.data;

        var repoUrl = body.repository_url || '';
        var credentialSysId = body.credential_sys_id || '';
        var syncMode = body.sync_mode || 'mirror';
        var stateFilter = body.state_filter || 'open';
        var updateExisting = body.update_existing || false;

        if (!repoUrl) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'repository_url is required' });
            return;
        }

        if (syncMode !== 'mirror' && syncMode !== 'user_story') {
            response.setStatus(400);
            response.setBody({ success: false, error: 'sync_mode must be "mirror" or "user_story"' });
            return;
        }

        var gr = new GlideRecord('x_snc_git_issue_sync_history');
        gr.initialize();
        gr.setValue('repository_url', repoUrl);
        gr.setValue('sync_mode', syncMode);
        gr.setValue('state_filter', stateFilter);
        gr.setValue('update_existing', updateExisting ? true : false);
        gr.setValue('synced_by', gs.getUserID());
        gr.setValue('sync_start', new GlideDateTime().getDisplayValue());
        gr.setValue('status', 'queued');
        if (credentialSysId) {
            gr.setValue('credential', credentialSysId);
        }
        var syncId = gr.insert();

        if (!syncId) {
            response.setStatus(500);
            response.setBody({ success: false, error: 'Failed to create sync record' });
            return;
        }

        response.setStatus(200);
        response.setBody({ success: true, sync_id: syncId });
    } catch (e: any) {
        response.setStatus(500);
        response.setBody({ success: false, error: 'Internal server error: ' + e.message });
    }
}
```

> Note: `GlideDateTime` is a Rhino global available in server scripts; no import is needed (this matches how `SyncOrchestrator.js` uses it).

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/server/rest-api/sync-start.ts
git commit -m "feat: /start enqueues a sync and returns sync_id immediately"
```

---

### Task 4: Add the async Business Rule that runs queued syncs

**Files:**
- Create: `src/server/business-rules/run-queued-sync.ts`
- Create: `src/fluent/business-rules/run-queued-sync.now.ts`

**Interfaces:**
- Consumes: `SyncOrchestrator.runExisting(sysId)` (Task 2); the `queued` status (Task 1); the inserted history record via the BR global `current`.
- Produces: a Business Rule metadata record that runs the sync in the background.

- [ ] **Step 1: Create the Business Rule script**

`src/server/business-rules/run-queued-sync.ts`:

```ts
// @ts-ignore - types generated at build time
import { SyncOrchestrator } from '@servicenow/glide/x_snc_git_issue';

// `current` is the newly-inserted sync history GlideRecord, injected by the
// Business Rule runtime.
declare const current: any;

export function runQueuedSync() {
    var config = {
        repoUrl: current.getValue('repository_url'),
        credentialSysId: current.getValue('credential') || '',
        syncMode: current.getValue('sync_mode'),
        stateFilter: current.getValue('state_filter'),
        updateExisting: current.getValue('update_existing') == '1'
    };

    var orchestrator = new SyncOrchestrator(config);
    orchestrator.runExisting(current.getUniqueValue());
}
```

- [ ] **Step 2: Create the Fluent Business Rule definition**

`src/fluent/business-rules/run-queued-sync.now.ts`:

```ts
import "@servicenow/sdk/global";
import { BusinessRule } from "@servicenow/sdk/core";
import { runQueuedSync } from "../../server/business-rules/run-queued-sync";

BusinessRule({
    $id: Now.ID["br-run-queued-sync"],
    name: "Run Queued Sync",
    table: "x_snc_git_issue_sync_history",
    when: "async",
    action: ["insert"],
    condition: "current.status == 'queued'",
    order: 100,
    active: true,
    script: runQueuedSync,
    description: "Runs a GitHub sync in the background when a queued sync history record is inserted."
});
```

- [ ] **Step 3: Verify the build (generates the new `Now.ID` key)**

Run: `npm run build`
Expected: build completes; `src/fluent/generated/keys.ts` now contains a `br-run-queued-sync` entry. If the build complains the id is unknown, run it once more (the first build generates the key).

- [ ] **Step 4: Commit**

```bash
git add src/server/business-rules/run-queued-sync.ts src/fluent/business-rules/run-queued-sync.now.ts src/fluent/generated/keys.ts
git commit -m "feat: async business rule runs queued GitHub syncs"
```

---

### Task 5: Deploy and verify end-to-end (no UI yet)

**Files:** none (deploy + observe).

- [ ] **Step 1: Deploy to the instance**

Run: `npm run build && npm run deploy`
Expected: install completes without error; the app updates on `csucsu.service-now.com`.

- [ ] **Step 2: Confirm the Business Rule installed**

In the instance: **System Definition → Business Rules**, filter Name = `Run Queued Sync`.
Expected: one active rule, Table `Sync History [x_snc_git_issue_sync_history]`, When `async`, Insert = true.

- [ ] **Step 3: Confirm the REST base path (write it down — the UI plans need it)**

In the instance: **System Web Services → Scripted REST APIs → Git Issue Sync API**. Read the **Base API path** (e.g. `/api/x_snc_git_issue/sync` or `/api/x_snc_git_issue/v1/sync`). Record the exact value — Plan A / Plan B set `API_BASE` to `<Base API path>`.

- [ ] **Step 4: Trigger a sync via REST API Explorer**

In the instance: **System Web Services → REST API Explorer**. Select namespace `x_snc_git_issue`, the `Git Issue Sync API`, method `POST /start`. Request body:

```json
{
  "repository_url": "https://github.com/octocat/Hello-World",
  "credential_sys_id": "",
  "sync_mode": "mirror",
  "state_filter": "all",
  "update_existing": false
}
```

Send.
Expected: HTTP 200, body `{ "success": true, "sync_id": "<32-char sys_id>" }` returned within ~1 second (it must NOT block for the whole sync).

- [ ] **Step 5: Watch the record transition (proves async execution)**

In the instance: open the list `x_snc_git_issue_sync_history` (navigate to `x_snc_git_issue_sync_history_list.do`). Open the record with the `sync_id` from Step 4 and refresh every few seconds.
Expected sequence: `status` goes `queued` → `in_progress` → `completed` (or `completed_with_errors`); `percent_complete` climbs to 100; `current_phase`/`progress_message` update; `issues_created` / `milestones_created` populate.

- [ ] **Step 6: Verify the progress endpoint returns the same data**

In REST API Explorer, call `GET /progress/{sync_id}` with the `sync_id` from Step 4.
Expected: HTTP 200, `{ success:true, data:{ status:"completed", percent_complete:100, issues_created:<n>, ... } }`.

- [ ] **Step 7: Commit (docs/notes only, if any)**

If you recorded the Base API path in a scratch note, no commit is needed. This task has no code changes.

---

## Self-Review (performed by planner)

- **Spec coverage:** §2.1 async execution → Tasks 2,3,4; §2.2 contract (`/start` returns `{success,sync_id}`, `/progress` unchanged) → Task 3 + Task 5 Step 6; `queued` prerequisite → Task 1. ✅
- **Type consistency:** `runExisting(sysId)` defined in Task 2, consumed in Task 4. `config` keys (`repoUrl`, `credentialSysId`, `syncMode`, `stateFilter`, `updateExisting`) match `SyncOrchestrator.initialize`'s existing usage. ✅
- **Placeholders:** none. ✅

## Next

After this foundation is verified, proceed to **Plan A** (`2026-07-03-git-issue-sync-plan-a-react.md`). If you later abandon React, go to **Plan B** (`2026-07-03-git-issue-sync-plan-b-selfcontained.md`) — it depends on this same foundation.
