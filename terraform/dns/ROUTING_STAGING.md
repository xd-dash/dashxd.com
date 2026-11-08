# Routing staging map

This is a review aid for DNS routing; it does not create or import records. The Terraform default resource map and `imports.json` remain empty; the example variables file contains one staged candidate.

## Known hostname ownership

| Hostname | Routing in 2026-11-08 snapshot | Staging treatment |
| --- | --- | --- |
| `dashxd.com`, `www.dashxd.com` | Existing Custom Domains for the dashxd.com GitHub Pages site | Leave unchanged; do not recreate as DNS resources |
| `firekv.dashxd.com`, `kv.dashxd.com` | Existing FireKV Worker Custom Domains | Leave unchanged; FireKV deployment owns these |
| Proxied AAAA `100::` records | Present for `base64-encode`, `base64-encoder`, `base64`, `easy-encoder`, `easyencoder`, `ez-encoder`, `ezencoder`, `dashxd.com`, `www`, `firekv`, `kv`, `reddit`, `www.reddit`, `sandbox.auth`, and `veda`; one separate Worker Route was inventoried | Keep existing records unchanged; only the missing auth-callback hostname is staged below |
| CNAMEs to `ghs.googlehosted.com` | Google-hosted endpoints include versioned auth/firecache/ratelimiter APIs, `chats`, `firebase-auth`, `logma`, and `token` | Leave unchanged until each service owner and replacement target is confirmed |
| `debroglie.dashxd.com` | Proxied A record to `35.212.217.109` | Treat as an existing live service, not a placeholder |

The latest read-only DNS snapshot was captured on 2026-11-08 at 07:40:41Z and contains 35 records. Huram scoped its short-lived child token to the pinned zone ID and revoked it after capture. This snapshot is the basis for the candidate below.

## Existing Worker Route with missing DNS

Huram's zone-scoped `Workers Routes Read` inventory found:

| Pattern | Worker script | Route ID | DNS record |
| --- | --- | --- | --- |
| `api.v0.0.1.auth.util.dashxd.com/` | `auth-callback` | `5ad6eba475fd49d2a95c587b476adbba` | No record in the 2026-11-08 inventory |

A new proxied `AAAA` record for `api.v0.0.1.auth.util.dashxd.com` with content `100::` is staged in `records.auto.tfvars.example`. The import selection remains empty because this hostname has no existing DNS record to import. The record is not applied. The route pattern ends in `/`, so it matches the hostname's root path; expand the route separately if the callback must accept other paths.

## Placeholder routing rule

A placeholder target must still be a deliberate destination. A proxied `100::` DNS record supplies the Cloudflare-proxied DNS answer needed by a Worker Route, but it does not identify the Worker. Worker Routes are separately configured; the live route inventory identified the `auth-callback` route listed above.

For a hostname intended to serve a future Worker, stage both pieces explicitly:
1. the DNS record needed for Cloudflare proxying, if the chosen Worker routing mode requires one; and
2. the named Worker Custom Domain or route pattern that will receive requests.

Do not add a wildcard DNS record or reassign an existing `100::` record as a generic placeholder. Existing specific DNS records take precedence over a wildcard, and a DNS placeholder without a Worker route can resolve while still failing to serve the intended app.

## Pending mapping

The dashxd.com landing page currently links to external destinations such as `console.dash.xd.run`, `logma.sh`, `chi.ninja`, `gospace.cloud`, `gateway.us-west1.farcaster.world`, `deploy.fatline.to`, `firekv.com`, and `oidc.auth.net.im`. These are not dashxd.com DNS targets. The page's `placeholder.invalid` origin is an application-level placeholder and does not define a DNS destination.

Before adding new routing records, create a reviewed hostname-to-target mapping for each desired dashxd.com alias. No new alias names or origin targets are inferred here. Once the mapping is explicit, add only those new records or selected existing records to the Terraform root, qualify the plan against FireKV state, and keep apply disabled until separately authorized.
