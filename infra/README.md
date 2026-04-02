# Infraestrutura como Código (IaC)

Este diretório contém a configuração Terraform para provisionar e gerenciar a infraestrutura do projeto **Controle Financas**.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  juarezjunior95/controle-financas                       │    │
│  │  ├── apps/frontend (Next.js)                            │    │
│  │  └── apps/backend (Express/Fastify)                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │  controle-financas   │    │  controle-financas   │          │
│  │  (Frontend)          │───▶│  -backend            │          │
│  │  Next.js SSR         │    │  API REST            │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                      │   │
│  │  ├── users                                                │   │
│  │  ├── categories                                           │   │
│  │  ├── transactions                                         │   │
│  │  └── goals                                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura de Arquivos

```
infra/
├── terraform.tf          # Configuração de providers e versões
├── variables.tf          # Definição de variáveis
├── main.tf               # Recursos principais (módulos)
├── outputs.tf            # Outputs da infraestrutura
├── terraform.tfvars.example  # Exemplo de variáveis sensíveis
├── .gitignore            # Arquivos ignorados pelo Git
├── environments/
│   ├── dev.tfvars        # Variáveis de desenvolvimento
│   └── prod.tfvars       # Variáveis de produção
└── modules/
    ├── vercel/           # Módulo para projetos Vercel
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── supabase/         # Módulo para referência Supabase
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## Pré-requisitos

1. **Terraform CLI** (>= 1.5.0)
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   sudo apt-get install terraform
   
   # Verificar instalação
   terraform version
   ```

2. **Contas e Tokens**
   - Vercel: [Criar token](https://vercel.com/account/tokens)
   - Supabase: [Criar token](https://supabase.com/dashboard/account/tokens)

## Configuração

### 1. Criar arquivo de variáveis sensíveis

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
```

### 2. Preencher as variáveis em `terraform.tfvars`

```hcl
vercel_api_token      = "seu-token-vercel"
supabase_access_token = "sbp_xxxxx"
supabase_anon_key     = "eyJxxxxx"
database_url          = "postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres"
```

### 3. Inicializar o Terraform

```bash
terraform init
```

## Uso

### Ambiente de Desenvolvimento

```bash
# Planejar mudanças
terraform plan -var-file="environments/dev.tfvars"

# Aplicar mudanças
terraform apply -var-file="environments/dev.tfvars"
```

### Ambiente de Produção

```bash
# Planejar mudanças
terraform plan -var-file="environments/prod.tfvars"

# Aplicar mudanças
terraform apply -var-file="environments/prod.tfvars"
```

### Comandos Úteis

```bash
# Ver estado atual
terraform show

# Listar recursos
terraform state list

# Ver outputs
terraform output

# Destruir infraestrutura (CUIDADO!)
terraform destroy -var-file="environments/dev.tfvars"

# Formatar arquivos
terraform fmt -recursive

# Validar configuração
terraform validate
```

## Outputs

Após aplicar o Terraform, você terá acesso aos seguintes outputs:

| Output | Descrição |
|--------|-----------|
| `backend_project_id` | ID do projeto backend no Vercel |
| `backend_project_url` | URL do backend |
| `frontend_project_id` | ID do projeto frontend no Vercel |
| `frontend_project_url` | URL do frontend |
| `github_secrets_summary` | Resumo dos secrets para GitHub Actions |

## Integração com GitHub Actions

O Terraform gera os IDs necessários para configurar os secrets no GitHub:

```bash
# Ver secrets necessários
terraform output github_secrets_summary
```

Configure os secrets em:
`https://github.com/juarezjunior95/controle-financas/settings/secrets/actions`

## Boas Práticas

1. **Nunca commitar** `terraform.tfvars` ou arquivos `.tfstate`
2. **Sempre revisar** o `terraform plan` antes de aplicar
3. **Usar workspaces** para múltiplos ambientes (alternativa aos tfvars)
4. **Manter state remoto** em produção (Terraform Cloud, S3, etc.)
