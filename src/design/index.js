export const DASHXD_LOGO_URL = 'https://www.dashxd.com/logo'

export const DASHXD_CSS = `
:root {
  --black: #000000;
  --white: #ffffff;
  --cyan: #25f4ee;
  --magenta: #fe2c55;
  --muted: #666666;
  --git: #f05032;
}

* { box-sizing: border-box; }
html { min-height: 100%; background: var(--white); }
body {
  min-height: 100vh;
  margin: 0;
  color: var(--black);
  background: var(--white);
  font-family: Arial, Helvetica, sans-serif;
}
button, input, textarea { font: inherit; }
a { color: inherit; }

.page-shell {
  width: min(100% - 40px, 360px);
  margin: 0 auto;
  padding: 64px 0 48px;
}
.brand { display: flex; justify-content: center; }
.logo-frame {
  width: 132px;
  height: 132px;
  display: grid;
  place-items: center;
}
.logo-frame img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.content-shell,
.menu-shell {
  display: grid;
  gap: 12px;
  margin-top: 72px;
}
.link-stack,
.stack { display: grid; gap: 12px; }

.link-button,
.action-button {
  display: grid;
  width: 100%;
  min-height: 46px;
  place-items: center;
  padding: 10px 20px;
  border: 2px solid var(--cyan);
  border-radius: 0;
  color: var(--white);
  background: var(--black);
  font-size: .95rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 140ms ease, color 140ms ease, border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
}
.link-button:hover,
.link-button:focus-visible,
.action-button:hover,
.action-button:focus-visible {
  border-color: var(--black);
  color: var(--black);
  background: var(--cyan);
  outline: none;
  transform: translate(-3px, -3px);
  box-shadow: 6px 6px 0 var(--magenta);
}
.link-button:active,
.action-button:active {
  transform: translate(0, 0);
  box-shadow: 2px 2px 0 var(--magenta);
}

.console-toggle,
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
.console-toggle { font-size: 1rem; }

.console-panel,
.panel {
  display: grid;
  gap: 12px;
  border: 2px solid var(--black);
  background: var(--white);
  padding: 12px;
  box-shadow: 6px 6px 0 var(--magenta);
}
.console-panel { min-height: 360px; }

.chat-transcript {
  min-height: 260px;
  height: 280px;
  max-height: 70vh;
  overflow: auto;
  resize: vertical;
  padding: 18px 16px 12px;
  border: 1px solid #d7d7d7;
  background: var(--white);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: .78rem;
  line-height: 1.25;
  scrollbar-width: thin;
}
.chat-message {
  width: 88%;
  margin: 0 0 16px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.chat-message--bot { margin-right: auto; margin-bottom: 0; text-align: left; }
.chat-message--bot + .chat-message--user { margin-top: 16px; }
.chat-message--user { margin-left: auto; text-align: right; }
.chat-message--user + .chat-message--bot { margin-top: 16px; }
.chat-composer-shell { display: block; }

.sr-only,
.composer-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.chat-composer,
.text-editor,
.text-input {
  display: block;
  width: 100%;
  border: 2px solid var(--cyan);
  border-radius: 0;
  color: var(--white);
  background: var(--black);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  outline: none;
  transition: transform 140ms ease, box-shadow 140ms ease;
}
.chat-composer,
.text-editor {
  padding: 10px 12px;
  resize: vertical;
  font-size: .9rem;
  line-height: 1.4;
}
.chat-composer { min-height: 72px; }
.text-editor { min-height: 300px; tab-size: 2; }
.text-input {
  min-height: 46px;
  padding: 10px 12px;
  font-size: .9rem;
}
.chat-composer::placeholder,
.text-editor::placeholder,
.text-input::placeholder {
  color: #b8b8b8;
  opacity: 1;
}
.chat-composer:focus::placeholder,
.text-editor:focus::placeholder,
.text-input:focus::placeholder { color: transparent; }
.chat-composer:hover,
.chat-composer:focus-visible,
.text-editor:hover,
.text-editor:focus-visible,
.text-input:hover,
.text-input:focus-visible {
  outline: none;
  transform: translate(-3px, -3px);
  box-shadow: 6px 6px 0 var(--magenta);
}

.section-title {
  margin: 8px 0 0;
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.body-copy,
.status-line,
.key-list {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: .78rem;
  line-height: 1.5;
}
.body-copy { margin: 0; text-align: center; }
.status-line { min-height: 1.2em; color: var(--muted); text-align: center; }
.key-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.key-list a { text-underline-offset: 3px; overflow-wrap: anywhere; }
.key-list a:hover,
.key-list a:focus-visible { color: var(--magenta); }

.site-footer {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-top: 48px;
  color: var(--muted);
  font-size: .75rem;
  line-height: 1.5;
  text-align: center;
}
.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.site-footer a { color: var(--black); text-underline-offset: 3px; }
.site-footer a:hover,
.site-footer a:focus-visible { color: var(--magenta); }
.git-mark {
  display: inline-grid;
  width: 18px;
  height: 18px;
  place-items: center;
  color: var(--git);
}
.git-mark svg { width: 100%; height: 100%; fill: currentColor; }
.footer-meta {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: .7rem;
}
.footer-legal { font-size: .7rem; }
[hidden] { display: none !important; }

@media (max-width: 480px) {
  .page-shell { width: min(100% - 48px, 360px); padding-top: 44px; }
  .logo-frame { width: 112px; height: 112px; }
  .content-shell,
  .menu-shell { margin-top: 56px; }
  .chat-transcript { min-height: 230px; height: 250px; }
}
@media (prefers-reduced-motion: reduce) {
  .link-button,
  .action-button,
  .chat-composer,
  .text-editor,
  .text-input { transition: none; }
}
`

