# Roadmap MVP - Controle de Finanças Pessoais

> **Documento de Produto** | Product Owner  
> **Data:** Abril 2026  
> **Versão:** 1.0

---

## 1. Visão do Produto

**Objetivo:** Entregar um MVP funcional que permita usuários gerenciarem suas finanças pessoais de forma simples e eficiente, com persistência real de dados e experiência mobile-first.

**Público-alvo:** Trabalhadores CLT, autônomos e estudantes que desejam organizar receitas e despesas.

**Proposta de valor:** Controle financeiro simplificado com visão clara de para onde o dinheiro está indo.

---

## 2. Estado Atual da Aplicação

### ✅ O que está funcionando (End-to-End)

| Funcionalidade | Frontend | Backend | Banco de Dados |
|----------------|----------|---------|----------------|
| Cadastro de usuário | ✅ Formulário | ✅ API + Clerk | ✅ Tabela User |
| Login/Autenticação | ✅ Formulário | ✅ API + Clerk | ✅ Token JWT |
| Recuperação de senha | ✅ Clerk SDK | ✅ Clerk hosted | N/A |
| Health check | N/A | ✅ /api/v1/health | ✅ Conexão DB |
| Dashboard (localStorage) | ✅ Saldo + Transações | ❌ Não persiste | ❌ Não usa |

### 🟡 UI Implementada (Apenas Visual - Sem Persistência)

| Tela | Status | Observação |
|------|--------|------------|
| `/dashboard` | 🟢 Funcional local | Usa localStorage, não sincroniza com backend |
| `/transactions` | 🔴 Mock estático | Dados hardcoded de "Outubro 2023" |
| `/categories` | 🔴 Mock estático | Cards fixos sem interação |
| `/goals` | 🔴 Mock estático | Metas fictícias |
| `/new-transaction` | 🔴 Form sem submit | onSubmit apenas preventDefault |
| `/new-goal` | 🔴 Form sem submit | Não persiste dados |
| `/add-category` | 🟡 Parcial | UI funciona, não salva |

### 🔴 Não Implementado (Backend)

| Recurso | Modelo Prisma | API REST | Service |
|---------|---------------|----------|---------|
| Categorias | ✅ Category | ❌ | ❌ |
| Transações | ✅ Transaction | ❌ | ❌ |
| Metas | ✅ Goal | ❌ | ❌ |

---

## 3. Definição do MVP

### Critérios de Aceite do MVP

Para considerarmos o MVP entregue, o usuário deve conseguir:

1. ✅ Criar conta e fazer login
2. 🔲 Definir saldo inicial (persistido no banco)
3. 🔲 Cadastrar transações (receitas e despesas)
4. 🔲 Ver histórico de transações
5. 🔲 Visualizar resumo financeiro do mês
6. 🔲 Categorizar gastos
7. 🔲 Ver gráfico de gastos por categoria

### Fora do Escopo MVP (v2+)

- Metas financeiras
- Orçamentos por categoria
- Exportação de dados (CSV/PDF)
- Notificações e alertas
- Contas bancárias múltiplas
- Transações recorrentes
- Modo offline com sync

---

## 4. Roadmap de Implementação

### 🚀 Sprint 1: Backend Core (Prioridade Crítica)

**Objetivo:** Criar APIs REST para persistir dados financeiros

| # | User Story | Tarefas Técnicas | Esforço |
|---|------------|------------------|---------|
| 1.1 | Como usuário, quero que minhas transações sejam salvas no banco | Criar `TransactionService` + `TransactionController` | M |
| 1.2 | Como usuário, quero gerenciar minhas categorias | Criar `CategoryService` + `CategoryController` | M |
| 1.3 | Como usuário, quero definir meu saldo inicial | Adicionar campo `initialBalance` no User ou criar Settings | S |

**Endpoints a criar:**

```
POST   /api/v1/transactions      → Criar transação
GET    /api/v1/transactions      → Listar (com filtros: mês, tipo, categoria)
GET    /api/v1/transactions/:id  → Detalhe
PUT    /api/v1/transactions/:id  → Editar
DELETE /api/v1/transactions/:id  → Excluir

POST   /api/v1/categories        → Criar categoria
GET    /api/v1/categories        → Listar categorias do usuário
PUT    /api/v1/categories/:id    → Editar
DELETE /api/v1/categories/:id    → Excluir (se não tiver transações)

GET    /api/v1/dashboard/summary → Resumo: saldo, receitas, despesas do mês
PUT    /api/v1/users/me/settings → Atualizar saldo inicial
```

**Entregável:** APIs testáveis via Postman/Insomnia

---

### 🎨 Sprint 2: Integração Frontend-Backend

**Objetivo:** Conectar telas existentes às APIs reais

| # | User Story | Tarefas Técnicas | Esforço |
|---|------------|------------------|---------|
| 2.1 | Como usuário, quero que o dashboard mostre meus dados reais | Substituir localStorage por chamadas API | M |
| 2.2 | Como usuário, quero adicionar transação e ver na lista | Conectar modal de transação rápida à API | S |
| 2.3 | Como usuário, quero ver meu histórico de transações | Conectar `/transactions` à API com filtros | M |
| 2.4 | Como usuário, quero gerenciar categorias | Conectar `/categories` e `/add-category` à API | M |

