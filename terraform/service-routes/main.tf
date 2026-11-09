resource "cloudflare_workers_kv_namespace" "service_routes" {
  account_id = var.account_id
  title      = "dashxd-service-routes"

  lifecycle {
    prevent_destroy = true
  }
}
