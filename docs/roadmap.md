# Roadmap — Controle Financas

**Data da análise:** 24 de Março de 2026  
**Versão alvo:** v1.0

---

## Resumo Executivo

- **Frontend:** UI completa com páginas estáticas (mockups visuais), mas **sem integração com API**
- **Backend:** Apenas autenticação e perfil implementados; **faltam endpoints de lançamentos, categorias, metas e dashboard**
- **Progresso geral:** ~25% do MVP funcional
- **Bloqueador principal:** Backend incompleto impede qualquer fluxo real de dados
- **Estimativa para MVP:** 3-4 semanas com 1 dev full-time

---

## 1. Inventário de Funcionalidades

| ID | Funcionalidade | Especificado | Frontend | Backend | Status |
|----|----------------|:------------:|:--------:|:-------:|:------:|
| RF-01 | Autenticação (registro/login/logout) | ✅ | ✅ | ✅ | ✅ Completo |
| RF-02 | CRUD Lançamentos | ✅ | 🔶 UI only | ❌ | 🔶 Parcial |
| RF-03 | Filtros (mês/tipo) | ✅ | 🔶 UI only | ❌ | 🔶 Parcial |
| RF-04 | CRUD Categorias | ✅ | 🔶 UI only | ❌ | 🔶 Parcial |
| RF-05 | Dashboard (totais/gráficos) | ✅ | 🔶 UI only | ❌ | 🔶 Parcial |
| RF-06 | CRUD Metas | ✅ | 🔶 UI only | ❌ | 🔶 Parcial |
| RF-07 | Perfil usuário | ✅ | ❌ | 🔶 Parcial | 🔶 Parcial |

### Legenda
- ✅ Completo e funcional
- 🔶 Parcial (ver detalhes abaixo)
- ❌ Não implementado
- 🚧 Em desenvolvimento

---

## 2. Gap Analysis

### 2.1 Funcionalidades Faltantes

#### Backend — Módulos Inexistentes

| Módulo | O que falta | Dependências | Impacto |
|--------|-------------|--------------|---------|
| **Transactions** | Service + Controller + Rotas CRUD | Prisma schema (existe) | **Crítico** — sem isso não há app |
| **Categories** | Service + Controller + Rotas CRUD | Prisma schema (existe) | **Crítico** — lançamentos dependem |
| **Goals** | Service + Controller + Rotas CRUD | Prisma schema (existe) | **Alto** — feature core do PRD |
| **Dashboard** | Endpoint de agregação (totais mês) | Transactions | **Alto** — valor principal da home |

#### Frontend — Integrações Faltantes

| Página | O que falta | Dependências |
|--------|-------------|--------------|
| `/transactions` | Fetch de dados reais, submit de form, delete | Backend Transactions |
| `/new-transaction` | Integração com API POST | Backend Transactions + Categories |
| `/categories` | Fetch de dados reais, CRUD | Backend Categories |
| `/add-category` | Integração com API POST | Backend Categories |
| `/goals` | Fetch de dados reais, CRUD | Backend Goals |
| `/new-goal` | Integração com API POST | Backend Goals |
| `/dashboard` | Fetch de dados reais (totais, gráficos) | Backend Dashboard |
| `/profile` | Página não existe | Backend Profile update |

### 2.2 Débitos Técnicos

| Área | Problema | Risco |
|------|----------|-------|
| Testes | Arquivos de teste existem mas pasta `__tests__` não encontrada no backend atual | Médio |
| Validação | Endpoints sem validação de input (Zod/Joi) | Alto |
| Error Handling | Frontend não trata erros de API | Médio |
| Loading States | Páginas não mostram skeleton/loading | Baixo |
| Types | Tipos compartilhados frontend/backend não existem | Médio |

### 2.3 Melhorias de UX Necessárias

| Fluxo | Problema | Prioridade |
|-------|----------|------------|
| Novo lançamento | Form não valida campos obrigatórios | Alta |
| Listagem | Não há estado vazio ("Nenhum lançamento") | Média |
| Dashboard | Gráfico é SVG estático, não reflete dados | Alta |
| Feedback | Não há toast/notificação de sucesso/erro | Média |
| Mobile | Bottom nav não destaca página atual | Baixa |

---

