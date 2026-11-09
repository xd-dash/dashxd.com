# dashxd service routes namespace

This root manages only the dedicated Workers KV namespace used by the dashxd.com placeholder routes. It does not manage DNS, FireKV namespaces, or route values.

The Cloudflare provider resource is `cloudflare_workers_kv_namespace.service_routes`. The Worker receives the resulting namespace ID through its `DASHXD_ROUTES` binding.

Use the authenticated FireKV HTTP backend with the state scope `cloudflare/dashxd-service-routes`. Do not use a local backend or GCS for a live apply. Keep a single active writer for this scope because FireKV does not implement Terraform locking.

The namespace resource has `prevent_destroy` enabled. Review the plan and confirm it proposes only one namespace creation before applying. Do not add route entries to this root; destination values are managed separately in the dedicated namespace only after each destination is ready.
