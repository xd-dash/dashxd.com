import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  DASHXD_CSS,
  DASHXD_LOGO_URL,
  formatWorkerMeta,
  renderDocument,
  workerMetaFromRequest,
} from '../src/design/index.js'
import { renderDashXdPage } from '../src/site.js'

function edgeRequest() {
  const request = new Request('https://www.dashxd.com/', {
    headers: { 'cf-ray': 'test-ray-SJC' },
  })
  Object.defineProperty(request, 'cf', {
    value: {
      colo: 'SJC',
      country: 'US',
      httpProtocol: 'HTTP/3',
      tlsVersion: 'TLSv1.3',
    },
  })
  return request
}

test('canonical design preserves dashxd visual primitives', () => {
  assert.match(DASHXD_CSS, /--cyan:\s*#25f4ee/)
  assert.match(DASHXD_CSS, /--magenta:\s*#fe2c55/)
  assert.match(DASHXD_CSS, /width:\s*min\(100% - 40px, 360px\)/)
  assert.match(DASHXD_CSS, /box-shadow:\s*6px 6px 0 var\(--magenta\)/)
  assert.match(DASHXD_CSS, /\.text-editor/)
  assert.match(DASHXD_CSS, /\.action-button/)
  assert.equal(DASHXD_LOGO_URL, 'https://www.dashxd.com/logo')
})

test('worker footer metadata comes from the rendering request', () => {
  const meta = workerMetaFromRequest(edgeRequest(), 'dashxd-com')
  assert.deepEqual(meta, {
    service: 'dashxd-com',
    colo: 'SJC',
    country: 'US',
    httpProtocol: 'HTTP/3',
    tlsVersion: 'TLSv1.3',
    ray: 'test-ray-SJC',
  })
  assert.equal(
    formatWorkerMeta(meta),
    'cloudflare worker · dashxd-com · colo SJC · HTTP/3 · TLSv1.3 · country US · ray test-ray-SJC',
  )
})

test('dashxd page consumes the canonical design and embeds edge metadata without /meta', () => {
  const html = renderDashXdPage(workerMetaFromRequest(edgeRequest(), 'dashxd-com'))
  assert.match(html, /https:\/\/www\.dashxd\.com\/logo/)
  assert.match(html, /cloudflare worker · dashxd-com · colo SJC · HTTP\/3 · TLSv1\.3 · country US · ray test-ray-SJC/)
  assert.match(html, /github\.com\/dash-xd/)
  assert.match(html, /github\.com\/xd-dash/)
  assert.doesNotMatch(html, /fetch\(['"]\/meta/)
})

test('shared document escapes title and renders one common footer contract', () => {
  const html = renderDocument({
    title: '<unsafe>',
    body: '<p>consumer body</p>',
    meta: workerMetaFromRequest(edgeRequest(), 'consumer'),
  })
  assert.match(html, /<title>&lt;unsafe&gt;<\/title>/)
  assert.match(html, /<p>consumer body<\/p>/)
  assert.match(html, /cloudflare worker · consumer/)
})

test('worker source has no secondary metadata endpoint', async () => {
  const worker = await readFile(new URL('../worker.js', import.meta.url), 'utf8')
  assert.match(worker, /workerMetaFromRequest\(request, SERVICE\)/)
  assert.doesNotMatch(worker, /pathname\s*===\s*['"]\/meta['"]/)
  assert.doesNotMatch(worker, /fetch\(['"]\/meta/)
})
