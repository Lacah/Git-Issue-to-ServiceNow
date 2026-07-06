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

## Credential Field

- **Table:** `discovery_credentials` (NOT `sys_auth_credential`)
- **UI:** Reference-style typeahead field — user types to search, picks from dropdown results
- **REST endpoint:** `GET /api/x_snc_git_issue/sync/credentials?q=<search_term>` queries `discovery_credentials`
- **Token extraction:** Uses `RESTMessageV2.setAuthenticationProfile('basic', credentialSysId)` which lets ServiceNow's internal privileged REST engine handle credential decryption. The app NEVER decrypts credentials directly. The following approaches do NOT work in scoped apps:
  - ❌ `sn_cc.StandardCredentialsProvider.getCredentialAttribute()` — method does not exist
  - ❌ `gr.getDecryptedValue('password')` — method does not exist on GlideRecord in scoped apps
  - ❌ `gr.getElement('password').getDecryptedValue()` — getElement returns GlideRecord, not GlideElement
  - ❌ `new GlideEncrypter().decrypt()` — SecurityException: blocked in scoped apps
- **GitHub auth:** `setAuthenticationProfile('basic', sysId)` sends Basic Auth using the credential's username/password fields. GitHub accepts PATs as the password in Basic Auth.
- **Display:** Shows credential name + type + username in search results
- **On selection:** Shows a "chip" with the credential name and a clear (×) button

---

## Error Handling

- **`GitHubAPIClient._loadCredential()`** — Throws `CREDENTIAL_EMPTY` or `CREDENTIAL_ERROR` prefixed errors if a credential sys_id was provided but token extraction fails. Does NOT silently continue with empty token.
- **`sync-start.ts`** — `categorizeError()` function maps error messages to user-friendly `{error, hint, code}` objects
- **UI `renderError()`** — Displays structured error with icon, message, and a "Troubleshooting" hint box
- **UI `getHintForError()`** — Client-side fallback for hint generation when errors come from polling (no server categorization available)

---

## REST API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/x_snc_git_issue/sync/start` | Start sync. Body: `{repository_url, credential_sys_id, sync_mode, state_filter, update_existing}` |
| GET | `/api/x_snc_git_issue/sync/progress/{sync_id}` | Poll sync progress |
| GET | `/api/x_snc_git_issue/sync/credentials?q=<term>` | Search `discovery_credentials` table |

---

## Sync Flow

1. User fills form → clicks Start Sync
2. Client POSTs to `/start` → server runs `SyncOrchestrator.startSync()` synchronously
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
| `discovery_credentials` | Source of credentials for API auth |
