# Design: Git Issue Sync — UI Rebuild

**Date:** 2026-07-03
**Scope:** `x_snc_git_issue` (Git Issue Sync ServiceNow scoped app)
**Author:** Design produced collaboratively; **execution will be performed by a different model** following this spec and the implementation plan derived from it.

---

## 1. Context & Problem

The app synchronizes GitHub Issues/Milestones into ServiceNow. Backend (script includes, tables, Scripted REST API) works. The **UI Page `x_snc_git_issue_sync.do` renders blank** and multiple rebuild attempts (including the in-instance Build Agent) failed.

### Root cause (from the user's captured console log)

```
main.tsx:1 Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html". Strict MIME type checking
is enforced for module scripts per HTML spec.
```

The `<script type="module" src="main.tsx?uxpcb=…">` is served **`text/html` instead of JavaScript** — the compiled client bundle is not reaching the browser at the URL the page requests. The browser refuses to execute it, React never mounts, `<div id="root">` stays empty → blank page. **The React application code is not the problem; the now-sdk static-content build/serving pipeline for `.do` pages is.**

A secondary signal in the same log:
```
index.jsdbx?sysparm_replace_imports=true: Cannot assign to read only property '__esModule'
```
This is ServiceNow's platform module-import rewriter erroring. `@servicenow/react-components` rides this same machinery — a relevant robustness consideration (see Plan A).

### Hard constraints

- **The designer cannot deploy to or observe the ServiceNow instance.** The user is the sole tester. "Least likely to render blank" is therefore a primary design goal, and fixes must be structured as ordered hypotheses with explicit verification gates.
- **A different model executes.** This spec and its plan must be fully self-contained.
- Instance: `csucsu.service-now.com`.

### Decisions taken during brainstorming

1. **Two plans.** Plan A (primary): fix the React SPA so the preferred React UI renders. Plan B (fallback): a self-contained single-file UI Page to switch to when React trial-and-error is no longer worth it.
2. **Real live progress** (not a spinner) — accepted that this pulls a backend change (async execution) into scope.
3. Backend contract fixes required for a working UI are in scope.

---

## 2. Shared Foundation (both Plan A and Plan B build on this)

### 2.1 Backend: asynchronous execution

Today `SyncOrchestrator.startSync()` performs the entire sync synchronously inside the `POST /start` request and returns a bare `sys_id` **string**; the handler [`sync-start.ts`] misreads it as an object (`result.success`, `result.results` are `undefined`) and never returns real counts. Going async fixes both the blocking-request problem and the contract mismatch.

**New flow:**

1. **`POST /start`**: validate input → insert a `x_snc_git_issue_sync_history` record with `status = 'queued'` and the config fields (`repository_url`, `credential`, `sync_mode`, `state_filter`, `update_existing`, `synced_by`) → return `{ success: true, sync_id }` **immediately**. Do **not** run the sync inline.
2. **Async Business Rule** on `x_snc_git_issue_sync_history`, *after insert*, condition `status == 'queued'`: instantiate the orchestrator from the record's config and call `runExisting(current.sys_id)`. Runs in the background scheduler after commit, so the REST call already returned.
3. **`SyncOrchestrator` refactor**: add `runExisting(syncHistorySysId)` that operates on the **already-created** record instead of inserting a new one. Set `status = 'in_progress'`, then run the existing steps (validate → milestones → issues → complete) with the existing `_updateProgress(...)` calls unchanged. Keep `startSync()` intact for backward compatibility, or have it delegate to `runExisting` after creating a record.

**Chosen async mechanism:** async Business Rule (fewest moving parts, scoped-app friendly, no event registration). *Alternative considered:* `gs.eventQueue(...)` + Script Action — viable, more wiring; not chosen.

**Timeout / large-repo note:** because progress is now polled from a background job, the browser is no longer subject to the REST request timeout. The background job itself must complete within the scheduler's limits; oversized repos remain a backend concern and are out of scope here.

### 2.2 API contract (after changes)

| Endpoint | Request | Response |
|---|---|---|
| `POST /start` | `{repository_url, credential_sys_id, sync_mode, state_filter, update_existing}` | `{success, sync_id}` |
| `GET /progress/{sync_id}` | — | `{success, data:{ status, current_phase, percent_complete, progress_message, issues_created, issues_updated, issues_skipped, milestones_created, milestones_updated, labels_created, error_message, sync_mode, repository_url }}` |
| `GET /credentials` | — | `{success, data:[{sys_id, name, type}]}` |

