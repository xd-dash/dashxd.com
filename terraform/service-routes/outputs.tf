output "namespace_id" {
  description = "Namespace ID to pin as the DASHXD_ROUTES Worker binding."
  value       = cloudflare_workers_kv_namespace.service_routes.id
}
