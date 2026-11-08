# Routing staging map

This is a review aid for DNS routing; it does not create or import records. The Terraform default resource map, example variables, and `imports.json` remain empty.

## Current dashxd.com site routing

| Hostname/path | Current behavior | Staging treatment |
| --- | --- | --- |
| `dashxd.com` | The dashxd-com Worker redirects to `https://www.dashxd.com` with status 308, preserving path and query | Keep existing apex DNS/custom-domain setup; do not duplicate it in DNS Terraform |
| `www.dashxd.com/` | The dashxd-com Worker serves the landing page | Keep existing Worker Custom Domain ownership |
| `www.dashxd.com/logo` | The Worker serves the repository-owned logo asset | Keep existing Worker behavior |
| Other paths on `www.dashxd.com` | The Worker returns 404 | Additional app routes require a separately qualified Worker change |
| Landing-page service buttons | The current page constructs links on `https://placeholder.invalid/out/<target>` | This is application behavior, not a DNS record. `.invalid` is intentionally not a usable destination; DNS Terraform cannot make it route |

The dashxd-com route qualification checked the immutable site source and public HTTPS behavior, including apex redirect and the canonical host: [Huram run 42516820857](https://github.com/xd-dash/huram-abi-master/actions/runs/42516820857). The live DNS inventory captured on 2026-11-08 at 07:40:41Z contains 35 records, including proxied AAAA `100::` records for apex and www. The old GitHub Pages DNS evidence from 2026-09-04 is historical; it is not the current site target.

## Existing service DNS

| Existing records | Current inventory | Staging treatment |
| --- | --- | --- |
| `firekv.dashxd.com`, `kv.dashxd.com` | FireKV Worker Custom Domains | Keep with FireKV deployment ownership |
| Other proxied AAAA `100::` records | base64/easyencoder aliases, reddit aliases, `sandbox.auth`, and `veda` | Do not adopt or repurpose without confirming each service owner |
| CNAMEs to `ghs.googlehosted.com` | Versioned auth/firecache/ratelimiter APIs, `chats`, `firebase-auth`, `logma`, and `token` | Keep unchanged until the destination and owner are confirmed |
| `debroglie.dashxd.com` | Proxied A record to `35.212.217.109` | Treat as an existing live service |

This DNS snapshot is point-in-time evidence. Refresh it before any state adoption or DNS change.

## Additional routing needed

The current repo identifies external service links, but does not define new `*.dashxd.com` aliases for them. Their destinations currently use `placeholder.invalid`; creating DNS entries under `dashxd.com` would not fix that application-level URL. To make these links route to temporary placeholders on dashxd.com, a separate site/Worker change must first define the temporary path or hostname and its response behavior. DNS Terraform should only stage DNS after that routing contract exists.

The observed Worker Route `api.v0.0.1.auth.util.dashxd.com/` targeting `auth-callback` is unrelated to the landing-page route contract, and its current purpose is unverified. Its candidate DNS record was removed from this PR.

## Final staging boundary

The main site already routes through its Worker Custom Domains, so no new site DNS record is required. Keep DNS resources and imports empty for this change. Once desired placeholder aliases and their Worker/origin targets are defined, add only those explicit records to the example, qualify the offline plan, then review existing state adoption separately. Apply remains disabled.
