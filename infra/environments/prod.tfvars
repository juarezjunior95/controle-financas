# =============================================================================
# VARIÁVEIS DE AMBIENTE - PRODUÇÃO
# =============================================================================

project_name = "controle-financas"
environment  = "prod"

# GitHub
github_repo   = "juarezjunior95/controle-financas"
github_branch = "main"

# Supabase (projeto existente)
supabase_project_id = "rliosrnmqszwfivepxsr"
supabase_url        = "https://rliosrnmqszwfivepxsr.supabase.co"

# Aplicação
frontend_port = 3000
backend_port  = 3001

# =============================================================================
# VARIÁVEIS SENSÍVEIS - NÃO COMMITAR!
# Use variáveis de ambiente ou terraform.tfvars.local
# =============================================================================
#
# vercel_api_token      = "seu-token-vercel"
# vercel_team_id        = "seu-team-id"
# supabase_access_token = "seu-token-supabase"
# supabase_anon_key     = "sua-anon-key"
# database_url          = "postgresql://..."
# clerk_publishable_key = "pk_..."
# clerk_secret_key      = "sk_..."
# api_url               = "https://controle-financas-backend.vercel.app"
#
# =============================================================================
