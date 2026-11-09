# Service route configuration

The homepage's service IDs, display names, and permitted destination hosts are defined in `src/service-routes.js`. These source-controlled entries are authoritative. The Worker uses them to render buttons and validate optional destination overrides.

## KV namespace

Bind a dedicated Cloudflare Workers KV namespace as `DASHXD_ROUTES`. This namespace is only for dashxd.com service routing. Do not bind FireKV's `FILES` namespace: it also contains Terraform state under reserved `terraform/` keys.

A route override uses this key:

```
dashxd/service-routes/<service-id>
```

Value example:

```json
{
  "id": "console",
  "name": "console.dash.xd.run",
  "target": "https://console.dash.xd.run/"
}
```

The Worker redirects only to HTTPS URLs whose hostname exactly matches that service's configured `allowedHost`. It rejects malformed JSON, unknown IDs, name mismatches, other hosts, credentials, ports, and fragments. Missing or invalid values render a local placeholder at `/out/<service-id>`.

With no KV binding or no route keys, all buttons still lead to working placeholder pages. No DNS aliases are needed for these paths.

## Rollout

1. Create a dedicated KV namespace and record its namespace ID as the Huram repository variable `DASHXD_SERVICE_ROUTES_KV_ID`.
2. Deploy the exact source through Huram with the `DASHXD_ROUTES` binding.
3. Verify placeholder routes before adding any KV values.
4. Set individual keys only after the service endpoint is ready and confirmed.
5. Keep DNS and Terraform state changes in their separate reviewed workflow.

This pull request only stages source and deployment metadata. It does not create a KV namespace, write KV values, deploy the Worker, or change DNS.
