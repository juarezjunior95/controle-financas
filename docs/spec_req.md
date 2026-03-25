# Especificação de Requisitos

Documento consolidado derivado do PRD e coerente com `docs/problem_statement.md` (problema, público e objetivo do produto). IDs alinhados ao PRD para rastreabilidade.

## Requisitos funcionais

| ID | Nome | Descrição resumida | Prioridade |
|----|------|-------------------|------------|
| RF-01 | Autenticação | Registro, login, logout; sessão segura | Must |
| RF-02 | Lançamentos | CRUD receita/despesa: valor, data, tipo, descrição, categoria | Must |
| RF-03 | Filtros de lista | Filtro por mês (padrão: atual) e tipo | Must |
| RF-04 | Categorias | Lista inicial + CRUD usuário; validação em lançamentos | Must |
| RF-05 | Dashboard | Totais mês, saldo, distribuição por categoria | Must |
| RF-06 | Metas | CRUD meta: nome, alvo, prazo opcional, progresso manual v1 | Should |
| RF-07 | Perfil | Nome de exibição; moeda BRL v1 | Could |

## Regras de negócio

- Valor do lançamento: número ≥ 0; tipo define se entra como receita ou despesa no saldo.
- Saldo do período: soma(receitas) − soma(despesas) no intervalo selecionado.
- Categoria obrigatória em todo lançamento.
- Dados sempre escopados ao usuário autenticado.

## Requisitos não funcionais

| ID | Categoria | Descrição |
|----|-----------|-----------|
| RNF-01 | Performance | Carregamento perceived < ~2s em condições típicas; paginação em listas grandes |
| RNF-02 | Segurança | HTTPS; hash de senha; tokens; isolamento multi-tenant lógico por usuário |
| RNF-03 | Disponibilidade | Hospedagem gerenciada; monitoramento básico |
| RNF-04 | Acessibilidade | WCAG 2.1 AA como alvo onde viável |
| RNF-05 | Privacidade / LGPD | Transparência; minimização; base legal em produção pública |

## Critérios de aceite globais

- Nenhum endpoint de dados financeiros responde sem autenticação válida.
- Testes automatizados cobrem regras de saldo e autorização em caminhos críticos (detalhar em spec_tech).

## Fora de escopo (v1)

- Open Finance / importação bancária automática
- Multi-moeda e multi-idioma
- Modo colaborativo / família compartilhada
