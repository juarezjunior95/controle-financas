# Design system (v0 — base para protótipos)

## Princípios

- **Clareza antes de densidade:** poucos números por tela; hierarquia forte.
- **Calma:** evitar alarmismo em vermelho para “despesa”; usar cor semântica com moderação.
- **Acadêmico sem ser infantil:** moderno, limpo, confiável.

## Paleta (CSS variables sugeridas)

| Token | Uso | Hex |
|-------|-----|-----|
| `--color-bg` | Fundo principal | `#0f1419` |
| `--color-surface` | Cards, modais | `#1a222c` |
| `--color-border` | Bordas sutis | `#2d3844` |
| `--color-text` | Texto primário | `#e8eef4` |
| `--color-text-muted` | Secundário | `#8b9aab` |
| `--color-accent` | CTAs, links | `#3d8bfd` |
| `--color-accent-hover` | Hover CTA | `#5ca0ff` |
| `--color-income` | Receita (detalhe) | `#3ecf8e` |
| `--color-expense` | Despesa (detalhe) | `#ff8a65` |
| `--color-danger` | Excluir / erro crítico | `#ef5350` |

*Tema escuro como padrão reduz fadiga em uso noturno (comum em estudantes). Oferecer tema claro na v1.1 se desejado.*

## Tipografia

- **Display / títulos:** "DM Sans", 600–700, fallbacks: system-ui
- **Corpo / UI:** "Source Sans 3", 400–600
- **Números / valores:** tabular nums (`font-variant-numeric: tabular-nums`) na mesma família do corpo

Escala sugerida: 12 / 14 / 16 / 20 / 28 / 36 px.

## Espaçamento e grid

- Base 4px; padding de página 16px (mobile) / 24px (desktop).
- Largura máxima de conteúdo ~1120px no desktop.
- Raio: 10px cards, 8px botões, 12px modais.

## Componentes

- **Botão primário:** fundo `--color-accent`, texto branco, altura mín. 44px, raio 8px.
- **Botão secundário:** borda `--color-border`, fundo transparente.
- **Input:** fundo `--color-surface`, borda `--color-border`, foco com anel 2px `--color-accent`.
- **Card de métrica:** label muted, valor grande com tabular nums, variação opcional com cor income/expense.
- **Lista de lançamento:** linha com data à esquerda, descrição, categoria pill, valor alinhado à direita.

## Ícones

- Conjunto linear consistente (ex.: Phosphor ou Lucide); tamanho 20–24px.

## Motion

- Transições 150–200ms ease; evitar animações que atrasem fluxo de lançamento.

## Acessibilidade

- Contraste mínimo 4.5:1 para texto normal; foco visível em todos os controles interativos.
- Não depender só de cor para distinguir receita/despesa (ícone ou rótulo).
