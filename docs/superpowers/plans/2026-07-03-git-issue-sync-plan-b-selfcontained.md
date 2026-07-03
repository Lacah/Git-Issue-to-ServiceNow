# Git Issue Sync — Plan B: Self-Contained UI Page Implementation Plan

> **For any executor:** Self-contained; checkbox (`- [ ]`) steps. **Prerequisite:** the backend foundation plan (`2026-07-03-git-issue-sync-backend-async.md`) is deployed and verified. Use this plan only if Plan A's fix ladder cannot get the module bundle to serve as JavaScript, or if you choose to abandon React. No test harness — verification is deploy + observe. Do tasks in order.

**Goal:** A UI Page that structurally cannot hit the blank-page failure: one `.do` page whose HTML contains everything inline — markup, CSS, and a single classic (non-module) `<script>`. No external bundle, no `staticContentPaths` dependency, no client build step.

**Architecture:** `UiPage({ html: index.html, direct: true })` serves a self-contained page. Inline vanilla JS is a `form → progress → results/error` state machine that calls the same async REST API and polls `/progress`. Because the browser never requests a separate module, the `text/html` MIME failure is impossible.

**Tech Stack:** Plain HTML/CSS/vanilla JS (ES5-compatible), ServiceNow Now SDK UiPage (`direct: true`), Horizon CSS variables.

## Global Constraints

- **The inline script is authored for the Jelly/XML environment of `.do` pages:**
  - Wrap the script body with the `/* <![CDATA[ */ … /* ]]> */` guard so `<`, `>`, `&&` are XML-safe.
  - **Never use `${` (template literals) or `$[` sequences** anywhere in the inline JS — both are Jelly expression triggers. Use string concatenation with `+`.
  - Do not include a literal `</script>` or `]]>` inside the JS.
- Keep `<html class="-polaris">`, `<sdk:now-ux-globals>` (provides theming + `window.g_ck`), no `<!DOCTYPE>`, no XML preamble, self-close void elements.
- `API_BASE` must equal the deployed **Base API path** (backend plan Task 5 Step 3). Do not guess.
- Every `fetch` includes `X-UserToken: window.g_ck`.
- Sync-mode values: `mirror`, `user_story`. Terminal-success: `completed`, `completed_with_errors`. Terminal-failure: `failed`.
- Deploy with `npm run build && npm run deploy`. Never add build configs.

---

### Task B1: Reduce the client to a single self-contained file

**Files:**
- Delete: `src/client/main.tsx`, `src/client/app.tsx`, `src/client/styles.css`, `src/client/services/` (if present from Plan A), `src/client/components/` (all `.tsx`)
- Modify: `package.json` (`dependencies`, `devDependencies`)

**Interfaces:**
- Produces: a `src/client` containing only `index.html` (replaced in Task B3) and `tsconfig.json`.

- [ ] **Step 1: Remove the React client source**

