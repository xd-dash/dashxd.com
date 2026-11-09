variable "zone_id" {
  description = "Pinned Cloudflare zone identifier for dashxd.com."
  type        = string
  default     = "92ef682119e35c1f83b07941c28b8048"

  validation {
    condition     = var.zone_id == "92ef682119e35c1f83b07941c28b8048"
    error_message = "Only the verified dashxd.com zone is permitted."
  }
}

variable "records" {
  description = "Explicitly imported DNS records. Empty by default: no resource adoption or creation."
  type = map(object({
    name     = string
    type     = string
    content  = string
    ttl      = number
    proxied  = optional(bool)
    priority = optional(number)
    comment  = optional(string)
  }))
  default = {}

  validation {
    condition = alltrue([
      for key, record in var.records :
      can(regex("^[a-z0-9][a-z0-9_-]*$", key)) &&
      (record.name == "dashxd.com" || endswith(record.name, ".dashxd.com")) &&
      contains(["A", "AAAA", "CNAME", "TXT", "MX", "CAA"], record.type) &&
      (record.ttl == 1 || (record.ttl >= 60 && record.ttl <= 86400)) &&
      length(record.content) > 0
    ])
    error_message = "Record keys, hostnames, types, TTLs and content must be explicit and zone-scoped."
  }
}
