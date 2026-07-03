# Git Issue Sync — Plan A: Fix the React SPA Implementation Plan

> **For any executor:** Self-contained; checkbox (`- [ ]`) steps. **Prerequisite:** the backend foundation plan (`2026-07-03-git-issue-sync-backend-async.md`) is deployed and verified. There is **no client test harness** and you must **not** add build/test configs — verification is deploy + observe in the browser. Do tasks in order.

**Goal:** Make the React UI at `x_snc_git_issue_sync.do` actually render, by fixing the bundle-serving failure (module served as `text/html`) and rebuilding the client as plain, robust React that drives the async `/start` + `/progress` flow.

**Architecture:** Plain React 18 (no `@servicenow/react-components`) mounted on the UI Page. A tiny service layer calls the Scripted REST API; `App` is a `form → progress → results/error` state machine that polls `/progress` every 1.5 s. Styling uses Horizon design tokens.

**Tech Stack:** React 18.2.0, react-dom 18.2.0, TypeScript/TSX, ServiceNow Now SDK UiPage (`direct: true`), Horizon CSS variables.

## Global Constraints

- Do **not** add webpack/vite/babel configs or npm build scripts. The Now SDK IDE handles bundling. Deploy with `npm run build && npm run deploy`.
- **Remove `@servicenow/react-components`** — it routes through the platform module-import rewriter that errors in the captured log. Keep only `react`, `react-dom` (+ `@types/react`).
- CSS: import via ESM in TSX only (`import './styles.css'`). No CSS Modules, no `@import`, no `<link>`.
- Every `fetch` includes header `X-UserToken: window.g_ck`.
- `API_BASE` must equal the deployed **Base API path** (recorded in the backend plan, Task 5 Step 3). Examples: `/api/x_snc_git_issue/sync`. **Do not guess — use the recorded value.**
- Sync-mode values: `mirror`, `user_story`. Terminal-success statuses: `completed`, `completed_with_errors`. Terminal-failure: `failed`.
- HTML rules: no `<!DOCTYPE>`, no XML preamble, self-close void elements, keep `<html class="-polaris">`, `<sdk:now-ux-globals>`, and the `type="module"` script.

---

### Task A1: Remove `@servicenow/react-components` from dependencies

**Files:**
- Modify: `package.json` (`dependencies`)

- [ ] **Step 1: Edit `dependencies`**

Set the `dependencies` block to exactly (preserve `marked`; drop `@servicenow/react-components`):

```json
    "dependencies": {
        "marked": "9.1.6",
        "react": "18.2.0",
        "react-dom": "18.2.0"
    },
```

Leave `devDependencies` (`@servicenow/sdk`, `@servicenow/glide`, `@types/react`) unchanged.

- [ ] **Step 2: Reinstall deps**

Run: `npm install`
Expected: completes; `node_modules/@servicenow/react-components` is gone.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: drop @servicenow/react-components (plain React for robustness)"
```

---

### Task A2: Reset `index.html` to the minimal canonical template

**Files:**
- Modify: `src/client/index.html` (whole file — removes the `Array.from`/`Element.Methods` polyfill hack)

- [ ] **Step 1: Replace the whole file**

```html
<html class="-polaris">
  <head>
    <title>Git Issue Sync</title>
    <sdk:now-ux-globals></sdk:now-ux-globals>
    <script src="main.tsx?uxpcb=$[UxFrameworkScriptables.getFlushTimestamp()]" type="module"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/client/index.html
git commit -m "chore: reset UI Page HTML to minimal canonical template"
```

---

### Task A3: Create the API service layer

**Files:**
- Create: `src/client/services/syncApi.ts`

**Interfaces:**
- Produces: `API_BASE`, `startSync(payload): Promise<string>` (returns sync_id), `getProgress(syncId): Promise<Progress>`, `listCredentials(): Promise<Credential[]>`, and types `StartPayload`, `Progress`, `Credential`.

- [ ] **Step 1: Write the file**

```ts
declare const window: Window & { g_ck: string };

// MUST equal the deployed Scripted REST API "Base API path"
// (backend plan Task 5 Step 3). Do not guess.
export const API_BASE = '/api/x_snc_git_issue/sync';

export interface StartPayload {
  repository_url: string;
  credential_sys_id: string;
  sync_mode: string;
  state_filter: string;
  update_existing: boolean;
}

