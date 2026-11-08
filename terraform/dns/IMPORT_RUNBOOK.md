# Adopt existing dashxd.com DNS records (not executed)

## Current state backend

The DNS management root is configured for FireKV's authenticated Terraform HTTP backend. Huram has qualified the deployed Hono/Workers KV path in sandbox with real GitHub OIDC and Terraform 1.14. State visibility required bounded polling; Terraform recovered it through a fresh init, the alias returned the same state, and unauthorized POST/DELETE requests were rejected without changing state bytes. A separate read-only check found valid state after an earlier 404 had resolved.

Workers KV is eventually consistent. The Worker does not provide Terraform LOCK/UNLOCK, so enforce one active writer per state scope and poll reads for the documented window. Do not run overlapping state writers. No DNS state has been initialized, and `imports.json` remains empty. No apply or import has been performed.

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
