import { workerMetaFromRequest } from './src/design/index.js'
import { renderDashXdPage } from './src/site.js'

const SERVICE = 'dashxd-com'
const LOGO_DATA_URL = __HURAM_INLINE_LOGO__
const LOGO_PREFIX = 'data:image/png;base64,'

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
  async fetch(request) {
    const url = new URL(request.url)

    if (url.hostname === 'dashxd.com') {
      url.hostname = 'www.dashxd.com'
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 308)
    }

    if (url.hostname !== 'www.dashxd.com') {
      return new Response('Not Found', { status: 404 })
    }

    if (url.pathname === '/logo') {
      return logoResponse(request)
    }

    if (url.pathname !== '/') {
      return new Response('Not Found', { status: 404 })
    }

    const html = renderDashXdPage(workerMetaFromRequest(request, SERVICE))
    return new Response(request.method === 'HEAD' ? null : html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    })
  },
}
