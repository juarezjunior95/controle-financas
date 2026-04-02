# =============================================================================
# VARIÁVEIS GERAIS
# =============================================================================

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "controle-financas"
}

variable "environment" {
  description = "Ambiente de deploy (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser: dev, staging ou prod."
  }
}

# =============================================================================
# VERCEL
# =============================================================================

variable "vercel_api_token" {
  description = "Token de API do Vercel"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "ID do time/organização no Vercel (opcional para conta pessoal)"
  type        = string
  default     = null
}

variable "github_repo" {
  description = "Repositório GitHub no formato owner/repo"
  type        = string
  default     = "juarezjunior95/controle-financas"
}

variable "github_branch" {
  description = "Branch principal para deploy de produção"
  type        = string
  default     = "main"
}

# =============================================================================
# SUPABASE
# =============================================================================

variable "supabase_access_token" {
  description = "Token de acesso do Supabase"
  type        = string
  sensitive   = true
}

variable "supabase_project_id" {
  description = "ID do projeto Supabase existente"
  type        = string
  default     = "rliosrnmqszwfivepxsr"
}

variable "supabase_url" {
  description = "URL do projeto Supabase"
  type        = string
  default     = "https://rliosrnmqszwfivepxsr.supabase.co"
}

variable "supabase_anon_key" {
  description = "Chave anônima do Supabase"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "Connection string do PostgreSQL (Supabase)"
  type        = string
  sensitive   = true
}

# =============================================================================
# CLERK (Autenticação)
# =============================================================================

variable "clerk_publishable_key" {
  description = "Chave pública do Clerk"
  type        = string
  default     = ""
}

variable "clerk_secret_key" {
  description = "Chave secreta do Clerk"
  type        = string
  sensitive   = true
  default     = ""
}

# =============================================================================
# APLICAÇÃO
# =============================================================================

variable "frontend_port" {
  description = "Porta do frontend (para desenvolvimento local)"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Porta do backend (para desenvolvimento local)"
  type        = number
  default     = 3001
}

variable "api_url" {
  description = "URL da API backend"
  type        = string
  default     = "http://localhost:3001"
}
