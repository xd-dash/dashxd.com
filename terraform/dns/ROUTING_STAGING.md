# Routing staging map

This is a review aid for DNS routing; it does not create or import records. The Terraform resource map and `imports.json` remain empty.

## Known hostname ownership

| Hostname | Last known routing | Staging treatment |
| --- | --- | --- |
| `dashxd.com`, `www.dashxd.com` | Existing Custom Domains for the dashxd.com GitHub Pages site | Leave unchanged; do not recreate as DNS resources |
| `firekv.dashxd.com`, `kv.dashxd.com` | Existing FireKV Worker Custom Domains | Leave unchanged; FireKV deployment owns these |
| Names with proxied AAAA `100::` records | Last seen in the 2026-09-16 DNS snapshot; likely edge/Worker placeholders, but the corresponding routes were not captured | Do not import or repoint until the Worker route mapping is confirmed |
| Names with CNAME `ghs.googlehosted.com` | Google-hosted service endpoints in the last captured snapshot | Leave unchanged until each service owner and replacement target is confirmed |
| `debroglie.dashxd.com` | Proxied A record to `35.212.217.109` in the last captured snapshot | Treat as an existing live service, not a placeholder |

The 2026-09-16 snapshot is historical. A fresh Huram read-only inventory attempt on 2026-11-08 failed because the delegated workflow could not resolve exactly one `dashxd.com` zone in its configured account. Refresh the inventory before using any record IDs or deciding whether a hostname is available.

## Placeholder routing rule

A placeholder target must still be a deliberate destination. A proxied `100::` DNS record only supplies a Cloudflare-proxied DNS answer; by itself it does not identify which Worker handles the request. Worker Custom Domains and Worker Routes are separate routing configuration and are outside this DNS-only Terraform root.

For a hostname intended to serve a future Worker, stage both pieces explicitly:
1. the DNS record needed for Cloudflare proxying, if the chosen Worker routing mode requires one; and
2. the named Worker Custom Domain or route pattern that will receive requests.

Do not add a wildcard DNS record or reassign an existing `100::` record as a generic placeholder. Existing specific DNS records take precedence over a wildcard, and a DNS placeholder without a Worker route can resolve while still failing to serve the intended app.

## Pending mapping

The dashxd.com landing page currently links to external destinations such as `console.dash.xd.run`, `logma.sh`, `chi.ninja`, `gospace.cloud`, `gateway.us-west1.farcaster.world`, `deploy.fatline.to`, `firekv.com`, and `oidc.auth.net.im`. These are not dashxd.com DNS targets. The page's `placeholder.invalid` origin is an application-level placeholder and does not define a DNS destination.

Before adding new routing records, create a reviewed hostname-to-target mapping for each desired dashxd.com alias. No new alias names or origin targets are inferred here. Once the mapping is explicit, add only those new records or selected existing records to the Terraform root, qualify the plan against FireKV state, and keep apply disabled until separately authorized.
