# =============================================================================
# VARIÁVEIS DO MÓDULO SUPABASE
# =============================================================================

variable "project_id" {
  description = "ID do projeto Supabase"
  type        = string
}

variable "project_url" {
  description = "URL do projeto Supabase"
  type        = string
}

variable "region" {
  description = "Região do projeto Supabase"
  type        = string
  default     = "sa-east-1" # São Paulo

  validation {
    condition = contains([
      "us-east-1", "us-west-1", "us-west-2",
      "eu-west-1", "eu-west-2", "eu-central-1",
      "ap-southeast-1", "ap-southeast-2", "ap-northeast-1",
      "sa-east-1"
    ], var.region)
    error_message = "Região Supabase inválida."
  }
}

variable "db_password" {
  description = "Senha do banco de dados PostgreSQL"
  type        = string
  sensitive   = true
}

variable "anon_key" {
  description = "Chave anônima do Supabase (para acesso público)"
  type        = string
  sensitive   = true
}

variable "service_role_key" {
  description = "Chave de service role do Supabase (para acesso administrativo)"
  type        = string
  sensitive   = true
  default     = ""
}
