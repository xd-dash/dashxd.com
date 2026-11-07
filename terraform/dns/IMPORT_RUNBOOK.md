# Adopt existing dashxd.com DNS records (not executed)

## Preconditions

1. Keep `imports.json` empty until the exact live record IDs and ownership are reviewed. Never import apex or `www` placeholders by default. Only one record is adopted at a time.
2. The existing private FireKV Worker must be **deployed and reachable**, with its owner-only Cloudflare Access policy and the exact `cloudflare/dashxd-dns` scope verified. The current local Wrangler qualification does not prove deployment.
3. Execute Terraform on a trusted **owner-authenticated** workstation or an explicitly authorized runner with an existing Access-compatible transport. The Worker checks native `ctx.access`, audience and owner email; a GitHub OIDC token, Cloudflare API token, or Access service token alone does not satisfy this contract. No FireKV source changes are proposed.
4. Back up the authoritative state independently and verify its lineage and serial. Do not use `terraform init -migrate-state` against an empty destination or overwrite existing state without a separate cutover review.
5. Stop other writers. The existing KV HTTP backend has no LOCK/UNLOCK and may return stale reads. GitHub Actions concurrency is not a storage consistency guarantee.

## Stage an import

Add an entry to `imports.json` with `key`, `id`, `name`, and `type`. The key must also exist in the Terraform `records` variable with the exact current record properties; do not synthesize missing TTL/proxy/content fields. Validate:

```sh
node --test import-check.test.mjs
node import-check.mjs imports.json
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
```

The selection checker only prints an `execute:false` review document. It **does not import**, and no CI workflow runs `terraform import`.

## Authorized execution (future, not automated)

Once the Access-compatible transport is qualified and authoritative state is backed up, initialize the existing HTTP backend with `TF_HTTP_ADDRESS` pointing at the exact FireKV state scope. Do not set lock/unlock addresses, since the existing Worker does not implement them. Keep the owner Access credential out of source files, GitHub Actions logs and Terraform variables.

Run `terraform state list` and `terraform state pull` privately and compare the state lineage, serial and expected resource addresses with the backup. If a state does not exist, stop and obtain explicit approval to create a new one. Select one DNS record and review its exact Cloudflare ID and desired resource configuration. After approval, import only that record into the configured backend, then immediately perform `terraform plan -refresh-only` and a normal `terraform plan`. Do not apply until both plans have been reviewed. If state reads are inconsistent, stop and restore from the verified backup rather than retrying writes blindly.

The management root is `terraform/dns`; the separate `terraform/dns-inspect` root uses ephemeral state and is only for DNS Read discovery. Neither changes FireKV.

## Status

- Real local Wrangler + Terraform CLI: qualified.
- Cloudflare DNS Read-only Terraform plan through Huram: qualified.
- Deployed owner-authenticated FireKV transport: not yet qualified.
- Production state import, migration and apply: not authorized or executed.
