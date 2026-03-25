# Especificação de UI

## Interfaces gráficas

### INT-AUTH-01 - Login

- **Tipo:** página (formulário)
- **Campos:** e-mail, senha
- **Botões:** Entrar, link para cadastro
- **Links:** Esqueci minha senha (v1.1 ou desabilitado com tooltip)
- **Considerações:** mensagem de erro genérica em falha de login; foco no primeiro campo

### INT-AUTH-02 - Cadastro

- **Tipo:** página (formulário)
- **Campos:** nome, e-mail, senha, confirmar senha
- **Botões:** Criar conta
- **Links:** Já tenho conta
- **Considerações:** validação inline de senha fraca; termos de uso (checkbox) se política existir

### INT-APP-01 - Shell / navegação principal

- **Tipo:** layout (header + navegação + área de conteúdo)
- **Campos:** —
- **Botões:** menu hambúrguer (mobile), ícone perfil
- **Links:** Resumo, Lançamentos, Metas, Categorias, Sair
- **Considerações:** indicar página ativa; contraste AA

### INT-DASH-01 - Resumo (dashboard)

- **Tipo:** página
- **Campos:** seletor de mês/ano
- **Botões:** Novo lançamento (atalho)
- **Links:** Ver todos os lançamentos
- **Considerações:** cards com Receitas, Despesas, Saldo; gráfico de pizza ou barras por categoria (top 5 + “Outros”)

### INT-TX-01 - Lista de lançamentos

- **Tipo:** página com tabela ou lista
- **Campos:** filtros mês, tipo (todos/receita/despesa), busca por descrição
- **Botões:** Novo lançamento, editar (por linha), excluir (por linha com confirmação)
- **Links:** —
- **Considerações:** valores em BRL formatado; cor sutil para receita/despesa

### INT-TX-02 - Formulário de lançamento (criar/editar)

- **Tipo:** modal (desktop) ou página (mobile)
- **Campos:** tipo (receita/despesa), valor, data, categoria (select), descrição (opcional)
- **Botões:** Salvar, Cancelar
- **Links:** Gerenciar categorias
- **Considerações:** teclado numérico no mobile para valor; data padrão hoje

### INT-CAT-01 - Categorias

- **Tipo:** página (lista + formulário inline ou modal)
- **Campos:** nome da categoria, ícone/cor opcional (v1 pode ser só nome)
- **Botões:** Adicionar, Salvar edição, Excluir (com confirmação)
- **Links:** —
- **Considerações:** categorias padrão não editáveis ou editáveis — alinhar com PRD (v1: permitir editar nome; exclusão bloqueada se em uso)

### INT-GOAL-01 - Metas

- **Tipo:** página
- **Campos:** nome, valor alvo, prazo (opcional), valor atual / progresso
- **Botões:** Nova meta, editar, concluir/arquivar
- **Links:** —
- **Considerações:** barra de progresso; mensagem motivacional opcional discreta

### INT-PROF-01 - Perfil

- **Tipo:** página
- **Campos:** nome de exibiido, e-mail (somente leitura)
- **Botões:** Salvar
- **Links:** Sair
- **Considerações:** link para política de privacidade

---

## Fluxo de Navegação

1. Visitante → **Cadastro** ou **Login** → **Resumo**
2. **Resumo** → **Lançamentos** → **Novo/Editar lançamento** → volta para lista ou resumo
3. **Resumo** → **Metas** → criar/editar meta
4. **Lançamentos** → **Categorias** (atalho) → retorno
5. Qualquer área logada → **Perfil** / **Sair** → Login

Fluxo feliz primeiro lançamento: pós-cadastro, CTA “Registrar primeiro gasto” leva ao formulário com dicas de categorias acadêmicas.

---

## Diretrizes para IA

- Gerar UI mobile-first; espaçamento generoso; botões com área de toque ≥ 44px.
- Paleta e tipografia devem seguir `docs/design_system.md`.
- Não adicionar telas fora desta lista sem atualizar este documento e o PRD.
- Formulários: labels visíveis, mensagens de erro associadas ao campo (`aria-describedby`).
- Evitar jargão financeiro pesado; linguagem simples para estudantes.
