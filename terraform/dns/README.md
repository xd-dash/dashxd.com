# dashxd.com DNS Terraform — staged only

This root owns only explicitly selected Cloudflare DNS records in the pinned `dashxd.com` zone. It does not own Worker source, Worker Custom Domains, Workers Routes, Cloudflare Access, the public FireKV Worker, or the private tfstate service.

The default `records = {}` creates no resources. The example variables file and `imports.json` are also empty. A fresh read-only DNS inventory was captured on 2026-11-08 and contains 35 records.

The site’s current route contract is a Cloudflare Worker: `dashxd.com` redirects to `www.dashxd.com` with 308, and `www.dashxd.com` serves the landing page at `/` and logo at `/logo`. The public route qualification passed in [Huram run 42516820857](https://github.com/xd-dash/huram-abi-master/actions/runs/42516820857). Existing apex/www DNS and Worker Custom Domains are outside this DNS Terraform root; do not recreate them. The old GitHub Pages DNS evidence is historical.

The landing-page buttons currently build outbound URLs under `placeholder.invalid`. That is an application-level placeholder, not a DNS target. Adding DNS records under `dashxd.com` will not change where those links point. Define a placeholder path/hostname and Worker response separately before staging such records.

## Offline validation

```sh
cd terraform/dns
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
```

The provider is pinned to Cloudflare 5.23.0. No credential is needed for static validation.

## Backend boundary

FireKV's Hono/Workers KV state route is deployed at `firekv.dashxd.com`. Huram's sandbox qualification using real GitHub OIDC and Terraform 1.14 passed: state became visible within bounded polling, a fresh Terraform init recovered it, the `kv.dashxd.com` alias read the same state, and unauthorized POST/DELETE requests were rejected without changing state bytes. A read-only inspection of a test scope that initially returned 404 later found valid Terraform state (format version 4, serial 1), confirming delayed visibility in that case.

Workers KV is eventually consistent and FireKV has no Terraform LOCK/UNLOCK protocol. Use one active writer per state scope and bounded polling for reads. This sandbox result does not create DNS state or authorize imports or applies.

FireKV is the selected Terraform state backend; GCS was exploratory inventory only. No DNS state has been initialized.

## Controlled adoption protocol

1. Capture fresh DNS record IDs, content, TTL, proxy status, and any priority/settings with a read-only Cloudflare token.
2. Choose individual existing DNS records and review the exact Terraform configuration, including provider normalization.
3. Map each desired hostname to its actual Cloudflare Worker, Pages site, or origin. Keep placeholder destinations explicit and reviewable.
4. Use one writer for the FireKV state scope. FireKV has no Terraform lock protocol; any Huram state-changing workflow must serialize jobs and poll bounded reads. Import selected existing records only after review.
5. Run `terraform plan -refresh-only`, then a normal read-only plan. Investigate any create, replace, or delete actions. Apply requires separate authorization and is not implemented in Huram's staged workflow.

No `terraform apply`, `terraform import`, `terraform state push`, or DNS mutation is authorized by this staging branch.
