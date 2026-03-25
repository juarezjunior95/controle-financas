# Revisão cruzada (IA) — PRD, spec técnica e spec UI

**Escopo da revisão:** consistência entre `prd.md`, `spec_tech.md` e `spec_ui.md`.

## Achados e ações

| Tema | Achado | Ação aplicada |
|------|--------|----------------|
| Problema / público | `problem_statement.md` ampliado para CLT, autônomos e estudantes | PRD, `definicao_problema.md`, spec UI, design system, prompt de protótipo e spec técnica (nome do produto) revisados para o mesmo contexto |
| Metas v1 | PRD menciona progresso manual; UI poderia sugerir automação | Mantido manual na v1; UI especifica barra de progresso e campos explícitos |
| Recuperação de senha | PRD indica v1.1 | UI: link presente mas pode ficar desabilitado até v1.1 |
| Categorias | PRD: exclusão com lançamentos | spec_req e spec_ui alinhados com bloqueio ou reatribuição; v1 = bloqueio com mensagem |
| Segurança | PRD RNF genérico | spec_tech detalha JWT/cookie, hash, isolamento por `user_id` |
| Dashboard | PRD pede consistência numérica | spec_tech: testes em regras de saldo; spec UI: filtros explícitos por mês |
| Acessibilidade | PRD alvo AA | spec UI: labels, toque, `aria`; spec_tech: não só frontend — mensagens de erro estruturadas na API |

## Riscos residuais

- **LGPD:** textos legais (termos, política) precisam revisão humana/jurídica antes de produção pública.
- **Stack dupla:** spec_tech permite Node ou Python; time deve fixar uma opção no primeiro sprint de implementação e atualizar o repositório.

## Próximo passo recomendado

Fixar stack (ex.: React+Vite + Fastify + Prisma + Postgres), criar repositório de código da aplicação ou pasta `apps/` conforme estrutura escolhida, e abrir issues mapeadas a RF-01…RF-07.
