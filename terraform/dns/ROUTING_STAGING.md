# Routing staging map

This is a review aid for DNS routing; it does not create or import records. The Terraform default resource map, example variables, and `imports.json` remain empty.

## Current dashxd.com routing

| Hostname | Current routing | Staging treatment |
| --- | --- | --- |
| `dashxd.com`, `www.dashxd.com` | Existing Cloudflare Custom Domains for the dashxd.com GitHub Pages site | Keep unchanged; these already route the site |
| `firekv.dashxd.com`, `kv.dashxd.com` | Existing FireKV Worker Custom Domains | Keep with FireKV deployment ownership |
| Existing proxied AAAA `100::` records | Existing placeholder-style hosts include base64/easyencoder aliases, apex/www, FireKV aliases, reddit aliases, `sandbox.auth`, and `veda` | Do not adopt or repurpose without confirming each service owner |
| Existing CNAMEs to `ghs.googlehosted.com` | Versioned auth/firecache/ratelimiter APIs, `chats`, `firebase-auth`, `logma`, and `token` | Keep unchanged until the destination and owner are confirmed |
| `debroglie.dashxd.com` | Proxied A record to `35.212.217.109` | Treat as an existing live service |

The latest read-only DNS snapshot was captured on 2026-11-08 at 07:40:41Z and contains 35 records. Huram used a short-lived child token scoped to the pinned zone ID and revoked it after capture. It is a point-in-time inventory; refresh it before any state adoption or DNS change.

## Placeholder routing

The landing page's DNS for the apex and `www` is already routed to GitHub Pages. Its links to external domains do not require new `dashxd.com` DNS records. An application-level placeholder such as `placeholder.invalid` does not define a DNS destination.

No additional dashxd.com hostname or target is established by the current repository description or inventory. Keep the example configuration empty until a concrete hostname-to-service mapping is selected. For each new hostname, record:

1. the intended hostname;
2. the destination type (GitHub Pages, Cloudflare Worker, or origin);
3. the target service and owner; and
4. whether it is a new hostname or an existing record selected for Terraform adoption.

Do not add a wildcard record or reuse an existing `100::` record as a generic destination. A proxied `100::` record only supplies a Cloudflare-proxied DNS answer; it does not select a Worker or application.

## Excluded Worker Route

The read-only inventory also observed `api.v0.0.1.auth.util.dashxd.com/` targeting Worker script `auth-callback`. That route is not part of the dashxd.com landing-page routing change, and the route inventory does not establish whether the callback is still needed. Its DNS candidate has been removed from this PR. Do not create a DNS record for it as part of this work unless its purpose is confirmed separately.

## Next staging step

Choose the specific dashxd.com aliases the landing page or services should expose, with an owner and target for each. Then add only those reviewed records to the non-auto-loaded example, run the offline plan qualification, and keep apply disabled pending a separate review.
