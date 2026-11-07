output "managed_record_keys" {
  description = "Explicitly configured DNS record keys."
  value       = sort(keys(var.records))
}
