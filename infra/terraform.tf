terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }

  # Backend para armazenar o state remotamente (opcional - pode usar local inicialmente)
  # Descomente para usar Terraform Cloud ou S3
  # backend "remote" {
  #   organization = "seu-org"
  #   workspaces {
  #     name = "controle-financas"
  #   }
  # }
}

# Provider Vercel
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}
