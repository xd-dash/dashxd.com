import { readFileSync } from 'node:fs'

const zone = '92ef682119e35c1f83b07941c28b8048'
const file = process.argv[2] || new URL('./imports.json', import.meta.url)
const input = JSON.parse(readFileSync(file, 'utf8'))
if (input.schema !== 1 || input.zone_id !== zone || !Array.isArray(input.records)) {
  throw new Error('Invalid import selection or Cloudflare zone')
}
const keys = new Set()
const ids = new Set()
const imports = []
for (const record of input.records) {
  if (!record || typeof record !== 'object' ||
      !/^[a-z0-9][a-z0-9_-]*$/.test(record.key || '') ||
      !/^[0-9a-f]{32}$/.test(record.id || '') ||
      !['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'CAA'].includes(record.type) ||
      !(record.name === 'dashxd.com' || record.name?.endsWith('.dashxd.com')) ||
      keys.has(record.key) || ids.has(record.id)) {
    throw new Error('Invalid or duplicate selected DNS record')
  }
  keys.add(record.key)
  ids.add(record.id)
  imports.push({
    to: `cloudflare_dns_record.managed["${record.key}"]`,
    id: `${zone}/${record.id}`,
    name: record.name,
    type: record.type,
  })
}
if (imports.length === 0) {
  process.stdout.write('No DNS records selected. No imports are authorized.\n')
} else {
  process.stdout.write(JSON.stringify({ execute: false, imports }, null, 2) + '\n')
}