**Mudanças no Frontend:**

```typescript
// Criar: apps/frontend/src/lib/api/transactions.ts
export async function getTransactions(month?: number, year?: number) { ... }
export async function createTransaction(data: CreateTransactionDTO) { ... }
export async function deleteTransaction(id: string) { ... }

// Criar: apps/frontend/src/lib/api/categories.ts
export async function getCategories() { ... }
export async function createCategory(data: CreateCategoryDTO) { ... }

// Criar: apps/frontend/src/lib/api/dashboard.ts
export async function getDashboardSummary(month: number, year: number) { ... }
```

**Entregável:** Fluxo completo de adicionar transação → ver no dashboard → ver na lista

---

### 🔧 Sprint 3: Polish & Deploy

**Objetivo:** Refinamentos de UX e deploy estável

| # | User Story | Tarefas Técnicas | Esforço |
|---|------------|------------------|---------|
| 3.1 | Como usuário, quero feedback visual ao salvar | Loading states, toasts de sucesso/erro | S |
| 3.2 | Como usuário, quero editar/excluir transações | Implementar edit/delete na lista | M |
| 3.3 | Como usuário, quero filtrar transações por período | Implementar filtros na página /transactions | S |
| 3.4 | Como PO, quero o app em produção estável | Resolver issues de deploy Vercel + Supabase | M |

**Entregável:** MVP em produção funcional

---

## 5. Priorização MoSCoW

### Must Have (MVP)
- [x] Autenticação (login/cadastro)
- [ ] CRUD de transações
- [ ] Listagem de transações com filtro por mês
- [ ] Dashboard com dados reais
- [ ] Categorias padrão do sistema

### Should Have (MVP+)
- [ ] CRUD de categorias customizadas
- [ ] Edição de saldo inicial
- [ ] Gráfico de pizza por categoria

### Could Have (v1.1)
- [ ] Busca de transações
- [ ] Ordenação da lista
- [ ] Dark/Light theme toggle

### Won't Have (v2+)
- [ ] Metas financeiras
- [ ] Orçamentos
- [ ] Múltiplas contas
- [ ] Exportação de dados
- [ ] Transações recorrentes

---

## 6. Métricas de Sucesso do MVP

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Cadastros concluídos | 10+ usuários teste | Clerk Dashboard |
| Transações criadas | 50+ transações | Query no Supabase |
| Retenção D7 | 30% voltam após 7 dias | Analytics |
| Bugs críticos | 0 em produção | Sentry/Logs |

---

## 7. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Supabase indisponível | Alto | Média | Monitorar status, ter fallback de leitura |
| Clerk rate limits | Médio | Baixa | Cache de sessão no frontend |
| Performance com muitas transações | Médio | Média | Paginação desde o início |
| Perda de dados localStorage | Alto | Alta | **Migrar para API é prioridade** |

---

## 8. Cronograma Sugerido

```
Semana 1-2: Sprint 1 (Backend Core)
├── Dia 1-2: TransactionService + Controller
├── Dia 3-4: CategoryService + Controller  
├── Dia 5: Dashboard Summary endpoint
└── Dia 6-7: Testes e documentação API

Semana 3-4: Sprint 2 (Integração)
├── Dia 1-3: Dashboard conectado à API
├── Dia 4-5: Página de transações conectada
├── Dia 6-7: Categorias conectadas

Semana 5: Sprint 3 (Polish)
├── Dia 1-2: Loading states e error handling
├── Dia 3-4: Edit/Delete de transações
└── Dia 5: Deploy final e smoke tests
```

---

## 9. Próximos Passos Imediatos

### Para Desenvolvedores

1. **Criar branch `feature/transaction-api`**
2. Implementar `TransactionService` baseado no modelo Prisma existente
3. Criar rotas REST em `apps/backend/src/index.ts`
4. Testar com Postman antes de integrar frontend

### Para Product Owner

1. Validar priorização com stakeholders
2. Definir categorias padrão do sistema
3. Preparar dados de teste para demo

---

## 10. Anexo: Estrutura de Dados

### Transaction (já no Prisma)
```prisma
model Transaction {
  id          String   @id @default(uuid())
  type        String   // "income" | "expense"
  amount      Float
  description String?
  occurredOn  DateTime
  categoryId  String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Category (já no Prisma)
```prisma
model Category {
  id       String  @id @default(uuid())
  name     String
  icon     String?
  color    String?
  isSystem Boolean @default(false)
  userId   String
}
```

### Categorias Padrão Sugeridas
| Nome | Ícone | Cor | Tipo |
|------|-------|-----|------|
| Salário | payments | #69f0ae | Receita |
| Freelance | work | #ffd740 | Receita |
| Alimentação | restaurant | #b0c6ff | Despesa |
| Transporte | directions_car | #ffb59b | Despesa |
| Moradia | home | #a1b4eb | Despesa |
| Saúde | medical_services | #ff8a80 | Despesa |
| Lazer | sports_esports | #b388ff | Despesa |
| Estudos | school | #82b1ff | Despesa |
| Outros | more_horiz | #90a4ae | Ambos |

---

**Documento mantido por:** Product Owner  
**Última atualização:** Abril 2026
