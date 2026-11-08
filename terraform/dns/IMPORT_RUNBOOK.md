# Adopt existing dashxd.com DNS records (not executed)

## Current state backend

Huram deployed FireKV revision `a774c73decc382b60e7c0c8034046129b339e168` and ran production qualification [42453260029](https://github.com/xd-dash/huram-abi-master/actions/runs/42453260029). The real GitHub OIDC exchange, a Terraform state write, fresh-init recovery, backup/restore, hostname alias read, and scope-isolation check passed. The qualification failed its final integrity check: an unauthenticated POST was rejected with 401, but a subsequent authenticated GET returned 404. Huram cleaned the isolated test scope and revoked the short-lived Cloudflare deployment token. A second production check [42453688412](https://github.com/xd-dash/huram-abi-master/actions/runs/42453688412) failed when Terraform could not read back state immediately after apply; Huram removed that disposable scope in [cleanup run 42453859328](https://github.com/xd-dash/huram-abi-master/actions/runs/42453859328).

Treat FireKV Workers KV as unqualified for authoritative Terraform state until state reads remain reliable after writes across requests and hostnames. The Worker has no Terraform lock endpoints, and KV can return stale values or cached missing-key results. Do not initialize a FireKV state scope, run a state-backed plan, or import DNS records into FireKV.

Keep any existing GCS state authoritative. Use Huram's Google Workload Identity Federation path with a GCS state backend for managed DNS work until FireKV passes production state-integrity qualification. Do not reuse a device-token cache bucket. No DNS state has been initialized and `imports.json` remains empty.

## Preconditions

1. Capture fresh DNS record IDs, content, TTL, proxy status, priority, and settings with a read-only Cloudflare token.
2. Select one record at a time and review its exact Terraform configuration. Do not import apex or `www` records by default.
3. Initialize the DNS management root only against the intended GCS bucket and a dedicated prefix. Verify the bucket, versioning, access scope, and state lineage before any state write.
4. Back up the GCS state and verify the backup can be read. Stop other writers during import and plan review.
5. Do not run an apply. Huram has no DNS apply workflow.

## Stage an import

Add an entry to `imports.json` with the record's stable Terraform key and exact live Cloudflare record ID. The key must also exist in the `records` variable with the current record properties; do not synthesize missing TTL, proxy, priority, or content fields.

Run the local validation:

```sh
node --test import-check.test.mjs
node import-check.mjs imports.json
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
```

The import-selection checker prints a review document only. It does not execute Terraform import. No CI workflow imports records.

## GCS-backed adoption

After the GCS backend is initialized with Huram WIF and its backup is verified:

1. Check `terraform state list` and `terraform state pull`; compare lineage, serial, and resource addresses with the backup.
2. Confirm the exact record ID and pinned provider import format.
3. Import one selected record into GCS state.
4. Run `terraform plan -refresh-only`, followed by an ordinary `terraform plan`.
5. Review all create, replace, and delete actions. Stop on any unexpected difference; do not apply.

If FireKV later passes production consistency and recovery qualification, evaluate a separately backed-up and reviewed state migration from GCS. Do not migrate simply because the authentication route works.

The management root is `terraform/dns`. The independent `terraform/dns-inspect` root performs read-only DNS inventory with ephemeral local state.

## Status

- DNS Terraform static validation and read-only live DNS inspection: qualified.
- FireKV local OIDC plus Terraform CLI interoperability: qualified.
- FireKV deployed and real OIDC exchange: successful.
- FireKV production state integrity: **failed; do not use for DNS state**.
- GCS-backed DNS state: use through Huram WIF before importing.
- DNS imports, migration, and apply: not performed.
