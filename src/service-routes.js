export const SERVICE_ROUTES = Object.freeze([
  { id: 'console', name: 'console.dash.xd.run', allowedHost: 'console.dash.xd.run' },
  { id: 'logma', name: 'logma.sh', allowedHost: 'logma.sh' },
  { id: 'chi', name: 'chi.ninja', allowedHost: 'chi.ninja' },
  { id: 'gospace', name: 'gospace.cloud', allowedHost: 'gospace.cloud' },
  { id: 'gateway', name: 'gateway.us-west1.farcaster.world', allowedHost: 'gateway.us-west1.farcaster.world' },
  { id: 'deploy', name: 'deploy.fatline.to', allowedHost: 'deploy.fatline.to' },
  { id: 'firekv', name: 'firekv.com', allowedHost: 'firekv.com' },
  { id: 'oidc', name: 'oidc.auth.net.im', allowedHost: 'oidc.auth.net.im' },
])

export function serviceRouteById(id) {
  return SERVICE_ROUTES.find((route) => route.id === id) ?? null
}

export function resolveServiceDestination(route, rawRecord) {
  if (!route || typeof rawRecord !== 'string') return null

  try {
    const record = JSON.parse(rawRecord)
    if (
      record?.id !== route.id
      || record?.name !== route.name
      || typeof record?.target !== 'string'
    ) return null

    const target = new URL(record.target)
    if (
      target.protocol !== 'https:'
      || target.hostname !== route.allowedHost
      || target.username
      || target.password
      || target.port
      || target.hash
    ) return null

    return target.toString()
  } catch {
    return null
  }
}
