# Mapeamento de Histórias de Usuário (User Story Mapping)

Este documento descreve o mapeamento das histórias de usuário (User Stories) para o sistema de Controle Financeiro, estruturado pelas principais jornadas e épicos do produto, com base na Definição de Requisitos do Produto (PRD).

---

## 1. Visão Geral (Backbone)

A jornada principal do usuário (backbone) reflete o ciclo de vida do seu engajamento com a aplicação:
**1. Acesso & Perfil** ➔ **2. Configuração (Categorias)** ➔ **3. Gestão Transacional** ➔ **4. Acompanhamento (Dashboard & Metas)**

---

## 2. Épicos e Histórias de Usuário

### Épico 1: Acesso e Perfil (Autenticação)
**Objetivo:** Permitir que o usuário acesse o sistema de forma segura e gerencie sua identidade básica.

| ID | História de Usuário | Critérios de Aceite | Prioridade / Release |
|----|---------------------|---------------------|----------------------|
| US-01 | Como usuário não cadastrado, quero criar uma conta com e-mail e senha para ter meu espaço privado de finanças. | - Validação de e-mail e senha fortes<br>- Conta criada com sucesso e encaminhamento ao dashboard vazio | v1 |
| US-02 | Como usuário, quero fazer login usando meu e-mail e senha para acessar meus dados lançados anteriormente. | - Credenciais validadas<br>- Redirecionamento após login | v1 |
| US-03 | Como usuário autenticado, quero fazer logout do sistema para manter minhas informações seguras em dispositivos compartilhados. | - Encerramento de sessão<br>- Retorno à página inicial de login | v1 |
| US-04 | Como usuário, quero alterar meu nome de exibição no perfil para personalizar minha experiência. | - Edição em tela de Perfil<br>- Atualização refletida visualmente no Header do App | v1 |

---

### Épico 2: Configuração e Categorização
**Objetivo:** Oferecer ferramentas para organizar as finanças de acordo com a realidade do usuário.

| ID | História de Usuário | Critérios de Aceite | Prioridade / Release |
|----|---------------------|---------------------|----------------------|
| US-05 | Como usuário ingressante, quero visualizar categorias padrão já sugeridas para não precisar criar todas do zero. | - Ao registrar, categorias "Alimentação", "Transporte", etc., estão disponíveis | v1 |
| US-06 | Como usuário, quero criar categorias customizadas com ícones ou cores para adequar o app ao meu modelo de gastos. | - Modal/Form de nova categoria salva dados no backend<br>- Exigência de nome e validação | v1 |
| US-07 | Como usuário, quero editar ou excluir uma categoria caso ela não faça mais sentido para meu controle. | - Possibilidade de alterar cor/nome<br>- Exclusão bloqueada se houver transações vinculadas (evitar transações órfãs) | v1 |

---

### Épico 3: Gestão Transacional (Lançamentos)
**Objetivo:** Registro rápido do dia a dia (Entradas e Saídas).

| ID | História de Usuário | Critérios de Aceite | Prioridade / Release |
|----|---------------------|---------------------|----------------------|
| US-08 | Como usuário, quero registrar uma **receita** ou **despesa** informando valor, data e categoria para acompanhar o fluxo do meu dinheiro. | - O valor deve ser sempre positivo, o sistema entende a direção pelo tipo (Income/Expense)<br>- Categoria é obrigatória | v1 |
| US-09 | Como usuário, quero listar minhas transações de um determinado mês e ano para fazer a conciliação do período. | - Filtros por default caem no mês corrente<br>- Lista exibe ícones de categoria e valores coloridos | v1 |
| US-10 | Como usuário, quero editar os dados de um lançamento caso tenha digitado algo errado (ex: erro no valor). | - O clique no registro abre o form preenchido<br>- Atualização recalcula totais do mês | v1 |
| US-11 | Como usuário, quero excluir um lançamento se ele for cancelado ou duplicado por engano. | - Prompt de confirmação antes da remoção permanente | v1 |

---

### Épico 4: Acompanhamento e Insights (Dashboard)
**Objetivo:** Entregar visibilidade instantânea da saúde financeira baseada nos lançamentos.

| ID | História de Usuário | Critérios de Aceite | Prioridade / Release |
|----|---------------------|---------------------|----------------------|
| US-12 | Como usuário, ao acessar o sistema, quero visualizar os totais de receitas, despesas e o meu saldo do mês para saber como estão minhas finanças rapidamente. | - Cards sumarizados precisos<br>- Cálculos atualizados em tempo real se lançamentos mudarem | v1 |
| US-13 | Como usuário, quero ver um resumo visual (ex: top despesas por categoria) para identificar de forma fácil os ralos do meu orçamento. | - Exibição de totais agrupados por categoria das despesas | v1 |

---

### Épico 5: Metas Financeiras (Goals)
**Objetivo:** Permitir planejamento para o futuro e formação de reservas/poupança.

| ID | História de Usuário | Critérios de Aceite | Prioridade / Release |
|----|---------------------|---------------------|----------------------|
| US-14 | Como usuário, quero cadastrar uma meta financeira (ex: "Viagem", "Reserva de Emergência") com um valor alvo, para tangibilizar meus sonhos. | - Nome, valor alvo e prazo (opcional) | v1 |
| US-15 | Como usuário, quero atualizar manualmente o valor guardado para uma meta para acompanhar sua progressão mensal. | - Atualização do campo de "currentAmount"<br>- UI mostra barra de progresso em % | v1 |
| US-16 | Como usuário, quero poder arquivar ou marcar a meta como concluída, retirando-a do planejamento ativo, para celebrar que a atingi. | - Status modificado (completed, archived)<br>- Movimentação para lista de histórico de metas | v1 |

---

## 3. Roadmapping de Releases

- **MVP (v1.0):** Compreende US-01 a US-16 (O coração funcional da aplicação).
- **v1.1 / v2.0 (Próximos Passos):**
  - Integração de Inteligência Artificial para leitura de relatórios (US: "Como usuário, quero receber conselhos automáticos e previsões com base nos meus gastos mensais").
  - Exportação de planilhas (CSV).
  - Recorrência de lançamentos fixos (mensalidade, boletos).
  - Transações atreladas automaticamente ao progresso da meta mensal.
