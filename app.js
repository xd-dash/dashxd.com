const PLACEHOLDER_ORIGIN = 'https://placeholder.invalid'

function buildOutboundUrl(target) {
  const source = new URL(window.location.href)
  const outbound = new URL(`/out/${encodeURIComponent(target)}`, PLACEHOLDER_ORIGIN)

  outbound.searchParams.set('source_path', source.pathname)

  for (const [key, value] of source.searchParams) {
    outbound.searchParams.append(key, value)
  }

  if (source.hash) {
    outbound.searchParams.set('source_hash', source.hash.slice(1))
  }

  return outbound.toString()
}

document.querySelectorAll('.link-button[data-target]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault()
    const target = button.dataset.target
    window.open(buildOutboundUrl(target), '_blank', 'noopener,noreferrer')
  })
})
