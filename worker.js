import { workerMetaFromRequest } from './src/design/index.js'
import { renderDashXdPage, renderServicePlaceholder } from './src/site.js'
import { resolveServiceDestination, serviceRouteById } from './src/service-routes.js'

const SERVICE = 'dashxd-com'
const LOGO_DATA_URL = __HURAM_INLINE_LOGO__
const LOGO_PREFIX = 'data:image/png;base64,'

function htmlResponse(html, request, headers = {}) {
  return new Response(request.method === 'HEAD' ? null : html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  })
}

function logoResponse(request) {
  if (!LOGO_DATA_URL.startsWith(LOGO_PREFIX)) {
    return new Response('Not Found', { status: 404 })
  }
  const binary = atob(LOGO_DATA_URL.slice(LOGO_PREFIX.length))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new Response(request.method === 'HEAD' ? null : bytes, {
    status: 200,
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400, immutable',
      'x-content-type-options': 'nosniff',
    },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.hostname === 'dashxd.com') {
      url.hostname = 'www.dashxd.com'
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 308)
    }
    if (url.hostname !== 'www.dashxd.com') return new Response('Not Found', { status: 404 })
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } })
    }
    if (url.pathname === '/logo') return logoResponse(request)

    const match = /^\/out\/([a-z0-9-]+)\/?$/.exec(url.pathname)
    if (match) {
      const route = serviceRouteById(match[1])
      if (!route) return new Response('Not Found', { status: 404 })
      const key = `dashxd/service-routes/${route.id}`
      const rawRecord = env.DASHXD_ROUTES ? await env.DASHXD_ROUTES.get(key) : null
      const destination = resolveServiceDestination(route, rawRecord)
      if (destination) {
        return new Response(null, {
          status: 302,
          headers: { location: destination, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
        })
      }
      return htmlResponse(renderServicePlaceholder(workerMetaFromRequest(request, SERVICE), route), request)
    }
    if (url.pathname !== '/') return new Response('Not Found', { status: 404 })
    return htmlResponse(renderDashXdPage(workerMetaFromRequest(request, SERVICE)), request)
  },
}