## 3. Roadmap Priorizado

### Critérios de Priorização

| Prioridade | Valor | Esforço | Ação |
|------------|-------|---------|------|
| **P0** | Alto | Qualquer | Fazer agora |
| **P1** | Alto | Baixo/Médio | Próximo sprint |
| **P2** | Médio | Baixo | Backlog |
| **P3** | Baixo | Alto | Avaliar |

### Estimativa de Esforço (T-shirt)

- **XS** (< 2h): Fix pontual
- **S** (2-4h): Componente simples
- **M** (4-8h): Feature completa simples
- **L** (1-2 dias): Feature complexa
- **XL** (3-5 dias): Módulo completo

---

## AGORA (Sprint 1 — próximas 2 semanas)

| # | Entrega | Valor | Esforço | Dependências | Stack |
|---|---------|:-----:|:-------:|--------------|:-----:|
| 1 | **Backend: CRUD Categories** | Alto | M | Prisma schema | Backend |
| 2 | **Backend: CRUD Transactions** | Alto | L | Categories | Backend |
| 3 | **Backend: Dashboard endpoint** | Alto | M | Transactions | Backend |
| 4 | **Frontend: Integrar /categories** | Alto | M | Backend Categories | Frontend |
| 5 | **Frontend: Integrar /transactions** | Alto | L | Backend Transactions | Frontend |
| 6 | **Frontend: Integrar /dashboard** | Alto | M | Backend Dashboard | Frontend |

**Meta do Sprint 1:** Fluxo completo de lançamentos funcionando end-to-end.

---

## PRÓXIMO (Sprint 2 — semanas 3-4)

| # | Entrega | Valor | Esforço | Dependências | Stack |
|---|---------|:-----:|:-------:|--------------|:-----:|
| 7 | **Backend: CRUD Goals** | Alto | M | — | Backend |
| 8 | **Frontend: Integrar /goals** | Alto | M | Backend Goals | Frontend |
| 9 | **Frontend: Página de Perfil** | Médio | S | Backend Profile | Full |
| 10 | **Validação de inputs (Zod)** | Médio | M | — | Backend |
| 11 | **Estados de loading/empty** | Médio | S | — | Frontend |
| 12 | **Toast notifications** | Médio | S | — | Frontend |

**Meta do Sprint 2:** MVP completo com todas as features do PRD v1.

---

## DEPOIS (Backlog v1.1+)

| # | Entrega | Valor | Esforço | Notas |
|---|---------|:-----:|:-------:|-------|
| 13 | Recuperação de senha | Médio | M | Clerk já suporta |
| 14 | Export CSV | Médio | S | Endpoint + botão |
| 15 | Gráficos dinâmicos (Chart.js) | Médio | M | Substituir SVG estático |
| 16 | Testes E2E (Playwright) | Médio | L | Cobertura de fluxos críticos |
| 17 | PWA / Offline parcial | Baixo | XL | v2 |
| 18 | Recorrência de lançamentos | Médio | L | v2 |
| 19 | Orçamento por categoria | Médio | L | v2 |

---

## FORA DE ESCOPO v1

- Open Finance / importação bancária
- Multi-moeda e multi-idioma
- Modo colaborativo / família
- App nativo (React Native)
- Notificações push

---

## 4. Plano de Ação Imediato

### Item 1: Backend CRUD Categories

**Objetivo:** Endpoint completo para gerenciar categorias do usuário.

**Critérios de Aceite:**
- [ ] GET /api/v1/categories — lista categorias do usuário autenticado
- [ ] POST /api/v1/categories — cria categoria (name, icon, color)
- [ ] PUT /api/v1/categories/:id — atualiza categoria
- [ ] DELETE /api/v1/categories/:id — remove (bloqueia se houver transações)
- [ ] Seed de categorias padrão no primeiro acesso

**Tarefas Técnicas:**
1. Backend: Criar `modules/categories/category.service.ts`
2. Backend: Criar `modules/categories/category.controller.ts`
3. Backend: Registrar rotas em `index.ts`
4. Testes: Cobrir CRUD e regra de bloqueio

**Estimativa:** M (~6h)

---

### Item 2: Backend CRUD Transactions

**Objetivo:** Endpoint completo para lançamentos (receitas/despesas).

