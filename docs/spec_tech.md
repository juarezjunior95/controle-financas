# Especificação Técnica

## Visão Geral Técnica

Este documento orienta desenvolvimento e operações do produto de **finanças pessoais** deste repositório (nome de pasta/código: `controle-financas`; nomes comerciais podem evoluir). Público: desenvolvedores e DevOps. Objetivo: definir arquitetura de referência, stack, segurança, APIs e diretrizes para desenvolvimento assistido por IA.

---

## Arquitetura de Referência

- **Estilo:** monólito modular com **frontend SPA** + **API REST** (ou BFF leve) no mesmo repositório ou serviços separados conforme preferência do time; para v1 recomenda-se **um backend** e **um frontend** para simplicidade.
- **Componentes:** cliente web; API; banco relacional; serviço de autenticação baseado em JWT (stateless) ou sessão em cookie httpOnly (escolha explícita na implementação).
- **Observabilidade:** logs estruturados (JSON), níveis info/warn/error; métricas básicas (latência, erros) se hospedagem permitir; tracing opcional.
- **Autenticação e autorização:** registro/login; toda rota de dados exige usuário autenticado; autorização por posse de recurso (`resource.user_id === auth.user_id`).
- **Comunicação:** HTTPS; JSON; versionamento de API via prefixo `/api/v1`.
- **Deployment:** container ou plataforma PaaS (ex.: Railway, Render, Fly.io, AWS); variáveis de ambiente para segredos; migrations no deploy.

---

## Stack Tecnológica

### Frontend

- **Linguagem:** TypeScript
- **Framework web:** React (Vite) ou Next.js (se SSR for desejado na v1)
- **Estilização:** CSS Modules ou Tailwind CSS (escolha única do time)

### Backend

- **Linguagem:** TypeScript ou Python (escolha única)
- **Runtime:** Node.js 22+ ou Python 3.11+
- **Framework:** Express/Fastify (Node) ou FastAPI (Python)
- **Persistência:** PostgreSQL (recomendado)
- **ORM:** Prisma (Node) ou SQLAlchemy (Python)

### Stack de Desenvolvimento

- **IDE:** VS Code / Cursor
- **Gerenciamento de pacotes:** npm/pnpm (Node) ou uv/poetry (Python)
- **Ambiente de desenvolvimento local:** Docker Compose com Postgres ou Postgres local
- **Infraestrutura como Código (IaC):** opcional v1 — Terraform ou somente manifestos do provedor
- **Pipeline CI/CD:** GitHub Actions — lint, testes, build

### Integrações

- **Persistência:** PostgreSQL gerenciado ou container
- **IA (Insights):** Google Gemini 2.5 Flash (via `@google/genai`)
- **Deployment:** conforme provedor escolhido
- **Segurança:** bcrypt/argon2 para senha; JWT assinado ou sessão segura
- **Observabilidade:** logs no stdout; agregador conforme provedor

---

## Segurança

### Autenticação e Gestão de Sessão

- Senhas com hash forte (Argon2id ou bcrypt com custo adequado).
- Proteção CSRF se usar cookie de sessão; SameSite e Secure.
- JWT: expiração curta + refresh token rotacionável (opcional v1.1) ou apenas access token com expiração moderada na v1.

### Controle de Acesso e Autorização

- RBAC mínimo: papel `user` na v1; todas as queries filtram por `user_id`.

### Segurança de Dados e Validação

- Validação de entrada no servidor (schema); sanitização de strings exibidas (XSS).
- Rate limit em rotas de login/registro.

#### Criptografia e Proteção de Dados

- TLS em trânsito; dados sensíveis não em logs; backups cifrados pelo provedor.

### Segurança da Infraestrutura e Configuração

- Segredos apenas em variáveis de ambiente / secret manager; princípio do menor privilégio no banco.

### Segurança no Desenvolvimento e Operação (DevSecOps)

- Dependabot ou equivalente; SAST opcional; revisão de PR para mudanças em auth e dados.

---

## APIs

- **Base:** `https://<domínio>/api/v1`
- **Padrão:** REST; recursos no plural (`/transactions`, `/categories`, `/goals`).
- **Autenticação:** header `Authorization: Bearer <token>` ou cookie httpOnly (documentar escolha).
- **Endpoints públicos:** `POST /auth/register`, `POST /auth/login`, `GET /health`
- **Endpoints protegidos:** CRUD de lançamentos, categorias, metas, perfil, resumo agregado
- **Erros:** JSON `{ "error": { "code", "message" } }`; HTTP 4xx/5xx consistentes
- **Versionamento:** quebras apenas em `/v2` no futuro

---

## Tenancy

- **Estratégia:** single database, **isolamento lógico** por `user_id` em todas as tabelas de domínio.
- **Identificação:** UUID ou bigint para PKs; FK sempre com `user_id` onde aplicável.
- **Migrações:** ferramenta do ORM; nunca editar produção sem migration versionada.
- **Segurança:** testes garantem que usuário A não acessa recurso de B.

---

## Diretrizes para Desenvolvimento Assistido por IA

- Priorizar implementação que siga este documento e `docs/spec_ui.md`.
- Não introduzir integrações bancárias ou escopo fora do PRD sem atualizar os documentos.
- Ao gerar código: validação server-side, checagem de `user_id`, e testes para regras de saldo e auth.
- Commits pequenos e mensagens descritivas; não commitar `.env` com segredos.
