# Live DNS observation — no state backend

This deliberately separate Terraform root observes the Cloudflare DNS zone with the pinned provider's `cloudflare_dns_records` data source and a **DNS Read-only** token. It does not declare any resources, remote state backend, imports, or changes to the existing FireKV service.

This is not a substitute for Terraform management state in `../dns`. It supports read-only DNS discovery now, without assuming a GitHub Actions runner can authenticate as FireKV's owner-only Cloudflare Access identity.

```sh
cd terraform/dns-inspect
export CLOUDFLARE_API_TOKEN='read-only DNS token'
terraform init -input=false
terraform plan -input=false -out=inspect.tfplan
terraform show -json inspect.tfplan | jq -e '.planned_values.outputs | {record_count: .record_count.value, record_types: .record_types.value}'
```

The resulting local Terraform files may include live DNS contents and must not be committed, published, or uploaded as artifacts. The Huram runner keeps the plan private in `RUNNER_TEMP`, reports only aggregate counts and types, and revokes the DNS Read child token.

To manage existing records, select and import their **exact live IDs** into an authoritative state first. Neither this data source nor an empty `../dns` root adopts existing DNS resources. The separate FireKV HTTP backend remains unchanged and its owner-identity requirement is not bypassed.
