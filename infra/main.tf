# =============================================================================
# INFRAESTRUTURA PRINCIPAL - Controle Financas
# =============================================================================

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  # Variáveis de ambiente comuns
  common_env_vars = {
    NODE_ENV = var.environment == "prod" ? "production" : "development"
  }

  # Variáveis de ambiente do Supabase
  supabase_env_vars = {
    DATABASE_URL               = var.database_url
    NEXT_PUBLIC_SUPABASE_URL   = var.supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY = var.supabase_anon_key
  }

  # Variáveis de ambiente do Clerk
  clerk_env_vars = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
    CLERK_SECRET_KEY                  = var.clerk_secret_key
  }
}

# =============================================================================
# MÓDULO VERCEL - BACKEND
# =============================================================================

module "vercel_backend" {
  source = "./modules/vercel"

  project_name    = "${var.project_name}-backend"
  framework       = "other"
  root_directory  = "apps/backend"
  build_command   = "npm run build"
  output_directory = "dist"
  install_command = "npm ci"

  github_repo   = var.github_repo
  github_branch = var.github_branch

  environment_variables = merge(
    local.common_env_vars,
    local.supabase_env_vars,
    local.clerk_env_vars,
    {
      PORT = tostring(var.backend_port)
    }
  )

  environment = var.environment
}

# =============================================================================
# MÓDULO VERCEL - FRONTEND
# =============================================================================

module "vercel_frontend" {
  source = "./modules/vercel"

  project_name    = var.project_name
  framework       = "nextjs"
  root_directory  = "apps/frontend"
  build_command   = "npm run build"
  output_directory = ".next"
  install_command = "npm ci"

  github_repo   = var.github_repo
  github_branch = var.github_branch

  environment_variables = merge(
    local.common_env_vars,
    {
      NEXT_PUBLIC_SUPABASE_URL      = var.supabase_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY = var.supabase_anon_key
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
      NEXT_PUBLIC_API_URL           = module.vercel_backend.project_url
    }
  )

  environment = var.environment

  depends_on = [module.vercel_backend]
}