export interface Progress {
  status: string;
  current_phase: string;
  percent_complete: number;
  progress_message: string;
  issues_created: number;
  issues_updated: number;
  issues_skipped: number;
  milestones_created: number;
  milestones_updated: number;
  labels_created: number;
  error_message: string;
  sync_mode: string;
  repository_url: string;
}

export interface Credential { sys_id: string; name: string; type: string; }

function headers(json: boolean): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/json', 'X-UserToken': window.g_ck };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

// Scripted REST returns the raw body; tolerate an accidental {result:...} wrapper.
async function parse(resp: Response): Promise<any> {
  const json = await resp.json().catch(() => ({}));
  return json && json.result !== undefined ? json.result : json;
}

export async function startSync(payload: StartPayload): Promise<string> {
  const resp = await fetch(`${API_BASE}/start`, {
    method: 'POST', headers: headers(true), body: JSON.stringify(payload)
  });
  const body = await parse(resp);
  if (!body || !body.success) throw new Error((body && body.error) || `Start failed (${resp.status})`);
  return body.sync_id;
}

export async function getProgress(syncId: string): Promise<Progress> {
  const resp = await fetch(`${API_BASE}/progress/${syncId}`, { headers: headers(false) });
  const body = await parse(resp);
  if (!body || !body.success) throw new Error((body && body.error) || `Progress failed (${resp.status})`);
  return body.data as Progress;
}

