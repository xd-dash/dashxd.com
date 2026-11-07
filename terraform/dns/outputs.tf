output "managed_record_addresses" {
  description = "Resource addresses explicitly configured for Terraform management."
  value       = sort([for key in keys(var.records) : "cloudflare_dns_record.managed[\"\u0024{key}\"]"])
}
