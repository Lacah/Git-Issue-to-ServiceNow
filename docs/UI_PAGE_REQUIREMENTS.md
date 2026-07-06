# Git Issue Sync — UI Page Requirements & Implementation Notes

> **Purpose:** Persistent notes for any developer (human or AI) working on this app.
> Updated: 2026-07-05

---

## Critical Architecture Decision: Self-Contained UI Page (Plan B)

The UI page at `x_snc_git_issue_sync.do` **MUST** use the self-contained inline approach:

- **File:** `src/client/index.html`
- **Architecture:** All CSS and JS are inline within the HTML. The `<script>` block uses a `/* <![CDATA[ */ ... /* ]]> */` guard for XML/Jelly safety.
- **No React, no external modules.** The `main.tsx` file is a no-op that exists only to satisfy the build system.
- **Why:** The `.do` page environment cannot reliably serve JS modules with the correct MIME type. External `<script type="module" src="...">` tags result in blank pages. This was the root cause of repeated "page doesn't load" failures (Plan A).
- **Jelly constraints:** Never use `${` (template literals) or `$[` in inline JS — both trigger Jelly expression evaluation.

### DO NOT:
- Replace the inline approach with React/module imports
- Remove the CDATA guard
- Use ES6 template literals in the inline script
- Assume `main.tsx` does anything — it is intentionally empty

---

## Authentication — Direct PAT Input

- **UI:** Simple `<input type="password">` field labeled "Personal Access Token"
- **Placeholder:** `ghp_xxxxxxxxxxxxxxxxxxxx`
- **Help text:** "GitHub PAT with repo scope. Used for this sync only, never stored."
- **How it works:** The token is sent directly in the POST `/start` request body as `token`. The server passes it to `GitHubAPIClient`, which sets `Authorization: token <PAT>` on each GitHub API request.
- **Security:** The token is transmitted over HTTPS (ServiceNow enforces TLS) and is never persisted to any database table. It exists only in memory for the duration of the sync operation.

### Why NOT `discovery_credentials`

The `discovery_credentials` table **cannot** be used from scoped apps for the following reasons:

1. ❌ `sn_cc.StandardCredentialsProvider.getCredentialAttribute()` — method does not exist
2. ❌ `gr.getDecryptedValue('password')` — method does not exist on GlideRecord in scoped apps
3. ❌ `gr.getElement('password').getDecryptedValue()` — getElement returns GlideRecord, not GlideElement
4. ❌ `new GlideEncrypter().decrypt()` — SecurityException: blocked in scoped apps
5. ❌ `GlideRecord.getValue('password')` on discovery_credentials — returns encrypted blob, not plaintext
6. ❌ `RESTMessageV2.setAuthenticationProfile('basic', credSysId)` — expects a `sys_auth_profile_basic` record sys_id, NOT a `discovery_credentials` sys_id

All 5 decryption approaches and the `setAuthenticationProfile` workaround fail with SecurityExceptions or incorrect record type errors. The direct PAT input approach is the only reliable method for scoped apps authenticating to external APIs.

---

## Error Handling

- **`sync-start.ts`** — `categorizeError()` function maps error messages to user-friendly `{error, hint, code}` objects
- **UI `renderError()`** — Displays structured error with icon, message, and a "Troubleshooting" hint box
- **UI `getHintForError()`** — Client-side fallback for hint generation when errors come from polling (no server categorization available)

---

## REST API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/x_snc_git_issue/sync/start` | Start sync. Body: `{repository_url, token, sync_mode, state_filter, update_existing}` |
| GET | `/api/x_snc_git_issue/sync/progress/{sync_id}` | Poll sync progress |

### POST `/start` Payload

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repository_url` | string | Yes | Full GitHub repo URL (e.g., `https://github.com/owner/repo`) |
| `token` | string | No | GitHub Personal Access Token. Required for private repos, optional for public. |
| `sync_mode` | string | No | `"mirror"` (default) or `"user_story"` |
| `state_filter` | string | No | `"open"` (default), `"closed"`, or `"all"` |
| `update_existing` | boolean | No | Whether to update existing records (default: `false`) |

---

## Sync Flow

1. User fills form → clicks Start Sync
2. Client POSTs to `/start` with token in request body → server runs `SyncOrchestrator.startSync()` synchronously
3. On success: returns `{success: true, sync_id}`. Client polls `/progress/{id}`.
4. On failure: server catches exception, categorizes it, returns `{success: false, error, hint, code}`
5. Client renders structured error view with troubleshooting guidance

---

## Key Tables

| Table | Purpose |
|-------|---------|
| `x_snc_git_issue_record` | Mirrored GitHub issues |
| `x_snc_git_issue_milestone` | Mirrored GitHub milestones |
| `x_snc_git_issue_story_xref` | Cross-reference: issue ↔ story (user_story mode) |
| `x_snc_git_issue_sync_history` | Sync operation audit trail |