**Critérios de Aceite:**
- [ ] GET /api/v1/transactions?month=&year=&type= — lista com filtros
- [ ] POST /api/v1/transactions — cria lançamento
- [ ] PUT /api/v1/transactions/:id — atualiza
- [ ] DELETE /api/v1/transactions/:id — remove
- [ ] Validação: valor >= 0, categoria válida, data obrigatória

**Tarefas Técnicas:**
1. Backend: Criar `modules/transactions/transaction.service.ts`
2. Backend: Criar `modules/transactions/transaction.controller.ts`
3. Backend: Registrar rotas protegidas
4. Testes: Cobrir CRUD e validações

**Estimativa:** L (~12h)

---

### Item 3: Backend Dashboard Endpoint

**Objetivo:** Endpoint de agregação para totais do mês.

**Critérios de Aceite:**
- [ ] GET /api/v1/dashboard?month=&year= retorna:
  - totalIncome (soma receitas)
  - totalExpense (soma despesas)
  - balance (income - expense)
  - byCategory (array com totais por categoria)

**Tarefas Técnicas:**
1. Backend: Criar `modules/dashboard/dashboard.service.ts`
2. Backend: Usar Prisma aggregate/groupBy
3. Testes: Validar cálculos

**Estimativa:** M (~5h)

---

### Item 4: Frontend Integrar Categories

**Objetivo:** Página `/categories` consumindo dados reais.

**Critérios de Aceite:**
- [ ] Lista categorias do backend
- [ ] Botão "Adicionar" abre form e salva via API
- [ ] Editar/excluir funcional
- [ ] Loading state enquanto carrega
- [ ] Empty state se não houver categorias

**Tarefas Técnicas:**
1. Frontend: Criar hook `useCategories` com React Query ou SWR
2. Frontend: Conectar componentes ao hook
3. Frontend: Adicionar estados de loading/empty/error

**Estimativa:** M (~6h)

---

### Item 5: Frontend Integrar Transactions

**Objetivo:** Página `/transactions` consumindo dados reais.

**Critérios de Aceite:**
- [ ] Lista transações do mês atual
- [ ] Filtros funcionais (mês, tipo, categoria)
- [ ] Form de novo lançamento salva via API
- [ ] Editar/excluir funcional
- [ ] Totais do header calculados

**Tarefas Técnicas:**
1. Frontend: Criar hook `useTransactions`
2. Frontend: Conectar form `/new-transaction` à API
3. Frontend: Implementar filtros com query params
4. Frontend: Adicionar estados de loading/empty

**Estimativa:** L (~10h)

---

## 5. Métricas de Progresso

| Métrica | Atual | Meta Sprint 1 | Meta MVP |
|---------|:-----:|:-------------:|:--------:|
| Endpoints implementados | 4 | 12 | 15 |
| Páginas integradas | 1 | 4 | 7 |
| Cobertura de testes | 0% | 40% | 60% |
| Fluxos E2E funcionais | 0 | 2 | 5 |

### Fluxos E2E para validar MVP

1. [ ] Usuário cria conta → vê dashboard vazio → cria categoria → cria lançamento → vê no dashboard
2. [ ] Usuário lista transações → filtra por mês → edita → exclui
3. [ ] Usuário cria meta → atualiza progresso → vê % atualizado
4. [ ] Usuário acessa perfil → altera nome → persiste
5. [ ] Usuário faz logout → tenta acessar rota protegida → redireciona para login

---

## Anexo: Estrutura de Arquivos Sugerida

```
apps/backend/src/modules/
├── auth/           ✅ Existe
├── clients/        ✅ Existe (renomear para users?)
├── health/         ✅ Existe
├── categories/     ❌ Criar
│   ├── category.service.ts
│   ├── category.controller.ts
│   └── category.routes.ts
├── transactions/   ❌ Criar
│   ├── transaction.service.ts
│   ├── transaction.controller.ts
│   └── transaction.routes.ts
├── goals/          ❌ Criar
│   ├── goal.service.ts
│   ├── goal.controller.ts
│   └── goal.routes.ts
└── dashboard/      ❌ Criar
    ├── dashboard.service.ts
    └── dashboard.controller.ts
```

---

*Documento gerado automaticamente. Atualizar após cada sprint.*
