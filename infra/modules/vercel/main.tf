# =============================================================================
# MÓDULO VERCEL - Provisionamento de Projetos
# =============================================================================

terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

# -----------------------------------------------------------------------------
# PROJETO VERCEL
# -----------------------------------------------------------------------------

resource "vercel_project" "this" {
  name      = var.project_name
  framework = var.framework

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  root_directory   = var.root_directory
  build_command    = var.build_command
  output_directory = var.output_directory
  install_command  = var.install_command

  # Configurações de ambiente
  serverless_function_region = var.serverless_region

  # Ignorar comando de build se não especificado
  ignore_command = var.ignore_command
}

# -----------------------------------------------------------------------------
# VARIÁVEIS DE AMBIENTE DO PROJETO
# -----------------------------------------------------------------------------

resource "vercel_project_environment_variable" "env_vars" {
  for_each = var.environment_variables

  project_id = vercel_project.this.id
  key        = each.key
  value      = each.value
  target     = var.environment == "prod" ? ["production"] : ["preview", "development"]
}

# -----------------------------------------------------------------------------
# DOMÍNIO PERSONALIZADO (opcional)
# -----------------------------------------------------------------------------

resource "vercel_project_domain" "custom_domain" {
  count = var.custom_domain != null ? 1 : 0

  project_id = vercel_project.this.id
  domain     = var.custom_domain
}
