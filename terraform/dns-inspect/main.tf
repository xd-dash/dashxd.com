variable "zone_id" {
  description = "The exact dashxd.com Cloudflare zone to inspect."
  type        = string
  default     = "92ef682119e35c1f83b07941c28b8048"

  validation {
    condition     = var.zone_id == "92ef682119e35c1f83b07941c28b8048"
    error_message = "Only the pinned dashxd.com zone may be inspected."
  }
}

data "cloudflare_dns_records" "zone" {
  zone_id   = var.zone_id
  max_items = 1000
}

output "record_count" {
  description = "Read-only count of current Cloudflare DNS records."
  value       = length(data.cloudflare_dns_records.zone.result)
}

output "record_types" {
  description = "Types present in the live Cloudflare DNS inventory."
  value       = sort(distinct([for record in data.cloudflare_dns_records.zone.result : record.type]))
}