export async function listCredentials(): Promise<Credential[]> {
  try {
    const resp = await fetch(`${API_BASE}/credentials`, { headers: headers(false) });
    const body = await parse(resp);
    return body && body.success && Array.isArray(body.data) ? body.data : [];
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/client/services/syncApi.ts
git commit -m "feat: client API service for async sync flow"
```

---

### Task A4: Rebuild `app.tsx` as the polling state machine

**Files:**
- Modify: `src/client/app.tsx` (whole file)

**Interfaces:**
- Consumes: `startSync`, `getProgress`, `StartPayload`, `Progress` (Task A3); `SyncForm`, `SyncProgress`, `SyncResults` (Tasks A5–A7).
- Produces: default-exported `App`.

- [ ] **Step 1: Replace the whole file**

```tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import './styles.css';
import SyncForm from './components/SyncForm';
import SyncProgress from './components/SyncProgress';
import SyncResults from './components/SyncResults';
import { startSync, getProgress, StartPayload, Progress } from './services/syncApi';

type View = 'form' | 'progress' | 'results' | 'error';

const POLL_MS = 1500;
const MAX_POLLS = 200; // ~5 minutes
const TERMINAL_OK = ['completed', 'completed_with_errors'];

export default function App() {
  const [view, setView] = useState<View>('form');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [syncMode, setSyncMode] = useState('mirror');

  const timer = useRef<number | null>(null);
  const polls = useRef(0);
  const fails = useRef(0);
  const lastMsg = useRef('');

  const stopPolling = useCallback(() => {
    if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback((syncId: string) => {
    getProgress(syncId).then(p => {
      fails.current = 0;
      setProgress(p);
      const msg = p.progress_message || p.current_phase || '';
      if (msg && msg !== lastMsg.current) { lastMsg.current = msg; setLog(l => [...l, msg]); }
      if (TERMINAL_OK.indexOf(p.status) !== -1) { setView('results'); return; }
      if (p.status === 'failed') { setError(p.error_message || 'Sync failed'); setView('error'); return; }
      polls.current += 1;
      if (polls.current >= MAX_POLLS) {
        setError('Sync is taking longer than expected. Check Sync History for the final result.');
        setView('error'); return;
      }
      timer.current = window.setTimeout(() => poll(syncId), POLL_MS);
    }).catch(() => {
      fails.current += 1;
      if (fails.current >= 3) {
        setError('Lost contact with the server while polling. Check Sync History for the final result.');
        setView('error'); return;
      }
      timer.current = window.setTimeout(() => poll(syncId), POLL_MS);
    });
  }, []);

  const handleSubmit = useCallback(async (data: StartPayload) => {
    setSubmitting(true); setError(''); setLog([]); setProgress(null);
    lastMsg.current = ''; polls.current = 0; fails.current = 0;
    setSyncMode(data.sync_mode);
    try {
      const syncId = await startSync(data);
      setView('progress');
      poll(syncId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
      setView('error');
    } finally {
      setSubmitting(false);
    }
  }, [poll]);

  const handleReset = useCallback(() => {
    stopPolling();
    setView('form'); setProgress(null); setLog([]); setError('');
  }, [stopPolling]);

  return (
    <div className="gis-page">
      <header className="gis-header">
        <h1 className="gis-header__title">Git Issue Sync</h1>
        <p className="gis-header__subtitle">Synchronize GitHub issues to ServiceNow</p>
      </header>
      {view === 'form' && <SyncForm onSubmit={handleSubmit} submitting={submitting} />}
      {view === 'progress' && <SyncProgress progress={progress} log={log} />}
      {view === 'results' && <SyncResults progress={progress} syncMode={syncMode} onReset={handleReset} />}
      {view === 'error' && <SyncResults progress={null} error={error} syncMode={syncMode} onReset={handleReset} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/client/app.tsx
git commit -m "feat: app state machine with /progress polling"
```

---

### Task A5: Rebuild `SyncForm` as plain React (fixes the `story_map` bug)

**Files:**
- Modify: `src/client/components/SyncForm.tsx` (whole file)
- Delete: `src/client/components/SyncModeCard.tsx` (folded into SyncForm)

**Interfaces:**
- Consumes: `listCredentials`, `Credential`, `StartPayload` (Task A3).
- Produces: default-exported `SyncForm` with props `{ onSubmit: (data: StartPayload) => void; submitting: boolean }`.

- [ ] **Step 1: Replace `SyncForm.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { listCredentials, Credential, StartPayload } from '../services/syncApi';

interface Props { onSubmit: (data: StartPayload) => void; submitting: boolean; }

const MODES = [
  { v: 'mirror', t: 'Mirror Repository Structure', d: 'Issues → custom table, Milestones → custom table' },
  { v: 'user_story', t: 'Map to User Stories', d: 'Issues → Stories, Milestones → Epics' }
];

export default function SyncForm({ onSubmit, submitting }: Props) {
  const [repoUrl, setRepoUrl] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [syncMode, setSyncMode] = useState('mirror');
  const [stateFilter, setStateFilter] = useState('open');
  const [updateExisting, setUpdateExisting] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => { listCredentials().then(setCredentials); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      repository_url: repoUrl.trim(),
      credential_sys_id: credentialId,
      sync_mode: syncMode,
      state_filter: stateFilter,
      update_existing: updateExisting
    });
  };

  return (
    <form className="gis-card" onSubmit={submit}>
      <label className="gis-field">
        <span className="gis-field__label">Repository URL</span>
        <input className="gis-input" type="text" required placeholder="https://github.com/owner/repo"
          value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
      </label>

      <label className="gis-field">
        <span className="gis-field__label">Credential</span>
        <select className="gis-input" value={credentialId} onChange={e => setCredentialId(e.target.value)}>
          <option value="">None (public repo)</option>
          {credentials.map(c => <option key={c.sys_id} value={c.sys_id}>{c.name} ({c.type})</option>)}
        </select>
        <span className="gis-field__help">Optional for public repositories.</span>
      </label>

      <fieldset className="gis-field">
        <legend className="gis-field__label">Sync Mode</legend>
        <div className="gis-modes">
          {MODES.map(m => (
            <button type="button" key={m.v}
              className={`gis-mode ${syncMode === m.v ? 'gis-mode--selected' : ''}`}
              aria-pressed={syncMode === m.v} onClick={() => setSyncMode(m.v)}>
              <span className="gis-mode__title">{m.t}</span>
              <span className="gis-mode__desc">{m.d}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="gis-field">
        <legend className="gis-field__label">Issue State Filter</legend>
        <div className="gis-radios">
          {['open', 'closed', 'all'].map(s => (
            <label key={s} className="gis-radio">
              <input type="radio" name="state" value={s} checked={stateFilter === s} onChange={() => setStateFilter(s)} />
              <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="gis-checkbox">
        <input type="checkbox" checked={updateExisting} onChange={e => setUpdateExisting(e.target.checked)} />
        <span>Update existing records</span>
      </label>

      <div className="gis-actions">
        <button type="submit" className="gis-btn gis-btn--primary" disabled={!repoUrl.trim() || submitting}>
          {submitting ? 'Starting…' : 'Start Sync'}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Delete the now-unused card component**

Run: `git rm src/client/components/SyncModeCard.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/client/components/SyncForm.tsx
git commit -m "feat: plain-React SyncForm; fix story_map -> user_story"
```

---

### Task A6: Rebuild `SyncProgress` (bar + phase + activity log)

**Files:**
- Modify: `src/client/components/SyncProgress.tsx` (whole file)

**Interfaces:**
- Consumes: `Progress` (Task A3).
- Produces: default-exported `SyncProgress` with props `{ progress: Progress | null; log: string[] }`.

- [ ] **Step 1: Replace the file**

```tsx
import React from 'react';
import { Progress } from '../services/syncApi';

interface Props { progress: Progress | null; log: string[]; }

export default function SyncProgress({ progress, log }: Props) {
  const pct = progress ? progress.percent_complete : 0;
  const phase = (progress && progress.current_phase) || 'Starting';
  return (
    <div className="gis-card">
      <div className="gis-progress__phase">{phase}</div>
      <div className="gis-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="gis-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="gis-progress__pct">{pct}%</div>
      <ul className="gis-log" aria-live="polite">
        {log.map((line, i) => <li key={i} className="gis-log__item">{line}</li>)}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/client/components/SyncProgress.tsx
git commit -m "feat: progress view with bar and activity log"
```

---

### Task A7: Rebuild `SyncResults` (counts + actions, handles error + completed_with_errors)

**Files:**
- Modify: `src/client/components/SyncResults.tsx` (whole file)

**Interfaces:**
- Consumes: `Progress` (Task A3).
- Produces: default-exported `SyncResults` with props `{ progress: Progress | null; error?: string; syncMode: string; onReset: () => void }`.

- [ ] **Step 1: Replace the file**

```tsx
import React from 'react';
import { Progress } from '../services/syncApi';

interface Props {
  progress: Progress | null;
  error?: string;
  syncMode: string;
  onReset: () => void;
}

const LIST_URL: Record<string, string> = {
  mirror: '/now/nav/ui/list/x_snc_git_issue_record',
  user_story: '/now/nav/ui/list/rm_story'
};

export default function SyncResults({ progress, error, syncMode, onReset }: Props) {
  if (error) {
    return (
      <div className="gis-card">
        <div className="gis-alert gis-alert--error">{error}</div>
        <div className="gis-actions">
          <button className="gis-btn gis-btn--primary" onClick={onReset}>Back to form</button>
        </div>
      </div>
    );
  }

  const p = progress;
  const rows: Array<[string, number]> = [
    ['Issues created', p ? p.issues_created : 0],
    ['Issues updated', p ? p.issues_updated : 0],
    ['Issues skipped', p ? p.issues_skipped : 0],
    ['Milestones created', p ? p.milestones_created : 0],
    ['Milestones updated', p ? p.milestones_updated : 0],
    ['Labels created', p ? p.labels_created : 0]
  ];
  const withErrors = !!p && p.status === 'completed_with_errors';

  return (
    <div className="gis-card">
      <div className={`gis-alert ${withErrors ? 'gis-alert--warn' : 'gis-alert--ok'}`}>
        {withErrors ? 'Sync completed with some errors.' : 'Sync completed successfully!'}
      </div>
      <dl className="gis-summary">
        {rows.map(([label, n]) => (
          <div className="gis-summary__row" key={label}><dt>{label}</dt><dd>{n}</dd></div>
        ))}
      </dl>
      <div className="gis-actions">
        <a className="gis-btn" href={LIST_URL[syncMode] || LIST_URL.mirror}>View list</a>
        <button className="gis-btn gis-btn--primary" onClick={onReset}>Sync another</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/client/components/SyncResults.tsx
git commit -m "feat: results view with counts and navigation actions"
```

---

### Task A8: Token-based styling

**Files:**
- Modify: `src/client/styles.css` (whole file)

- [ ] **Step 1: Replace the file**

```css
.gis-page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--now-spacing-4, 16px);
  font-family: var(--now-font-family, "Source Sans Pro", sans-serif);
  color: var(--now-color-text, #2e2e2e);
}

.gis-header { margin-bottom: var(--now-spacing-4, 16px); }
.gis-header__title { font-size: 1.5rem; font-weight: 700; margin: 0; }
.gis-header__subtitle { margin: 4px 0 0; color: var(--now-color-text-secondary, #5b5b5b); }

.gis-card {
  background: var(--now-color-surface, #fff);
  border: 1px solid var(--now-color-border, #dcdcdc);
  border-radius: var(--now-border-radius-2, 8px);
  padding: var(--now-spacing-5, 20px);
  display: flex;
  flex-direction: column;
  gap: var(--now-spacing-4, 16px);
}

.gis-field { display: flex; flex-direction: column; gap: 6px; border: 0; padding: 0; margin: 0; }
.gis-field__label { font-weight: 600; font-size: 0.9rem; }
.gis-field__help { font-size: 0.8rem; color: var(--now-color-text-secondary, #5b5b5b); }

.gis-input {
  padding: 8px 10px;
  border: 1px solid var(--now-color-border, #dcdcdc);
  border-radius: var(--now-border-radius-1, 4px);
  font-size: 0.95rem;
  background: var(--now-color-surface, #fff);
  color: inherit;
}
.gis-input:focus { outline: 2px solid var(--now-color-border-focus, #2e6df6); outline-offset: 1px; }

.gis-modes { display: grid; grid-template-columns: 1fr 1fr; gap: var(--now-spacing-3, 12px); }
.gis-mode {
  text-align: left; cursor: pointer;
  border: 1px solid var(--now-color-border, #dcdcdc);
  border-radius: var(--now-border-radius-2, 8px);
  padding: var(--now-spacing-3, 12px);
  background: var(--now-color-surface, #fff);
  display: flex; flex-direction: column; gap: 4px;
}
.gis-mode--selected {
  border-color: var(--now-color-interactive, #2e6df6);
  box-shadow: 0 0 0 1px var(--now-color-interactive, #2e6df6) inset;
}
.gis-mode__title { font-weight: 600; }
.gis-mode__desc { font-size: 0.8rem; color: var(--now-color-text-secondary, #5b5b5b); }

.gis-radios { display: flex; gap: var(--now-spacing-4, 16px); }
.gis-radio, .gis-checkbox { display: flex; align-items: center; gap: 6px; cursor: pointer; }

.gis-actions { display: flex; gap: var(--now-spacing-3, 12px); justify-content: flex-end; }
.gis-btn {
  padding: 8px 16px;
  border-radius: var(--now-border-radius-1, 4px);
  border: 1px solid var(--now-color-border, #dcdcdc);
  background: var(--now-color-surface, #fff);
  color: inherit; cursor: pointer; font-size: 0.95rem;
  text-decoration: none; display: inline-flex; align-items: center;
}
.gis-btn--primary {
  background: var(--now-color-interactive, #2e6df6);
  border-color: var(--now-color-interactive, #2e6df6);
  color: #fff;
}
.gis-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.gis-progress__phase { font-weight: 600; }
.gis-progress__pct { font-size: 0.85rem; color: var(--now-color-text-secondary, #5b5b5b); }
.gis-bar { height: 10px; background: var(--now-color-surface-secondary, #eee); border-radius: 999px; overflow: hidden; }
.gis-bar__fill { height: 100%; background: var(--now-color-interactive, #2e6df6); transition: width 0.4s ease; }
.gis-log { list-style: none; margin: 0; padding: 0; max-height: 200px; overflow-y: auto; font-size: 0.85rem; }
.gis-log__item { padding: 4px 0; border-bottom: 1px solid var(--now-color-border, #ececec); }

.gis-summary { margin: 0; display: flex; flex-direction: column; gap: 4px; }
.gis-summary__row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--now-color-border, #ececec); }
.gis-summary__row dt { margin: 0; }
.gis-summary__row dd { margin: 0; font-weight: 700; }

.gis-alert { padding: 12px; border-radius: var(--now-border-radius-1, 4px); }
.gis-alert--ok { background: #e5f6ea; color: #1b5e2f; }
.gis-alert--warn { background: #fff4e5; color: #7a4f01; }
.gis-alert--error { background: #fdecea; color: #8a1c12; }

@media (max-width: 560px) { .gis-modes { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Commit**

```bash
git add src/client/styles.css
git commit -m "style: token-based styling for the sync UI"
```

---

### Task A9: Deploy and run the fix-and-verify ladder

This is the crux — the blank page came from the module bundle being served as `text/html`. Work the gates **in order**; stop as soon as the page renders.

**Files:** none (deploy + browser inspection); `now.config.json` only if Gate 2 requires it.

- [ ] **Step 1: Confirm `main.tsx` bootstrap is intact**

`src/client/main.tsx` must be exactly:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
```

- [ ] **Step 2: Build and confirm the bundle exists locally (Gate 0)**

Run: `npm run build`
Then inspect the output: `ls -la dist/static`
Expected: `dist/static` exists and contains a compiled JS bundle plus a processed `index.html`. Open the processed `index.html` and note the exact script path it references. **If `dist/static` is empty or missing, the build failed — fix build errors before deploying. This alone is the most common cause of the `text/html` blank page.**

- [ ] **Step 3: Deploy**

Run: `npm run deploy`
Expected: install completes without error.

- [ ] **Step 4: GATE 1 — the module URL must serve JavaScript**

Open `https://csucsu.service-now.com/x_snc_git_issue_sync.do`, open DevTools → Network, reload. Find the request for the module script (the `main.tsx?uxpcb=...` entry). Check its **Response Content-Type**.
- ✅ `application/javascript` (or `text/javascript`) → go to Step 7.
- ❌ `text/html` → the bundle isn't being served; go to Step 5.

- [ ] **Step 5: GATE 2 — reconcile the script URL / static content**

In the Network tab, copy the full URL the browser requested for the module. Open that URL directly in a new tab.
- If it returns an HTML error/login page: the static content isn't served where the `.do` page points. Confirm `now.config.json` still has `"staticContentPaths": { "src/client": "dist/static" }`. Re-run `npm run build` and confirm `dist/static` is non-empty, then `npm run deploy` again. Re-check Gate 1.
- Compare the requested path against where the processed `index.html` (Step 2) expects the script. A mismatch means the `<sdk:now-ux-globals>` base didn't apply — ensure the `index.html` is exactly Task A2 (no extra `<base>` tag, no leading slash added to the script `src`).

- [ ] **Step 6: GATE 3 — clean reinstall if still `text/html`**

The `uxpcb` cache-buster should defeat stale caching, but if Gate 1 still fails: in the instance, check **System UI → UI Pages** for a stale/duplicate `x_snc_git_issue_sync` record; if one exists that the SDK didn't manage, delete it, then `npm run deploy` again. Re-check Gate 1.
- If after Gates 1–3 the module URL still will not serve as JavaScript, **stop and switch to Plan B** (`2026-07-03-git-issue-sync-plan-b-selfcontained.md`). The backend, contract, and styling all carry over.

- [ ] **Step 7: GATE 4 — the app must mount and function**

With the module now loading, reload the page and check the Console for the next error, then verify the flow:
1. The form renders (repo URL, credential dropdown, two mode cards, state radios, checkbox, Start button).
2. Enter `https://github.com/octocat/Hello-World`, mode `Mirror`, state `All`, submit.
3. The progress view shows a climbing bar + phase + activity-log lines.
4. It transitions to the results view with non-zero counts; **View list** navigates to the `x_snc_git_issue_record` list; **Sync another** returns to the form.

Expected: all four pass with a clean console.

- [ ] **Step 8: Commit any Gate-2/3 config change (if made)**

```bash
git add now.config.json src/client/index.html
git commit -m "fix: correct UI Page static-content serving"
```

---

## Self-Review (performed by planner)

- **Spec coverage:** §3.1 drop react-components → A1; §3.3 clean-up (polyfill removal, story_map fix) → A2, A5; §3.2 fix ladder + gates → A9; §3.4 structure (services, components, styles) → A3–A8; §2.3 flow + polling + safety caps → A4; results navigation → A7. ✅
- **Type consistency:** `startSync→string`, `getProgress→Progress`, `Progress`/`StartPayload`/`Credential` defined in A3 and consumed identically in A4–A7. `SyncResults` prop set matches A4's usage in both `results` and `error` branches. ✅
- **Placeholders:** none; every code step is complete. ✅
- **Known residual risk:** Gates 1–3 outcomes depend on the instance (untestable here); the explicit Plan-B exit at Step 6 covers the case where they can't be satisfied.

## Next

If the ladder can't get the module to serve as JS, or you choose to stop, execute **Plan B**.
