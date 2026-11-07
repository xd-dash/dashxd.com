terraform {
  required_version = ">= 1.9.8, < 2.0.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "= 5.23.0"
    }
  }

  backend "http" {}
}

provider "cloudflare" {}
