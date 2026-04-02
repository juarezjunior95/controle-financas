# Prompt: Investigador de Funcionalidades e Criador de Roadmap

Use este prompt em qualquer IA (Claude, ChatGPT, Cursor, etc.) para analisar o estado atual da aplicação e gerar um roadmap priorizado.

---

## Prompt

```
Atue como: Product Owner Sênior e Arquiteto de Software.

## Objetivo

Realizar uma análise completa do estado atual da aplicação "Controle Financas" comparando:
1. O que foi especificado nos documentos de requisitos
2. O que está efetivamente implementado no código
3. Gerar um roadmap priorizado com estimativa de esforço

---

## Contexto do Projeto

### Documentos de Referência (fonte de verdade)

Leia e analise os seguintes arquivos:
- @docs/prd.md — Requisitos do produto, funcionalidades e escopo
- @docs/spec_req.md — Requisitos funcionais e não funcionais detalhados
- @docs/spec_ui.md — Especificação de interfaces
- @docs/spec_tech.md — Arquitetura e stack técnica
- @docs/modelo_dados.md — Modelo de dados (entidades e relacionamentos)

### Código Atual

Analise a estrutura de código em:
- @apps/frontend/src/ — Páginas, componentes e lógica do frontend
- @apps/backend/src/ — Controllers, services e rotas da API

---

## Tarefa 1: Inventário de Funcionalidades

Crie uma tabela comparativa no formato:

| ID | Funcionalidade | Especificado | Frontend | Backend | Status |
|----|----------------|--------------|----------|---------|--------|
| RF-01 | Autenticação (registro/login/logout) | ✅ | ? | ? | ? |
| RF-02 | CRUD Lançamentos | ✅ | ? | ? | ? |
| RF-03 | Filtros (mês/tipo) | ✅ | ? | ? | ? |
| RF-04 | CRUD Categorias | ✅ | ? | ? | ? |
| RF-05 | Dashboard (totais/gráficos) | ✅ | ? | ? | ? |
| RF-06 | CRUD Metas | ✅ | ? | ? | ? |
| RF-07 | Perfil usuário | ✅ | ? | ? | ? |

Para cada funcionalidade, verifique:
- **Frontend**: Existe página/componente? Está funcional ou é placeholder?
- **Backend**: Existe endpoint/service? Está conectado ao banco?
- **Status**: 
  - ✅ Completo
  - 🔶 Parcial (especificar o que falta)
  - ❌ Não implementado
  - 🚧 Em desenvolvimento

---

## Tarefa 2: Gap Analysis

Liste detalhadamente:

### 2.1 Funcionalidades Faltantes
Para cada item não implementado ou parcial:
- O que exatamente está faltando
- Dependências (precisa de algo antes?)
- Impacto no usuário se não tiver

### 2.2 Débitos Técnicos
- Código sem testes
- Endpoints sem validação
- Componentes sem tratamento de erro
- Problemas de segurança identificados

### 2.3 Melhorias de UX
- Fluxos incompletos
- Feedback visual faltante
- Estados de loading/erro não tratados

---

## Tarefa 3: Roadmap Priorizado

Gere um roadmap usando a estrutura **Agora / Próximo / Depois**:

### Critérios de Priorização

Use a matriz **Valor x Esforço**:

| Prioridade | Valor para Usuário | Esforço | Ação |
|------------|-------------------|---------|------|
| P0 - Crítico | Alto | Qualquer | Fazer agora |
| P1 - Alto | Alto | Baixo/Médio | Próximo sprint |
| P2 - Médio | Médio | Baixo | Backlog priorizado |
| P3 - Baixo | Baixo | Alto | Avaliar necessidade |

### Estimativa de Esforço

Use T-shirt sizing:
- **XS** (< 2h): Ajuste simples, fix pontual
- **S** (2-4h): Componente pequeno, endpoint simples
- **M** (4-8h): Feature completa simples, CRUD básico
- **L** (1-2 dias): Feature complexa, múltiplos componentes
- **XL** (3-5 dias): Módulo completo, integração complexa

### Formato do Roadmap

```markdown
## AGORA (Sprint atual / próximas 2 semanas)

| # | Entrega | Valor | Esforço | Dependências | Responsável |
|---|---------|-------|---------|--------------|-------------|
| 1 | [Descrição] | [Alto/Médio/Baixo] | [XS/S/M/L/XL] | [Lista] | [Backend/Frontend/Full] |

## PRÓXIMO (2-6 semanas)

| # | Entrega | Valor | Esforço | Dependências | Responsável |
|---|---------|-------|---------|--------------|-------------|

## DEPOIS (Backlog estratégico)

| # | Entrega | Valor | Esforço | Notas |
|---|---------|-------|---------|-------|

## FORA DE ESCOPO v1

- [Lista do que não será feito nesta versão]
```

---

## Tarefa 4: Plano de Ação Imediato

Para os 3-5 itens mais prioritários, detalhe:

### Item: [Nome da funcionalidade]

**Objetivo:** [O que será entregue]

**Critérios de Aceite:**
- [ ] [Critério 1]
- [ ] [Critério 2]

**Tarefas Técnicas:**
1. Backend: [O que fazer]
2. Frontend: [O que fazer]
3. Testes: [O que cobrir]

**Estimativa:** [XS/S/M/L/XL] (~Xh)

**Riscos:** [Se houver]

---

## Formato de Saída

Gere a resposta em Markdown estruturado, pronto para ser salvo em `docs/roadmap.md`.

Inclua:
1. Data da análise
2. Resumo executivo (3-5 bullets)
3. Tabela de inventário
4. Gap analysis
5. Roadmap completo
6. Plano de ação imediato
7. Métricas de progresso sugeridas

---

## Restrições

- Não invente funcionalidades que não estão nos requisitos
- Seja realista nas estimativas (melhor superestimar)
- Priorize entrega de valor ao usuário sobre perfeição técnica
- Considere que a equipe é pequena (1-2 devs)
```

---

## Como Usar

1. Abra uma nova conversa no Cursor/Claude/ChatGPT
2. Cole o prompt acima
3. Anexe ou referencie os arquivos mencionados (@docs/prd.md, etc.)
4. Execute e revise o resultado
5. Salve o roadmap gerado em `docs/roadmap.md`

---

## Variações do Prompt

### Versão Rápida (só inventário)
```
Analise @apps/frontend/src e @apps/backend/src comparando com @docs/spec_req.md.
Liste em tabela: Funcionalidade | Status Frontend | Status Backend | % Completo
```

### Versão Técnica (débitos)
```
Atue como Tech Lead. Analise o código em @apps/ e liste:
1. Endpoints sem testes
2. Componentes sem tratamento de erro
3. Código duplicado
4. Problemas de segurança
Priorize por risco.
```

### Versão UX (fluxos)
```
Atue como UX Designer. Compare @docs/spec_ui.md com @apps/frontend/src.
Liste fluxos incompletos, estados faltantes e melhorias de usabilidade.
```
