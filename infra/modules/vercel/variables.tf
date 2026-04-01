# =============================================================================
# VARIÁVEIS DO MÓDULO VERCEL
# =============================================================================

variable "project_name" {
  description = "Nome do projeto no Vercel"
  type        = string
}

variable "framework" {
  description = "Framework do projeto (nextjs, other, etc.)"
  type        = string
  default     = "nextjs"

  validation {
    condition = contains([
      "nextjs", "gatsby", "remix", "astro", "nuxtjs", "vite",
      "create-react-app", "angular", "svelte", "other"
    ], var.framework)
    error_message = "Framework inválido."
  }
}

variable "github_repo" {
  description = "Repositório GitHub no formato owner/repo"
  type        = string
}

variable "github_branch" {
  description = "Branch para deploy de produção"
  type        = string
  default     = "main"
}

variable "root_directory" {
  description = "Diretório raiz do projeto dentro do monorepo"
  type        = string
  default     = null
}

variable "build_command" {
  description = "Comando de build"
  type        = string
  default     = null
}

variable "output_directory" {
  description = "Diretório de output do build"
  type        = string
  default     = null
}

variable "install_command" {
  description = "Comando de instalação de dependências"
  type        = string
  default     = "npm ci"
}

variable "ignore_command" {
  description = "Comando para ignorar builds (retorna exit 0 para ignorar)"
  type        = string
  default     = null
}

variable "serverless_region" {
  description = "Região das funções serverless"
  type        = string
  default     = "gru1" # São Paulo

  validation {
    condition = contains([
      "arn1", "bom1", "cdg1", "cle1", "cpt1", "dub1", "fra1",
      "gru1", "hkg1", "hnd1", "iad1", "icn1", "kix1", "lhr1",
      "pdx1", "sfo1", "sin1", "syd1"
    ], var.serverless_region)
    error_message = "Região inválida."
  }
}

variable "environment_variables" {
  description = "Variáveis de ambiente do projeto"
  type        = map(string)
  default     = {}
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "custom_domain" {
  description = "Domínio personalizado (opcional)"
  type        = string
  default     = null
}
