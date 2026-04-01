# =============================================================================
# OUTPUTS DO MÓDULO VERCEL
# =============================================================================

output "project_id" {
  description = "ID do projeto no Vercel"
  value       = vercel_project.this.id
}

output "project_name" {
  description = "Nome do projeto no Vercel"
  value       = vercel_project.this.name
}

output "project_url" {
  description = "URL padrão do projeto"
  value       = "https://${vercel_project.this.name}.vercel.app"
}

output "domains" {
  description = "Lista de domínios do projeto"
  value       = var.custom_domain != null ? [var.custom_domain, "${vercel_project.this.name}.vercel.app"] : ["${vercel_project.this.name}.vercel.app"]
}
