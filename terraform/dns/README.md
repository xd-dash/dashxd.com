# dashxd.com DNS Terraform — staged only

This root owns **only explicitly selected Cloudflare DNS records** in the pinned `dashxd.com` zone. It does not own Worker source, Custom Domains, Workers Routes, Cloudflare Access, the public FireKV Worker, or the private tfstate service.

The default `records = {}` creates no resources. Never populate records from a stale inventory or bulk-import all 35 existing records. Existing `dashxd.com` and `www.dashxd.com` Custom Domains are already qualified and must not be changed to adopt DNS records. The existing proxied `100::` AAAA records remain out of scope until their purpose is established.

## Offline validation

```sh
cd terraform/dns
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
```

Provider is pinned to Cloudflare 5.23.0; commit the generated `.terraform.lock.hcl` from a trusted provider installation before allowing any state-backed plan. No credential is needed for static validation.

## Backend boundary

The intended backend is `http` at a dedicated FireKV state scope such as `cloudflare/dashxd-dns`. Supply `TF_HTTP_ADDRESS`, `TF_HTTP_USERNAME`, and `TF_HTTP_PASSWORD` only from a qualified, short-lived authenticated session. Never commit them or pass passwords in `-backend-config`. The private FireKV Worker under `xd-dash/firekv:codex/private-tfstate-worker` is **not deployed or qualified as a production backend**. It uses eventually consistent KV and has no Terraform lock implementation. Terraform's HTTP backend supports optional LOCK/UNLOCK, but the existing Worker does not. A GitHub concurrency group does not provide cross-process locking or read-after-write consistency.

Until a durable, locking state service is qualified, Huram must not run a live backend plan or import against FireKV. Keep existing GCS state authoritative and separate from the future FireKV state scope. Do not initialize an empty FireKV state and accidentally plan existing infrastructure as new.

## Controlled adoption protocol

1. Capture fresh DNS record IDs, content, TTL, proxy status and any priority/settings with a read-only Cloudflare token.
2. Choose individual DNS records and review the exact Terraform configuration, including fields that the provider might normalize.
3. Qualify FireKV authentication, exact-byte read-after-write, restart recovery, concurrent writer rejection and a real lock protocol; preserve an independent recovery copy.
4. Under a single authorized writer and a verified backend lineage, import each selected existing record using `terraform import 'cloudflare_dns_record.managed["key"]' '<zone_id>/<record_id>'`. Confirm the exact provider import format for the pinned version.
5. Run `terraform plan -refresh-only`, then a normal read-only plan. Investigate any create, replace or delete actions. Apply requires separate authorization and is **not** implemented in Huram's staged workflow.

No `terraform apply`, `terraform import`, `terraform state push`, or DNS mutation is authorized by this staging branch.
