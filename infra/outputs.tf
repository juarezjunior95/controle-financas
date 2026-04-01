# =============================================================================
# OUTPUTS - Informações dos recursos provisionados
# =============================================================================

# -----------------------------------------------------------------------------
# VERCEL BACKEND
# -----------------------------------------------------------------------------

output "backend_project_id" {
  description = "ID do projeto backend no Vercel"
  value       = module.vercel_backend.project_id
}

output "backend_project_url" {
  description = "URL do backend no Vercel"
  value       = module.vercel_backend.project_url
}

output "backend_domains" {
  description = "Domínios configurados para o backend"
  value       = module.vercel_backend.domains
}

# -----------------------------------------------------------------------------
# VERCEL FRONTEND
# -----------------------------------------------------------------------------

output "frontend_project_id" {
  description = "ID do projeto frontend no Vercel"
  value       = module.vercel_frontend.project_id
}

output "frontend_project_url" {
  description = "URL do frontend no Vercel"
  value       = module.vercel_frontend.project_url
}

output "frontend_domains" {
  description = "Domínios configurados para o frontend"
  value       = module.vercel_frontend.domains
}

# -----------------------------------------------------------------------------
# SUPABASE (referência ao projeto existente)
# -----------------------------------------------------------------------------

output "supabase_project_id" {
  description = "ID do projeto Supabase"
  value       = var.supabase_project_id
}

output "supabase_url" {
  description = "URL do Supabase"
  value       = var.supabase_url
}

# -----------------------------------------------------------------------------
# RESUMO PARA CONFIGURAÇÃO DO GITHUB ACTIONS
# -----------------------------------------------------------------------------

output "github_secrets_summary" {
  description = "Resumo dos secrets necessários no GitHub Actions"
  value = <<-EOT
    
    ============================================
    SECRETS PARA CONFIGURAR NO GITHUB ACTIONS
    ============================================
    
    Acesse: https://github.com/${var.github_repo}/settings/secrets/actions
    
    VERCEL_ORG_ID              = (obter em vercel.com/account)
    VERCEL_TOKEN               = (obter em vercel.com/account/tokens)
    VERCEL_PROJECT_ID_BACKEND  = ${module.vercel_backend.project_id}
    VERCEL_PROJECT_ID_FRONTEND = ${module.vercel_frontend.project_id}
    
    ============================================
  EOT
}
