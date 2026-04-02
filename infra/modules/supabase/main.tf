# =============================================================================
# MÓDULO SUPABASE - Referência ao Projeto Existente
# =============================================================================
#
# NOTA: O Supabase não possui um provider Terraform oficial completo.
# Este módulo serve como documentação e referência para o projeto existente.
# O provisionamento do Supabase é feito via Dashboard ou CLI.
#
# Para provisionar via CLI:
#   supabase projects create <nome> --org-id <org-id> --region <region>
#
# =============================================================================

locals {
  # Configurações do projeto Supabase existente
  project_config = {
    id     = var.project_id
    url    = var.project_url
    region = var.region
  }

  # Connection strings
  connection_strings = {
    direct = "postgresql://postgres:${var.db_password}@db.${var.project_id}.supabase.co:5432/postgres"
    pooler = "postgresql://postgres:${var.db_password}@db.${var.project_id}.supabase.co:6543/postgres?pgbouncer=true"
  }
}

# -----------------------------------------------------------------------------
# DATA SOURCE - Validação do projeto (simulado)
# -----------------------------------------------------------------------------

# Este recurso null serve para documentar e validar as configurações
resource "null_resource" "supabase_project_reference" {
  triggers = {
    project_id  = var.project_id
    project_url = var.project_url
    region      = var.region
  }

  # Validação básica via curl (opcional)
  provisioner "local-exec" {
    command = <<-EOT
      echo "Supabase Project Reference:"
      echo "  ID: ${var.project_id}"
      echo "  URL: ${var.project_url}"
      echo "  Region: ${var.region}"
    EOT
  }
}
