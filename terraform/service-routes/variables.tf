variable "account_id" {
  description = "Cloudflare account that owns the dedicated dashxd service routes namespace."
  type        = string

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.account_id))
    error_message = "account_id must be a 32-character lowercase hexadecimal Cloudflare account ID."
  }
}
