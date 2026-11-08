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

FireKV's integrated Hono/Workers KV revision `a774c73decc382b60e7c0c8034046129b339e168` is deployed through Huram. Local Terraform qualification passed. The production qualification [run 42453260029](https://github.com/xd-dash/huram-abi-master/actions/runs/42453260029) verified the real GitHub OIDC exchange, Terraform state write and fresh-init recovery, backup/restore, alias interoperability, and scope isolation. It **failed** the final state-integrity check: an unauthenticated write correctly returned 401, but the subsequent authenticated read returned 404. Huram cleaned up the isolated qualification scope and revoked its Cloudflare child token. A second no-deploy production run [42453688412](https://github.com/xd-dash/huram-abi-master/actions/runs/42453688412) failed earlier: Terraform's post-apply output read could not retrieve the just-written remote state. A narrowly scoped cleanup run [42453859328](https://github.com/xd-dash/huram-abi-master/actions/runs/42453859328) removed that disposable test scope.

These failures mean production FireKV is **not qualified as an authoritative Terraform state backend**. Workers KV may return stale values or cached missing-key results, and this Worker does not implement Terraform LOCK/UNLOCK. One active writer does not guarantee read-after-write visibility. Do not initialize, import, or plan managed DNS state through FireKV until production state visibility and recovery pass reliably.

Keep any existing GCS-backed state authoritative. For DNS management, use Huram's Google Workload Identity Federation path and a GCS state backend until FireKV's consistency issue is resolved. There is no DNS state or imported record in this root yet. Do not point this root at a shared device-token cache bucket or initialize it against an empty FireKV scope.

## Controlled adoption protocol

1. Capture fresh DNS record IDs, content, TTL, proxy status and any priority/settings with a read-only Cloudflare token.
2. Choose individual DNS records and review the exact Terraform configuration, including fields that the provider might normalize.
3. Qualify FireKV authentication, exact-byte read-after-write, restart recovery, concurrent writer rejection and a real lock protocol; preserve an independent recovery copy.
4. Under a single authorized writer and a verified backend lineage, import each selected existing record using `terraform import 'cloudflare_dns_record.managed["key"]' '<zone_id>/<record_id>'`. Confirm the exact provider import format for the pinned version.
5. Run `terraform plan -refresh-only`, then a normal read-only plan. Investigate any create, replace or delete actions. Apply requires separate authorization and is **not** implemented in Huram's staged workflow.

No `terraform apply`, `terraform import`, `terraform state push`, or DNS mutation is authorized by this staging branch.
