import assert from 'node:assert/strict'
import test from 'node:test'

import { createDashXdWorker } from '../src/worker-app.js'
import { SERVICE_ROUTES } from '../src/service-routes.js'

const worker = createDashXdWorker('data:image/png;base64,AA==')
const request = (path, options) => new Request('https://www.dashxd.com' + path, options)
const binding = (value) => ({ get: async (key) => key.startsWith('dashxd/service-routes/') ? value : null })

test('every configured service renders a local placeholder when KV is absent or empty', async () => {
  for (const service of SERVICE_ROUTES) {
    for (const env of [{}, { DASHXD_ROUTES: binding(null) }]) {
      const response = await worker.fetch(request('/out/' + service.id), env)
      assert.equal(response.status, 200)
      assert.match(await response.text(), /destination not configured/)
      assert.match(response.headers.get('cache-control'), /no-store/)
    }
  }
})

test('unknown service IDs return 404 without reading KV', async () => {
  let reads = 0
  const response = await worker.fetch(request('/out/not-a-service'), {
    DASHXD_ROUTES: { get: async () => { reads += 1; return null } },
  })
  assert.equal(response.status, 404)
  assert.equal(reads, 0)
})

test('valid KV route redirects only to its configured HTTPS hostname', async () => {
  const route = SERVICE_ROUTES[0]
  const target = 'https://' + route.allowedHost + '/ready'
  const response = await worker.fetch(request('/out/' + route.id), {
    DASHXD_ROUTES: binding(JSON.stringify({ id: route.id, name: route.name, target })),
  })
  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), target)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('malformed KV data, mismatched names, and disallowed destinations render placeholders', async () => {
  const route = SERVICE_ROUTES[0]
  const validTarget = 'https://' + route.allowedHost + '/'
  const invalidValues = [
    '{',
    JSON.stringify({ id: 'other', name: route.name, target: validTarget }),
    JSON.stringify({ id: route.id, name: 'wrong name', target: validTarget }),
    JSON.stringify({ id: route.id, name: route.name, target: 'https://attacker.example/' }),
    JSON.stringify({ id: route.id, name: route.name, target: 'http://' + route.allowedHost + '/' }),
  ]
  for (const value of invalidValues) {
    const response = await worker.fetch(request('/out/' + route.id), { DASHXD_ROUTES: binding(value) })
    assert.equal(response.status, 200)
    assert.match(await response.text(), /destination not configured/)
  }
})

test('non-GET/HEAD requests are rejected', async () => {
  for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS']) {
    const response = await worker.fetch(request('/out/console', { method }))
    assert.equal(response.status, 405)
    assert.equal(response.headers.get('allow'), 'GET, HEAD')
  }
})
