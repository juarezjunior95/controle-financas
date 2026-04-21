# Controle de Finanças 💰

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Um produto completo e intuitivo de finanças pessoais criado para registrar receitas, despesas, gerenciar categorias, gerar resumos mensais e acompanhar metas financeiras. 

Ideal para **CLTs**, **autônomos**, **estudantes**, e *perfis mistos* que desejam retomar o controle dos seus gastos e estabelecer uma base sólida para poupar para o futuro.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Documentação do Produto](#-documentação-do-produto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Configurar e Executar](#-como-configurar-e-executar)
- [Como Contribuir](#-como-contribuir)
- [Suporte e Contato](#-suporte-e-contato)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Controle de Finanças** foi desenhado com foco em pessoas que buscam entender melhor para onde o seu dinheiro está indo de forma simplificada. Em vez de planilhas complexas, a plataforma oferece dashboards e relatórios diretos ao ponto, ajudando o usuário a visualizar facilmente seu caixa atual e o cumprimento das suas metas.

## ✨ Funcionalidades Principais

- **Registro Rápido:** Lançamento de despesas e receitas em poucos cliques.
- **Gestão de Categorias:** Organização flexível com categorias personalizadas.
- **Dashboard e Resumo Mensal:** Acompanhamento interativo do balanço do mês.
- **Metas Financeiras (Financial Goals):** Criação e a evolução do progresso para objetivos como "Reserva de Emergência" ou "Viagem de Férias".
- **Interface Premium e Responsiva:** Foco na experiência do usuário (UX) com design limpo e adaptativo a diferentes tamanhos de tela.

---

## 📚 Documentação do Produto

A documentação completa de requisitos e especificações técnicas e de design pode ser encontrada nos arquivos abaixo:

| Arquivo | Descrição / Conteúdo |
|---------|----------|
| [docs/problem_statement.md](docs/problem_statement.md) | Declaração de problema (dor do cliente, persona, objetivo) |
| [docs/definicao_problema.md](docs/definicao_problema.md) | Espelho em PT-BR alinhado ao `problem_statement.md` |
| [docs/prd.md](docs/prd.md) | PRD — Visão Geral, requisitos e escopo |
| [docs/spec_req.md](docs/spec_req.md) | Requisitos consolidados (Funcionais e Não-funcionais) |
| [docs/spec_tech.md](docs/spec_tech.md) | Especificação técnica profunda |
| [docs/spec_ui.md](docs/spec_ui.md) | Especificação de UX/UI |
| [docs/design_system.md](docs/design_system.md) | Design system base do produto |
| [docs/modelo_dados.md](docs/modelo_dados.md) | Dicionário/Modelo de dados |
| [docs/c4_model.md](docs/c4_model.md)| Desenho da arquitetura do software |
| [docs/jornada_usuario.md] (docs/jornada_usuario.md)| Conjunto de etapas da jornada do usuario |
| [docs/lean_canvas.md] (docs/lean_canvas.md)| Visao estrategica inicial do projeto|
| [docs/persona.md] (docs/persona.md)| Contexto de vida, objetivos financeiros e as principais dores da persona principal do projeto |

### Discovery Process

Roteiro de Discovery inicial disponível em: [roteiro_discovery (1).md](roteiro_discovery%20(1).md).  
*(As tarefas relacionadas ao checklist de elaboração ficam em documentações locais não versionadas em `docs/CHECKLIST_DISCOVERY.md` para manter a integridade do repositório principal).*

---

## 💻 Tecnologias Utilizadas

A stack principal deste repositório inclui as seguintes ferramentas modernas:

- **Frontend:** [Next.js](https://nextjs.org/) (React) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend / DB:** [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **Infra:** Docker (ambiente local) / Integrações Vercel e APIs relacionadas.

---

## 🚀 Como Configurar e Executar

Para iniciar a sua colaboração ou testar a versão local do **Controle de Finanças**, bastará seguir as etapas abaixo.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada: 18+ ou 20+)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para ambiente de containers de db)
- Conta e Projeto configurado no [Supabase](https://supabase.com/) 

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/juarezjunior95/controle-financas.git
cd controle-financas
```

2. Instale as dependências usando os comandos disponíveis nos gerenciadores:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Copie o arquivo base e popule com as credenciais do seu banco de dados e de ambiente:
```bash
cp .env.example .env.local
```

4. Execute a aplicação (modo de desenvolvimento local):
```bash
npm run dev
# ou
yarn dev
```

5. A aplicação estará ativa em `http://localhost:3000`.

---

## 🤝 Como Contribuir

Contribuições são essenciais e fazem da comunidade open source um lugar incrível para aprender e desenvolver soluções fantásticas. Qualquer contribuição ou bug report será **extremamente bem-vinda** e apreciada!

Se desejar sugerir melhorias, recomendamos que siga o fluxo:
1. Faça o *Fork* do projeto
2. Crie uma Branch para a sua nova Feature (`git checkout -b feature/MinhaNovaFeature`)
3. Adicione e Comite suas mudanças (`git commit -m 'feat: Instala a MinhaNovaFeature'`)
4. Realize o *Push* para a Branch criada (`git push origin feature/MinhaNovaFeature`)
5. Abra um novo *Pull Request* detalhando a alteração efetuada.

---

## 💬 Suporte e Contato

Se você tiver problemas, dúvidas ou desejar fornecer feedback:
- Abra uma nova **Issue** informando o comportamento identificado (com logs se aplicável).
- Utilize a página de **Discussions** caso queira sugerir novas features.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` no repositório para obter as informações legais correspondentes.

---
*Este documento segue diretamente as diretrizes oficiais de padronização do GitHub.*
