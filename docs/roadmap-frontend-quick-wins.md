# Roadmap: Quick Wins Frontend

Implementações rápidas que podem ser feitas **apenas no frontend**, usando `localStorage` para persistência temporária (até o backend/Supabase estar funcionando).

---

## 🎯 Prioridade 1: Funcionalidades Essenciais (1-2h cada)

### 1. Editar Saldo Inicial
**Esforço:** 30min | **Impacto:** Alto

- Adicionar botão de editar no card "Saldo Atual"
- Modal para inserir saldo inicial
- Salvar em `localStorage`
- Saldo = Saldo Inicial + Receitas - Despesas

### 2. Seletor de Mês Funcional
**Esforço:** 1h | **Impacto:** Alto

- Transformar o select de mês em componente funcional
- Filtrar transações por mês selecionado
- Atualizar totais dinamicamente

### 3. Adicionar Transação Rápida
**Esforço:** 1h | **Impacto:** Alto

- Botão "+" flutuante no dashboard
- Modal rápido: valor, tipo (receita/despesa), categoria
- Salvar em `localStorage`
- Atualizar totais em tempo real

---

## 🎯 Prioridade 2: Melhorias de UX (30min-1h cada)

### 4. Formatação de Moeda
**Esforço:** 30min | **Impacto:** Médio

- Criar helper `formatCurrency(value)`
- Aplicar em todos os valores monetários
- Suporte a valores negativos

### 5. Animações nos Cards
**Esforço:** 30min | **Impacto:** Baixo

- Contador animado ao carregar valores
- Transição suave ao atualizar

### 6. Tema Claro/Escuro
**Esforço:** 1h | **Impacto:** Médio

- Toggle no header
- Salvar preferência em `localStorage`
- CSS variables para cores

---

## 🎯 Prioridade 3: Dados Locais (1-2h cada)

### 7. CRUD de Transações Local
**Esforço:** 2h | **Impacto:** Alto

- Listar transações do `localStorage`
- Editar transação existente
- Excluir com confirmação
- Filtros funcionais

### 8. CRUD de Categorias Local
**Esforço:** 1h | **Impacto:** Médio

- Categorias padrão pré-definidas
- Adicionar categoria personalizada
- Editar nome/ícone
- Excluir (se não tiver transações)

### 9. Metas com Progresso Real
**Esforço:** 1.5h | **Impacto:** Alto

- Criar/editar meta
- Atualizar valor guardado manualmente
- Calcular % de progresso
- Marcar como concluída

---

## 🎯 Prioridade 4: Visualizações (1-2h cada)

### 10. Gráfico de Pizza Dinâmico
**Esforço:** 1.5h | **Impacto:** Alto

- Calcular % por categoria das transações
- Atualizar SVG dinamicamente
- Ou usar biblioteca (Chart.js/Recharts)

### 11. Histórico de Saldo (Gráfico de Linha)
**Esforço:** 2h | **Impacto:** Médio

- Mostrar evolução do saldo nos últimos 6 meses
- Gráfico de linha simples

### 12. Exportar para CSV
**Esforço:** 1h | **Impacto:** Médio

- Botão "Exportar" funcional
- Gerar CSV das transações
- Download automático

---

## 📋 Estrutura de Dados (localStorage)

```typescript
// localStorage keys
const STORAGE_KEYS = {
  INITIAL_BALANCE: 'vault_initial_balance',
  TRANSACTIONS: 'vault_transactions',
  CATEGORIES: 'vault_categories',
  GOALS: 'vault_goals',
  SETTINGS: 'vault_settings',
};

// Tipos
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate?: string;
  status: 'active' | 'completed';
}

interface Settings {
  initialBalance: number;
  theme: 'dark' | 'light';
  currency: 'BRL';
}
```

---

## 🚀 Sugestão de Ordem de Implementação

| # | Tarefa | Tempo | Dependência |
|---|--------|-------|-------------|
| 1 | Formatação de moeda | 30min | - |
| 2 | Editar saldo inicial | 30min | #1 |
| 3 | Estrutura localStorage | 30min | - |
| 4 | Adicionar transação rápida | 1h | #1, #3 |
| 5 | Seletor de mês funcional | 1h | #3, #4 |
| 6 | Gráfico de pizza dinâmico | 1.5h | #4 |
| 7 | CRUD transações completo | 2h | #4 |
| 8 | Metas com progresso | 1.5h | #3 |

**Total estimado:** ~8h para ter um MVP funcional local

---

## 💡 Dica

Quando o backend/Supabase estiver funcionando, será fácil migrar:
1. Substituir `localStorage` por chamadas à API
2. Sincronizar dados locais com o servidor
3. Manter localStorage como cache/offline
