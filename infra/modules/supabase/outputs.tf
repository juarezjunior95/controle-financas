# =============================================================================
# OUTPUTS DO MÓDULO SUPABASE
# =============================================================================

output "project_id" {
  description = "ID do projeto Supabase"
  value       = var.project_id
}

output "project_url" {
  description = "URL do projeto Supabase"
  value       = var.project_url
}

output "api_url" {
  description = "URL da API REST do Supabase"
  value       = "${var.project_url}/rest/v1"
}

output "graphql_url" {
  description = "URL do GraphQL do Supabase"
  value       = "${var.project_url}/graphql/v1"
}

output "storage_url" {
  description = "URL do Storage do Supabase"
  value       = "${var.project_url}/storage/v1"
}

output "realtime_url" {
  description = "URL do Realtime do Supabase"
  value       = "wss://${var.project_id}.supabase.co/realtime/v1"
}

output "database_host" {
  description = "Host do banco de dados PostgreSQL"
  value       = "db.${var.project_id}.supabase.co"
}

output "connection_string_direct" {
  description = "Connection string direta (porta 5432)"
  value       = "postgresql://postgres:[PASSWORD]@db.${var.project_id}.supabase.co:5432/postgres"
  sensitive   = false
}

output "connection_string_pooler" {
  description = "Connection string com pooler (porta 6543)"
  value       = "postgresql://postgres:[PASSWORD]@db.${var.project_id}.supabase.co:6543/postgres?pgbouncer=true"
  sensitive   = false
}
