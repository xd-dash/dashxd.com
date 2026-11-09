import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const zone = '92ef682119e35c1f83b07941c28b8048'
function check(records, zoneId = zone) {
  const dir = mkdtempSync(join(tmpdir(), 'dns-imports-'))
  try {
    const path = join(dir, 'imports.json')
    writeFileSync(path, JSON.stringify({ schema: 1, zone_id: zoneId, records }))
    return spawnSync(process.execPath, [new URL('./import-check.mjs', import.meta.url).pathname, path], { encoding: 'utf8' })
  } finally { rmSync(dir, { recursive: true, force: true }) }
}
const entry = { key: 'sample', id: 'a'.repeat(32), name: 'sample.dashxd.com', type: 'TXT' }
test('no selected records is a safe no-op', () => assert.equal(check([]).status, 0))
test('selected import stays declarative and nonexecuting', () => {
  const r = check([entry])
  assert.equal(r.status, 0)
  assert.equal(JSON.parse(r.stdout).execute, false)
  assert.equal(JSON.parse(r.stdout).imports[0].id, zone + '/' + entry.id)
})
test('rejects cross-zone and duplicate selections', () => {
  assert.notEqual(check([entry], 'b'.repeat(32)).status, 0)
  assert.notEqual(check([entry, entry]).status, 0)
  assert.notEqual(check([{ ...entry, name: 'attacker.example' }]).status, 0)
  assert.notEqual(check([{ ...entry, id: 'invalid' }]).status, 0)
})