**`/progress` requires no change — it already returns everything the UI needs, including all result counts.** `/credentials` requires no change. Only `/start` changes, plus the new Business Rule and orchestrator refactor.

`status` values: `queued`, `in_progress`, `completed`, `failed`.

### 2.3 UX flow (identical in both plans)

```
FORM ──submit──▶ POST /start ──▶ PROGRESS view
                                    │ poll GET /progress/{sync_id} every ~1500 ms
                                    │ render: percent bar + current phase + activity log
                                    │ (append a log line whenever phase or message changes)
                                    ├─ status = completed ─▶ RESULTS (counts + actions)
                                    └─ status = failed ────▶ ERROR card (error_message + retry)
```

- **Polling safety:** stop after a hard cap (~5 min) or 3 consecutive fetch errors; show a "sync still running — check Sync History" fallback rather than spinning forever.
- **Activity log** is derived from real backend state (phase/message transitions), so it does not lie.
- **Results actions:** *View list* → `mirror`: navigate to `x_snc_git_issue_record` list; `user_story`: navigate to `rm_story` list. *Sync another* → reset to the form view.

### 2.4 Form fields

| Field | Control | Notes |
|---|---|---|
| Repository URL | text, required | placeholder `https://github.com/owner/repo` |
| Credential | dropdown from `GET /credentials` | default option "None (public repo)"; helper "Optional for public repositories" |
| Sync Mode | two-option selector | values **`mirror`** \| **`user_story`** |
| Issue State Filter | radio / segmented | `open` \| `closed` \| `all` |
| Update existing records | checkbox | boolean |

**Bug fixed:** the current form emits `'story_map'` for the second sync mode, but the backend expects `'user_story'`. Standardize on `'user_story'` everywhere.

---

## 3. Plan A — Fix the React SPA (primary)

Attack the real failure (bundle served as `text/html`), not the UI code.

### 3.1 Robustness recommendation: remove `@servicenow/react-components`

Keep **React + react-dom** (plain); **remove `@servicenow/react-components`**; build form controls as plain elements styled with **Horizon design tokens** (`var(--now-color-*)`, `var(--now-spacing-*)`, `var(--now-border-radius-*)`). Rationale: the log shows the platform's `sysparm_replace_imports=true` rewriter erroring, and react-components imports route through that same layer — each is a chance for the bundle to fail to load. Plain React reproduces the same look with far less to break. This is a deliberate deviation from the ServiceNow ui-page skill (which mandates react-components), justified by the untestable environment and robustness priority. Reversible later.

### 3.2 Fix + verify ladder (execute top-down; stop when the page renders)

Each step has a **verification gate**; do not proceed past a gate until it passes.

1. **Build-before-install (top hypothesis).** `text/html` almost always means the compiled bundle was never deployed. Run `now-sdk build`; confirm `dist/static/` contains a compiled JS bundle and a processed `index.html`; inspect which script path/filename the processed `index.html` references. Then `now-sdk install`.
   **Gate:** open the module script's URL directly in the browser → must return `application/javascript`.
2. **Script-URL resolution.** If still `text/html`: in the Network tab, compare the URL the browser requests for the module against where the static content is actually served (a `.do` page resolves a relative `main.tsx` against the site root). Reconcile `now.config.json` `staticContentPaths` and the `<sdk:now-ux-globals>` base wiring.
   **Gate:** module script URL returns JS.
3. **Clean reinstall / stale record.** If mismatched: rely on the `uxpcb` cache-buster and perform a clean reinstall; delete a stale `sys_ui_page` record if one exists, then reinstall.
   **Gate:** module script URL returns JS.
4. **Next runtime error.** Once the bundle loads, read the console for the next error and fix it. Removing react-components (§3.1) pre-empts the `__esModule` failures here.
   **Gate:** `<div id="root">` mounts and the form renders.

### 3.3 Clean-up

- Remove the `Array.from` / `Element.Methods` polyfill hack from `index.html`; restore the minimal canonical template (`<html class="-polaris">`, `<sdk:now-ux-globals>`, single module script, `<div id="root">`).
- Rewrite the four components as plain React + token CSS; fix `story_map`→`user_story`; implement the §2.3 form→progress→results flow with `/progress` polling.

