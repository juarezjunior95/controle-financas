# Checklist — Discovery (ordem do roteiro)

Legenda: `[x]` feito neste repositório · `[ ]` ação sua (ferramenta externa ou dado que só você tem)

## Pré-requisitos

- [x] Repositório criado no GitHub (você informou que já criou)
- [x] `git init` no projeto local
- [ ] Conectar remoto e primeiro push: `git remote add origin <URL>` → `git add .` → `git commit -m "..."` → `git push -u origin main` (ou `master`)

## 1.1 Definição do problema

- [ ] (Opcional) Validar problema com pesquisa aprofundada (“deep research”) na sua IA de preferência
- [x] Cenário, persona, dor, impacto e solução atual documentados
- [x] `docs/definicao_problema.md`
- [x] `docs/problem_statement.md` (mesmo conteúdo do roteiro — resultado nomeado no roteiro)

## 1.2 Refinamento

- [x] `docs/prd.md` — PRD
- [x] `docs/spec_req.md` — especificação de requisitos (consolidado RF/RNF; o roteiro lista como entregável)
- [x] `docs/spec_tech.md` — especificação técnica
- [x] `docs/spec_ui.md` — especificação de UI
- [x] `docs/revisao_refinamento_ia.md` — registro da revisão cruzada (PRD + tech + UI) e ajustes aplicados

## 1.3 Desenho

- [x] `docs/prompt_stitch_prototipos.md` — prompt para Google Stitch (ou ferramenta similar)
- [ ] Executar fluxo no Stitch: Web → modelo Pro → colar prompt → gerar → Preview / Variations / Protótipos → Interact → renomear projeto
- [x] `docs/design_system.md` — design system (base para protótipos)
- [x] `docs/modelo_dados.md` — modelo de dados conceitual

## Encerramento da fase Discovery

- [ ] Revisão final com stakeholders (PM, dev, UX) conforme roteiro
- [ ] Commit + push de todas as alterações para o GitHub

---

**Ordem de execução recomendada:** pré-requisitos → 1.1 → 1.2 (PRD → spec_req → spec_tech → spec_ui → revisão) → 1.3 (prompt Stitch → protótipos na ferramenta → design system e modelo de dados já podem preceder ou acompanhar os protótipos).
