# Definição de Requisitos do Produto (PRD)

## Descrição do produto

**Problema** Estudantes da PUC Minas têm dificuldade em acompanhar receitas e despesas de forma contínua e simples; o controle disperso em planilhas e anotações aumenta estresse e atrasos na tomada de decisão.

**Solução** Uma aplicação web responsiva para registro rápido de lançamentos, categorização, visão por período e metas financeiras simples, com dados isolados por usuário.

Para o **estudante universitário (PUC Minas e perfil equivalente)** ganhos em **clareza do orçamento mensal**, **menos tempo para organizar finanças** e **sensação de controle** sobre gastos acadêmicos e pessoais.

Nossos Diferenciais:

- Foco no contexto acadêmico (categorias e exemplos próximos da rotina de curso)
- Fluxos curtos: lançar em segundos no celular
- Privacidade: conta individual; sem venda de dados como premissa de v1
- Escopo enxuto na v1 — evitar “ERP pessoal”

---

## Perfis de Usuário

### Estudante (primário)

- Problemas: renda irregular; esquecimento de gastos pequenos; dificuldade em ver “quanto sobrou” no mês
- Objetivos: pagar contas em dia; saber limite semanal de gastos; poupar para metas
- Dados demográficos: 19–28 anos; graduação/pós; uso intensivo de smartphone
- Motivações: independência, redução de ansiedade, planejar estágio/viagem/material
- Frustrações: apps genéricos confusos; planilhas que não abre no ônibus; medo de expor dados

### Administrador do produto (interno)

- Problemas: necessidade de métricas de adoção e erros
- Objetivos: medir ativação, retenção e qualidade do onboarding

---

## Principais Funcionalidades

### RFN-01 Cadastro e autenticação

- Registro com e-mail e senha; login e logout; recuperação de senha (v1.1 se necessário).
- Critérios de Aceitação:
  - Usuário cria conta e acessa área logada
  - Senha armazenada com hash seguro (requisito técnico em spec_tech)
  - Sessão expira após período configurável ou logout explícito

### RFN-02 Lançamentos (receitas e despesas)

- Inclusão com valor, data, tipo (receita/despesa), descrição opcional, categoria.
- Listagem filtrável por mês e tipo.
- Critérios de Aceitação:
  - Lançamento aparece na lista após salvar
  - Valores negativos não permitidos no campo valor (sinal controlado pelo tipo)
  - Filtro por mês atual como padrão

### RFN-03 Categorias

- Conjunto inicial sugerido (Alimentação, Transporte, Estudos, Moradia, Lazer, Saúde, Outros); usuário pode criar/editar categorias próprias.
- Critérios de Aceitação:
  - Todo lançamento exige categoria válida
  - Exclusão de categoria: reatribuir ou bloquear se houver lançamentos (definir na implementação — preferir bloquear com mensagem na v1)

### RFN-04 Resumo / dashboard

- Totais do mês: receitas, despesas, saldo; gráfico ou lista por categoria (top gastos).
- Critérios de Aceitação:
  - Números consistentes com a soma dos lançamentos filtrados
  - Atualização imediata após criar/editar/excluir lançamento

### RFN-05 Metas simples

- Criar meta com nome, valor alvo, prazo opcional; acompanhar valor “guardado” manualmente ou por vínculo a categoria (v1: acompanhamento manual por atualização de valor).
- Critérios de Aceitação:
  - Usuário vê progresso percentual e valor faltante
  - Permite editar meta e arquivar/concluir

### RFN-06 Perfil e configurações mínimas

- Alterar nome de exibição; preferência de moeda BRL fixa na v1.
- Critérios de Aceitação:
  - Dados persistem após refresh

---

## Requisitos Não Funcionais

### RNF-01 - Desempenho

- Telas principais carregam em condições médias de rede em até ~2s (alvo); listagens paginadas acima de 200 itens.

### RNF-02 - Segurança

- HTTPS; autenticação com tokens seguros; dados por `user_id` sem vazamento entre contas.

### RNF-03 - Disponibilidade

- Alvo educacional: disponibilidade razoável em ambiente de nuvem gerenciada; janela de manutenção comunicada se aplicável.

### RNF-04 - Acessibilidade

- Contraste adequado, foco visível, labels em formulários; alvo WCAG 2.1 AA onde viável na v1.

### RNF-05 - Privacidade

- Política clara de uso de dados; mínima coleta; conformidade com LGPD em termos e bases legais (revisão jurídica recomendada antes de produção pública).

---

## Métricas de Sucesso

- Taxa de conclusão do primeiro lançamento em até 24h após cadastro
- Usuários ativos semanais (WAU) e retenção D7/D30
- Média de lançamentos por usuário por semana
- Tempo médio para criar um lançamento (usabilidade)
- NPS ou pesquisa curta in-app (opcional pós-v1)

---

## Premissas e restrições

- Produto não é conselho de investimento nem substitui profissional financeiro
- v1 em português (Brasil), moeda BRL
- Equipe pequena: priorizar stack moderna e hospedagem simples
- Integração bancária Open Finance fora do escopo da v1

## Escopo

- **v1:** auth, CRUD lançamentos, categorias, dashboard mensal, metas simples, UI responsiva, deploy em ambiente estável
- **v1.1:** recuperação de senha, export CSV, melhorias de acessibilidade
- **v2:** recorrência de lançamentos, orçamento por categoria, notificações leves, possível PWA offline parcial
