# Adopt existing dashxd.com DNS records (not executed)

## Current state backend

The DNS management root is configured for FireKV's authenticated Terraform HTTP backend. Huram has qualified the deployed Hono/Workers KV path in sandbox with real GitHub OIDC and Terraform 1.14. State visibility required bounded polling; Terraform recovered it through a fresh init, the alias returned the same state, and unauthorized POST/DELETE requests were rejected without changing state bytes. A separate read-only check found valid state after an earlier 404 had resolved.

Workers KV is eventually consistent. The Worker does not provide Terraform LOCK/UNLOCK, so enforce one active writer per state scope and poll reads for the documented window. Do not run overlapping state writers. No DNS state has been initialized, and `imports.json` remains empty. No apply or import has been performed.

## Preconditions

1. Capture fresh DNS record IDs, content, TTL, proxy status, priority, and settings with a read-only Cloudflare token.
2. Select one record at a time and review its exact Terraform configuration. Do not import apex or `www` records by default.
3. Initialize the DNS management root through Huram's authenticated FireKV backend with a dedicated state scope. Confirm the authenticated state endpoint is readable before any import.
4. Keep one active writer for the scope. Because KV reads can lag writes, poll the state endpoint within the qualified window before concluding state is missing.
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

## FireKV-backed adoption

After FireKV state access is authenticated through Huram and the dedicated scope is confirmed:

1. Check `terraform state list` and use `terraform state pull` to verify the expected state lineage and resource addresses. Poll reads for bounded eventual visibility.
2. Confirm the exact record ID and pinned provider import format.
3. Import one selected record into the FireKV-backed state.
4. Run `terraform plan -refresh-only`, followed by an ordinary `terraform plan`.
5. Review all create, replace, and delete actions. Stop on any unexpected difference; do not apply.

The management root is `terraform/dns`. The independent `terraform/dns-inspect` root performs read-only DNS inventory with ephemeral local state.

## Status

- DNS Terraform static validation and read-only live DNS inspection: qualified.
- FireKV local OIDC plus Terraform CLI interoperability: qualified.
- FireKV deployed and real OIDC exchange: successful.
- FireKV authenticated Terraform sandbox qualification: passed with bounded polling; no lock protocol, so one writer per scope.
- FireKV-backed DNS state: not initialized; DNS inventory and routing targets still need a fresh, reviewed selection.
- DNS imports, migration, and apply: not performed.