const gitMark = `<span class="git-mark" aria-label="git" title="Git"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M23.546 10.93 13.067.452a1.55 1.55 0 0 0-2.19 0L8.708 2.621l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.66 2.66a1.838 1.838 0 1 1-1.102 1.036l-2.482-2.482v6.529a1.84 1.84 0 1 1-1.512-.053V8.822a1.84 1.84 0 0 1-.999-2.413L7.64 3.69.452 10.878a1.55 1.55 0 0 0 0 2.19l10.48 10.48a1.55 1.55 0 0 0 2.19 0l10.424-10.425a1.55 1.55 0 0 0 0-2.193Z"/></svg></span>`

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function workerMetaFromRequest(request, service) {
  const cf = request.cf || {}
  return {
    service,
    colo: cf.colo || null,
    country: cf.country || null,
    httpProtocol: cf.httpProtocol || null,
    tlsVersion: cf.tlsVersion || null,
    ray: request.headers.get('cf-ray'),
  }
}

export function formatWorkerMeta(meta) {
  return [
    `cloudflare worker · ${meta.service}`,
    meta.colo ? `colo ${meta.colo}` : null,
    meta.httpProtocol || null,
    meta.tlsVersion || null,
    meta.country ? `country ${meta.country}` : null,
    meta.ray ? `ray ${meta.ray}` : null,
  ].filter(Boolean).join(' · ')
}

export function renderBrand({ logoUrl = DASHXD_LOGO_URL, alt = 'dash xd logo' } = {}) {
  return `<header class="brand"><div class="logo-frame"><img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(alt)}"></div></header>`
}

export function renderFooter({ meta, year = 2026, owner = 'dash xd' }) {
  const metaText = meta ? formatWorkerMeta(meta) : ''
  return `<footer class="site-footer">
    <div class="footer-links">
      <a href="https://github.com/dash-xd" target="_blank" rel="noopener noreferrer">github.com/dash-xd</a>
      ${gitMark}
      <a href="https://github.com/xd-dash" target="_blank" rel="noopener noreferrer">github.com/xd-dash</a>
    </div>
    <div class="footer-meta" data-worker-meta>${escapeHtml(metaText)}</div>
    <div class="footer-legal">© ${year} ${escapeHtml(owner)} · all rights reserved</div>
  </footer>`
}

export function renderDocument({ title, body, meta, logoUrl = DASHXD_LOGO_URL, logoAlt = 'dash xd logo', head = '', script = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <style>${DASHXD_CSS}</style>
  ${head}
</head>
<body>
  <main class="page-shell">
    ${renderBrand({ logoUrl, alt: logoAlt })}
    ${body}
    ${renderFooter({ meta })}
  </main>
  ${script ? `<script>${script}</script>` : ''}
</body>
</html>`
}
