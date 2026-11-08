# dashxd.com DNS Terraform — staged only

This root owns **only explicitly selected Cloudflare DNS records** in the pinned `dashxd.com` zone. It does not own Worker source, Custom Domains, Workers Routes, Cloudflare Access, the public FireKV Worker, or the private tfstate service.

The default `records = {}` creates no resources. Never populate records from a stale inventory or bulk-import the existing records. The most recent committed inventory is from 2026-09-16; a fresh read-only inventory attempt failed to resolve the exact zone, so refresh it before selecting existing records. Existing `dashxd.com` and `www.dashxd.com` Custom Domains are already qualified and must not be changed to adopt DNS records. The existing proxied `100::` AAAA records remain out of scope until their purpose is established.

## Offline validation

```sh
cd terraform/dns
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
```

Provider is pinned to Cloudflare 5.23.0; commit the generated `.terraform.lock.hcl` from a trusted provider installation before allowing any state-backed plan. No credential is needed for static validation.

## Backend boundary

FireKV's Hono/Workers KV state route is deployed at `firekv.dashxd.com`. Huram's sandbox qualification using real GitHub OIDC and Terraform 1.14 passed for the deployed FireKV revision `a774c73decc382b60e7c0c8034046129b339e168`: state became visible within bounded polling, a fresh Terraform init recovered it, the `kv.dashxd.com` alias read the same state, and unauthorized POST/DELETE requests were rejected without changing the state bytes. A read-only inspection of a test scope that initially returned 404 later found valid Terraform state (format version 4, serial 1), confirming delayed visibility in that case.

Workers KV is eventually consistent and this Worker has no Terraform LOCK/UNLOCK protocol. Use one active writer per state scope and bounded polling for reads. Huram serializes the sandbox qualification workflow; any future DNS state workflow must enforce the same single-writer rule. This sandbox result does not create DNS state or authorize imports or applies.

The DNS management root uses the authenticated FireKV HTTP backend. The GCS bucket inventory was exploratory only; FireKV is the selected Terraform state backend. The import selection remains empty, and no DNS state has been initialized.

## Controlled adoption protocol

1. Capture fresh DNS record IDs, content, TTL, proxy status and any priority/settings with a read-only Cloudflare token.
2. Choose individual DNS records and review the exact Terraform configuration, including fields that the provider might normalize.
3. Refresh the live DNS inventory and map each desired hostname to its actual Cloudflare Worker, Pages site, or origin. Keep placeholder destinations explicit and reviewable.
4. Use one writer for the FireKV state scope. FireKV has no Terraform lock protocol; Huram's DNS workflow must serialize state-changing jobs and poll bounded reads. Import selected existing records using `terraform import 'cloudflare_dns_record.managed["key"]' '<zone_id>/<record_id>'` only after choosing them.
5. Run `terraform plan -refresh-only`, then a normal read-only plan. Investigate any create, replace or delete actions. Apply requires separate authorization and is **not** implemented in Huram's staged workflow.

No `terraform apply`, `terraform import`, `terraform state push`, or DNS mutation is authorized by this staging branch.
