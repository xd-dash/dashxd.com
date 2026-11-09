variable "account_id" {
  description = "Cloudflare account that owns the dedicated dashxd service routes namespace."
  type        = string
  default     = "763f6d47e9d04d54e0a6e80b27a1b745"

  validation {
    condition     = can(regex("^[0-9a-f]{32}$", var.account_id))
    error_message = "account_id must be a 32-character lowercase hexadecimal Cloudflare account ID."
  }
}