Run (ignore "did not match" for files that don't exist in your current state):

```bash
git rm -f src/client/main.tsx src/client/app.tsx src/client/styles.css
git rm -rf src/client/services src/client/components
```

Keep `src/client/index.html` and `src/client/tsconfig.json`.

- [ ] **Step 2: Trim React dependencies from `package.json`**

Set `dependencies` to (keep `marked` — it is a server-side module dependency):

```json
    "dependencies": {
        "marked": "9.1.6"
    },
```

Set `devDependencies` to (drop `@types/react`):

```json
    "devDependencies": {
        "@servicenow/sdk": "4.8.1",
        "@servicenow/glide": "27.0.5"
    }
```

- [ ] **Step 3: Reinstall**

Run: `npm install`
Expected: completes; no React packages in `node_modules`.

- [ ] **Step 4: Commit**

```bash
git add -A src/client package.json package-lock.json
git commit -m "chore: strip React client for self-contained UI Page"
```

---

### Task B2: CDATA inline-script smoke test (de-risk the environment first)

Prove that a CDATA-guarded inline classic script executes and renders on the `.do` page **before** building the full UI. If this renders, everything in Task B3 will too.

**Files:**
- Modify: `src/client/index.html` (temporary minimal content)

- [ ] **Step 1: Write the minimal smoke-test page**

```html
<html class="-polaris">
  <head>
    <title>Git Issue Sync</title>
    <sdk:now-ux-globals></sdk:now-ux-globals>
  </head>
  <body>
    <div id="root">loading…</div>
    <script>
      /* <![CDATA[ */
      (function () {
        var ok = (1 < 2) && (3 > 2);
        var token = (typeof window.g_ck === 'string' && window.g_ck.length > 0) ? 'token present' : 'NO TOKEN';
        document.getElementById('root').textContent = ok
          ? ('Inline script works — ' + token)
          : 'logic error';
      })();
      /* ]]> */
    </script>
  </body>
</html>
```

- [ ] **Step 2: Deploy**

Run: `npm run build && npm run deploy`
Expected: install completes.

- [ ] **Step 3: GATE — the smoke test must render**

Open `https://csucsu.service-now.com/x_snc_git_issue_sync.do`.
Expected: the page shows **"Inline script works — token present"**.
- If it shows "NO TOKEN": `window.g_ck` is not exposed here; check the console for `window.g_ck` and confirm `<sdk:now-ux-globals>` loaded. The full UI's POST needs this token — resolve before Task B3.
- If it stays "loading…" or is blank: open the console. A Jelly/XML parse error means the CDATA guard was altered — restore it exactly. Do not proceed until "Inline script works" renders.

- [ ] **Step 4: Commit**

```bash
git add src/client/index.html
git commit -m "test: CDATA inline-script smoke test on UI Page"
```

---

### Task B3: Build the full self-contained UI Page

**Files:**
- Modify: `src/client/index.html` (whole file — replaces the smoke test)

**Interfaces:**
- Consumes: the async REST API (`/start`, `/progress/{id}`, `/credentials`).
- Produces: the complete working UI.

- [ ] **Step 1: Set `API_BASE`**

In the script below, the line `var API_BASE = '/api/x_snc_git_issue/sync';` must match the deployed Base API path recorded in the backend plan (Task 5 Step 3). Edit it if the recorded path differs.

- [ ] **Step 2: Replace the whole `index.html`**

```html
<html class="-polaris">
  <head>
    <title>Git Issue Sync</title>
    <sdk:now-ux-globals></sdk:now-ux-globals>
    <style>
      .gis-page { max-width: 720px; margin: 0 auto; padding: 16px; font-family: "Source Sans Pro", sans-serif; color: var(--now-color-text, #2e2e2e); }
      .gis-header { margin-bottom: 16px; }
      .gis-header__title { font-size: 1.5rem; font-weight: 700; margin: 0; }
      .gis-header__subtitle { margin: 4px 0 0; color: var(--now-color-text-secondary, #5b5b5b); }
      .gis-card { background: var(--now-color-surface, #fff); border: 1px solid var(--now-color-border, #dcdcdc); border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
      .gis-field { display: flex; flex-direction: column; gap: 6px; }
      .gis-field__label { font-weight: 600; font-size: 0.9rem; }
      .gis-field__help { font-size: 0.8rem; color: var(--now-color-text-secondary, #5b5b5b); }
      .gis-input { padding: 8px 10px; border: 1px solid var(--now-color-border, #dcdcdc); border-radius: 4px; font-size: 0.95rem; background: var(--now-color-surface, #fff); color: inherit; }
      .gis-modes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .gis-mode { text-align: left; cursor: pointer; border: 1px solid var(--now-color-border, #dcdcdc); border-radius: 8px; padding: 12px; background: var(--now-color-surface, #fff); display: flex; flex-direction: column; gap: 4px; }
      .gis-mode--selected { border-color: var(--now-color-interactive, #2e6df6); box-shadow: 0 0 0 1px var(--now-color-interactive, #2e6df6) inset; }
      .gis-mode__title { font-weight: 600; }
      .gis-mode__desc { font-size: 0.8rem; color: var(--now-color-text-secondary, #5b5b5b); }
      .gis-radios { display: flex; gap: 16px; }
      .gis-radio, .gis-checkbox { display: flex; align-items: center; gap: 6px; cursor: pointer; }
      .gis-actions { display: flex; gap: 12px; justify-content: flex-end; }
      .gis-btn { padding: 8px 16px; border-radius: 4px; border: 1px solid var(--now-color-border, #dcdcdc); background: var(--now-color-surface, #fff); color: inherit; cursor: pointer; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; }
      .gis-btn--primary { background: var(--now-color-interactive, #2e6df6); border-color: var(--now-color-interactive, #2e6df6); color: #fff; }
      .gis-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .gis-progress__phase { font-weight: 600; }
      .gis-progress__pct { font-size: 0.85rem; color: var(--now-color-text-secondary, #5b5b5b); }
      .gis-bar { height: 10px; background: var(--now-color-surface-secondary, #eee); border-radius: 999px; overflow: hidden; }
      .gis-bar__fill { height: 100%; background: var(--now-color-interactive, #2e6df6); transition: width 0.4s ease; }
      .gis-log { list-style: none; margin: 0; padding: 0; max-height: 200px; overflow-y: auto; font-size: 0.85rem; }
      .gis-log__item { padding: 4px 0; border-bottom: 1px solid var(--now-color-border, #ececec); }
      .gis-summary { margin: 0; display: flex; flex-direction: column; gap: 4px; }
      .gis-summary__row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--now-color-border, #ececec); }
      .gis-summary__row dt { margin: 0; } .gis-summary__row dd { margin: 0; font-weight: 700; }
      .gis-alert { padding: 12px; border-radius: 4px; }
      .gis-alert--ok { background: #e5f6ea; color: #1b5e2f; }
      .gis-alert--warn { background: #fff4e5; color: #7a4f01; }
      .gis-alert--error { background: #fdecea; color: #8a1c12; }
      @media (max-width: 560px) { .gis-modes { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <div class="gis-page">
      <header class="gis-header">
        <h1 class="gis-header__title">Git Issue Sync</h1>
        <p class="gis-header__subtitle">Synchronize GitHub issues to ServiceNow</p>
      </header>
      <div id="root"></div>
    </div>
    <script>
      /* <![CDATA[ */
      (function () {
        var API_BASE = '/api/x_snc_git_issue/sync';
        var GCK = window.g_ck;
        var root = document.getElementById('root');
        var POLL_MS = 1500;
        var MAX_POLLS = 200;
        var OK = ['completed', 'completed_with_errors'];
        var syncMode = 'mirror';
        var timer = null, polls = 0, fails = 0, lastMsg = '';

        function esc(s) {
          return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;';
          });
        }

        function api(path, method, bodyObj) {
          var opts = { method: method || 'GET', headers: { 'Accept': 'application/json', 'X-UserToken': GCK } };
          if (bodyObj) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(bodyObj); }
          return fetch(API_BASE + path, opts).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) {
              return (j && j.result !== undefined) ? j.result : j;
            });
          });
        }

        function stopPolling() { if (timer !== null) { clearTimeout(timer); timer = null; } }

        function highlightModes() {
          var btns = root.querySelectorAll('.gis-mode');
          for (var i = 0; i < btns.length; i++) {
            if (btns[i].getAttribute('data-mode') === syncMode) { btns[i].classList.add('gis-mode--selected'); }
            else { btns[i].classList.remove('gis-mode--selected'); }
          }
        }

        function loadCredentials() {
          api('/credentials', 'GET').then(function (body) {
            if (!body || !body.success || !body.data) { return; }
            var sel = document.getElementById('cred');
            if (!sel) { return; }
            for (var i = 0; i < body.data.length; i++) {
              var c = body.data[i];
              var opt = document.createElement('option');
              opt.value = c.sys_id;
              opt.textContent = c.name + ' (' + c.type + ')';
              sel.appendChild(opt);
            }
          }).catch(function () {});
        }

        function renderForm() {
          stopPolling();
          syncMode = 'mirror';
          root.innerHTML = ''
            + '<div class="gis-card">'
            + '  <label class="gis-field"><span class="gis-field__label">Repository URL</span>'
            + '    <input id="repo" class="gis-input" type="text" placeholder="https://github.com/owner/repo" /></label>'
            + '  <label class="gis-field"><span class="gis-field__label">Credential</span>'
            + '    <select id="cred" class="gis-input"><option value="">None (public repo)</option></select>'
            + '    <span class="gis-field__help">Optional for public repositories.</span></label>'
            + '  <div class="gis-field"><span class="gis-field__label">Sync Mode</span>'
            + '    <div class="gis-modes">'
            + '      <button type="button" class="gis-mode" data-mode="mirror"><span class="gis-mode__title">Mirror Repository Structure</span><span class="gis-mode__desc">Issues to custom table, Milestones to custom table</span></button>'
            + '      <button type="button" class="gis-mode" data-mode="user_story"><span class="gis-mode__title">Map to User Stories</span><span class="gis-mode__desc">Issues to Stories, Milestones to Epics</span></button>'
            + '    </div></div>'
            + '  <div class="gis-field"><span class="gis-field__label">Issue State Filter</span>'
            + '    <div class="gis-radios">'
            + '      <label class="gis-radio"><input type="radio" name="state" value="open" checked /> <span>Open</span></label>'
            + '      <label class="gis-radio"><input type="radio" name="state" value="closed" /> <span>Closed</span></label>'
            + '      <label class="gis-radio"><input type="radio" name="state" value="all" /> <span>All</span></label>'
            + '    </div></div>'
            + '  <label class="gis-checkbox"><input id="upd" type="checkbox" /> <span>Update existing records</span></label>'
            + '  <div class="gis-actions"><button id="start" type="button" class="gis-btn gis-btn--primary" disabled>Start Sync</button></div>'
            + '</div>';

          var repo = document.getElementById('repo');
          var startBtn = document.getElementById('start');
          repo.addEventListener('input', function () { startBtn.disabled = repo.value.trim() === ''; });
          var modeBtns = root.querySelectorAll('.gis-mode');
          for (var i = 0; i < modeBtns.length; i++) {
            modeBtns[i].addEventListener('click', function () { syncMode = this.getAttribute('data-mode'); highlightModes(); });
          }
          highlightModes();
          startBtn.addEventListener('click', onStart);
          loadCredentials();
        }

        function onStart() {
          var repo = document.getElementById('repo').value.trim();
          if (!repo) { return; }
          var cred = document.getElementById('cred').value;
          var upd = document.getElementById('upd').checked;
          var stateEls = root.querySelectorAll('input[name="state"]');
          var stateVal = 'open';
          for (var i = 0; i < stateEls.length; i++) { if (stateEls[i].checked) { stateVal = stateEls[i].value; } }

          polls = 0; fails = 0; lastMsg = '';
          document.getElementById('start').disabled = true;

          var payload = { repository_url: repo, credential_sys_id: cred, sync_mode: syncMode, state_filter: stateVal, update_existing: upd };
          api('/start', 'POST', payload).then(function (body) {
            if (!body || !body.success) { renderError((body && body.error) || 'Failed to start sync'); return; }
            renderProgress();
            poll(body.sync_id);
          }).catch(function (e) { renderError('Network error: ' + e); });
        }

        function renderProgress() {
          root.innerHTML = ''
            + '<div class="gis-card">'
            + '  <div id="phase" class="gis-progress__phase">Starting</div>'
            + '  <div class="gis-bar"><div id="fill" class="gis-bar__fill" style="width:0%"></div></div>'
            + '  <div id="pct" class="gis-progress__pct">0%</div>'
            + '  <ul id="log" class="gis-log"></ul>'
            + '</div>';
        }

        function poll(syncId) {
          api('/progress/' + syncId, 'GET').then(function (body) {
            if (!body || !body.success) { fails++; reschedule(syncId); return; }
            fails = 0;
            var p = body.data;
            updateProgress(p);
            if (OK.indexOf(p.status) !== -1) { renderResults(p); return; }
            if (p.status === 'failed') { renderError(p.error_message || 'Sync failed'); return; }
            polls++;
            if (polls >= MAX_POLLS) { renderError('Sync is taking longer than expected. Check Sync History for the final result.'); return; }
            timer = setTimeout(function () { poll(syncId); }, POLL_MS);
          }).catch(function () { fails++; reschedule(syncId); });
        }

        function reschedule(syncId) {
          if (fails >= 3) { renderError('Lost contact with the server while polling. Check Sync History for the final result.'); return; }
          timer = setTimeout(function () { poll(syncId); }, POLL_MS);
        }

        function updateProgress(p) {
          var phaseEl = document.getElementById('phase');
          if (!phaseEl) { return; }
          var pct = p.percent_complete || 0;
          phaseEl.textContent = p.current_phase || 'Working';
          document.getElementById('fill').style.width = pct + '%';
          document.getElementById('pct').textContent = pct + '%';
          var msg = p.progress_message || p.current_phase || '';
          if (msg && msg !== lastMsg) {
            lastMsg = msg;
            var li = document.createElement('li');
            li.className = 'gis-log__item';
            li.textContent = msg;
            document.getElementById('log').appendChild(li);
          }
        }

        function renderResults(p) {
          stopPolling();
          var listUrl = syncMode === 'user_story' ? '/now/nav/ui/list/rm_story' : '/now/nav/ui/list/x_snc_git_issue_record';
          var withErrors = p.status === 'completed_with_errors';
          var rows = [
            ['Issues created', p.issues_created], ['Issues updated', p.issues_updated], ['Issues skipped', p.issues_skipped],
            ['Milestones created', p.milestones_created], ['Milestones updated', p.milestones_updated], ['Labels created', p.labels_created]
          ];
          var rowsHtml = '';
          for (var i = 0; i < rows.length; i++) {
            rowsHtml += '<div class="gis-summary__row"><dt>' + esc(rows[i][0]) + '</dt><dd>' + esc(rows[i][1] || 0) + '</dd></div>';
          }
          root.innerHTML = ''
            + '<div class="gis-card">'
            + '  <div class="gis-alert ' + (withErrors ? 'gis-alert--warn' : 'gis-alert--ok') + '">'
            + (withErrors ? 'Sync completed with some errors.' : 'Sync completed successfully!') + '</div>'
            + '  <dl class="gis-summary">' + rowsHtml + '</dl>'
            + '  <div class="gis-actions">'
            + '    <a class="gis-btn" href="' + listUrl + '">View list</a>'
            + '    <button id="again" type="button" class="gis-btn gis-btn--primary">Sync another</button>'
            + '  </div>'
            + '</div>';
          document.getElementById('again').addEventListener('click', renderForm);
        }

        function renderError(msg) {
          stopPolling();
          root.innerHTML = ''
            + '<div class="gis-card">'
            + '  <div class="gis-alert gis-alert--error">' + esc(msg) + '</div>'
            + '  <div class="gis-actions"><button id="back" type="button" class="gis-btn gis-btn--primary">Back to form</button></div>'
            + '</div>';
          document.getElementById('back').addEventListener('click', renderForm);
        }

        renderForm();
      })();
      /* ]]> */
    </script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/client/index.html
git commit -m "feat: self-contained UI Page (inline CSS + CDATA vanilla JS)"
```

---

### Task B4: Deploy and verify the full flow

**Files:** none (deploy + observe).

- [ ] **Step 1: Deploy**

Run: `npm run build && npm run deploy`
Expected: install completes.

- [ ] **Step 2: GATE — full end-to-end**

Open `https://csucsu.service-now.com/x_snc_git_issue_sync.do` (hard-refresh to clear cache).
1. The form renders: repo URL, credential dropdown (populated from `/credentials`), two mode cards (Mirror selected by default), state radios, checkbox, disabled Start button.
2. Typing a repo URL enables Start. Enter `https://github.com/octocat/Hello-World`, mode `Mirror`, state `All`, click Start.
3. Progress view shows a climbing bar + phase + activity-log lines that update every ~1.5 s.
4. On completion, the results view shows non-zero counts; **View list** opens the `x_snc_git_issue_record` list; **Sync another** returns to the form.
5. Console is free of Jelly/XML parse errors and unhandled exceptions.

Expected: all five pass.

- [ ] **Step 3: Negative check — error path**

Submit an invalid repo (e.g. `https://github.com/this-org/does-not-exist-xyz`).
Expected: the sync reaches `failed` and the UI shows the red error alert with a "Back to form" button (it does not hang).

---

## Self-Review (performed by planner)

- **Spec coverage:** §4.1 single inline `.do` page (no module) → B3; §4.2 CDATA guard + no `${`/`$[` + smoke test → Global Constraints, B2, B3; §4.3 shared backend/contract/flow/tokens/navigation → B3 (same API, same statuses, same list URLs); client cleanup → B1. ✅
- **Consistency with backend + Plan A:** same `API_BASE` sourcing, same status handling (`completed`/`completed_with_errors`/`failed`), same list URLs, same polling caps (`MAX_POLLS=200`, 3-fail cutoff). ✅
- **Jelly-safety audit of the inline JS:** no template literals (`${`), no `$[`, no literal `</script>` or `]]>`; `<`/`>`/`&&` present but inside the CDATA guard. ✅
- **Placeholders:** none. ✅

## Done

This is the terminal fallback. With the backend foundation + this page deployed and Task B4 passing, the app is fully functional without any React/bundle/static-serving dependency.