### 3.4 Client structure

```
src/client/
  index.html                 minimal canonical template
  main.tsx                   React bootstrap (createRoot)
  app.tsx                    view state machine: form | progress | results | error
  services/syncApi.ts        startSync(), pollProgress(), listCredentials()
  components/
    SyncForm.tsx             plain React controls + token CSS
    SyncProgress.tsx         percent bar + phase + activity log
    SyncResults.tsx          counts summary + actions (View list / Sync another)
  styles.css                 token-based styling
```

Keep files small and focused. Every fetch includes `X-UserToken: window.g_ck`.

### 3.5 Exit criterion → Plan B

If the ladder is exhausted (build verified but the module URL still won't serve as JS after steps 1–3) **or the user chooses to stop**, switch to Plan B. This is a clean handoff, not a restart: the backend changes (§2.1), API contract (§2.2), UX flow (§2.3), component markup, and CSS all carry over.

---

## 4. Plan B — Self-contained UI Page (fallback)

An option that structurally cannot hit the blank-page failure.

### 4.1 Delivery model

One `.do` UI Page whose HTML contains **everything inline**: markup + `<style>` + a single **classic** `<script>` (**not** `type="module"`; **no** external bundle; **no** `staticContentPaths`; **no** client build step). `UiPage({ html: page, direct: true })` carries the whole app.

**Why it's immune to the current failure:** the browser never requests a separate module, so there is no module for it to reject with a MIME error. The user's log proves the inline classic `<script>` (the polyfill) executed; only the external `type="module"` request failed.

### 4.2 Known gotcha + mitigation

`.do` UI Pages are processed as Jelly/XML, so raw `&&` or `<` in inline JS can break parsing (a likely reason someone originally reached for the module-script approach). Mitigations, both standard:

- Wrap the inline script body in `<![CDATA[ … ]]>` so JS operators pass through untouched.
- Avoid the literal `$[` sequence (Jelly expression trigger) in the JS.
- **De-risk first:** execution step 1 is a trivial smoke test — does a CDATA-wrapped inline script render the text `Hello` into `<div id="root">`? Only build the full UI once that renders.

### 4.3 Everything-else is shared

Identical backend (§2.1), API contract (§2.2), UX flow (§2.3), fields (§2.4), and Horizon-token styling. Only the client tech differs: a small vanilla-JS state machine (`fetch` `/start` → poll `/progress` → render form/progress/results DOM) replacing React. The app is small, which is what makes a single self-contained file the easiest thing to get right.

### 4.4 Trade-offs

- ✅ Guaranteed to render; zero build/serving surface; nothing external to fail.
- ➖ Not React / react-components; hand-rolled DOM updates (mitigated by small size and by porting markup/CSS from Plan A).

---

## 5. Files: add / change / delete

**Change (both plans):**
- `src/server/rest-api/sync-start.ts` — insert queued history record, return `{success, sync_id}`; stop running sync inline.
- `src/server/script-includes/SyncOrchestrator.js` — add `runExisting(sysId)`; operate on an existing record.

**Add (both plans):**
- Async Business Rule on `x_snc_git_issue_sync_history` (Fluent, `src/fluent/business-rules/…`) — runs the sync when `status == 'queued'`.

**Plan A:**
- Rewrite `src/client/index.html`, `main.tsx`, `app.tsx`, `components/*`, `styles.css`; add `services/syncApi.ts`.
- `package.json` — remove `@servicenow/react-components` (keep `react`, `react-dom`, `@types/react`).

**Plan B (when triggered):**
- Replace the client with a single self-contained `index.html` (inline CSS + CDATA-wrapped classic JS); `src/fluent/ui-pages/git-issue-sync.now.ts` keeps `html: page`, `direct: true`.

**No change:** `sync-progress.ts`, `credentials.ts`, `sync-api.now.ts` (routes), tables, other script includes.

---

## 6. Out of scope

- Comment/work-note sync, GitHub Projects V2, assignee mapping, scheduled/webhook sync (V2 roadmap).
- Non-admin roles / custom ACLs for the page.
- Backend performance/timeout hardening for very large repositories beyond the async move.
- Native `@servicenow/react-components` controls (intentionally removed in Plan A; reversible).
