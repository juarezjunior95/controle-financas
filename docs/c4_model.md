# Modelos C4 de Arquitetura

Este documento mapeia a arquitetura técnica de software do projeto Controle Financeiro utilizando a visão padrão do framework C4 Model (Context e Container).

---

## 1. Nível 1: Diagrama de Contexto (System Context)

O diagrama de contexto mostra como o sistema Controle de Finanças se relaciona com seus usuários e provedores periféricos externos.

```mermaid
C4Context
    title Diagrama de Contexto (Nível 1) - Controle Financeiro 

    Person(usuario_regular, "Usuário", "Adultos buscando controle financeiro pessoal, categorização de gastos e previsibilidade de caixa.")
    
    System(app_controle_financas, "Controle Financeiro App", "Permite que usuários acompanhem suas transações de entradas e saídas, gerenciem metas, definam categorias e recebam aconselhamentos inteligentes de IA.")

    System_Ext(provedor_llm, "APIs de I.A (OpenAI/Anthropic)", "Provê inferência computacional de Linguagem Natural para gerar insghts customizados sobre as despesas do usuário.")

    System_Ext(provedor_identidade, "Provedor Auth (Supabase/Clerk)", "Gerencia a autorização, tokens e identificação segura dos usuários, simplificando registro.")

    Rel(usuario_regular, app_controle_financas, "Rastreia finanças, cria metas, e consome relatórios através de", "Web Browser/Mobile")
    Rel(app_controle_financas, provedor_llm, "Busca insights e orientações baseados em metadados anonimizados")
    Rel_Back(provedor_llm, app_controle_financas, "Retorna sugestões em linguagem natural")
    Rel(app_controle_financas, provedor_identidade, "Valida autenticação com")
```

---

## 2. Nível 2: Diagrama de Contêineres (Containers)

No escopo de Contêineres, o "App Controle Financeiro" é desmembrado em suas partes acionáveis (Frontend, Backend, DB).

```mermaid
C4Container
    title Diagrama de Contêineres (Nível 2) - Controle Financeiro 

    Person(usuario_regular, "Usuário", "Pessoa gerenciando orçamento")

    System_Boundary(boundary_sistema, "Controle Financeiro") {
        Container(spa_frontend, "Web Application Frontend", "Next.js / React / Tailwind", "Permite as interações do usuário. Renderiza o cliente via browser, consome APIs e exibe dashboards financeiros interativos.")
        
        Container(api_backend, "Backend API / App API", "NestJS / Node.js / Express", "Exposto via rotas REST/GraphQL. Valida regras de negócio de limite de conta, CRUD transacional, controle e delegação das chamadas de terceiros.")
        
        ContainerDb(db_relacional, "Banco de Dados", "PostgreSQL / Prisma ORM", "Armazena informações criptografadas de clientes, perfis, histórico de transacionais e metas cadastradas.")
    }

    System_Ext(provedor_llm, "API de Inteligência Artificial", "Interface externa do Modelo de Linguagem (ChatGPT ou similar).")
    
    Rel(usuario_regular, spa_frontend, "Insere novos gastos e visualiza relatórios usando", "HTTPS")
    Rel(spa_frontend, api_backend, "Envia e captura dados dinamicamente usando", "JSON/REST API chamadas assíncronas")
    
    Rel(api_backend, db_relacional, "Lê e escreve registros transacionais usando", "Prisma Client (TCP/IP)")
    Rel(api_backend, provedor_llm, "Encaminha resumos JSON para gerar recomendações via", "HTTPS")
```

---

### Breves Requisitos Arquitetônicos Atendidos
- **Escalabilidade (RNF):** Solução Backend e Frontend destacadas. O Backend concentra a regra de negócio rigorosa em NestJS enquanto o WebApp (NextJS) possui cache ágil focado em renderização de UI.
- **Segurança (RNF):** Interações de delegação de acesso por SSO.
- **Agilidade de Consultas:** Armazenamento Transacional rígido SQL (Postgres). Promove integridade referencial nas finanças (sem transação órfã).

---

## 3. Nível 3: Diagrama de Componentes (Components)

Foca na arquitetura interna do Container "Backend API / App API" construído com NestJS.

```mermaid
C4Component
    title Diagrama de Componentes (Nível 3) - Backend API (NestJS)

    ContainerDb(db_relacional, "Banco de Dados", "PostgreSQL", "Armazena informações criptografadas.")
    System_Ext(provedor_llm, "API LLM", "Serviço de IA")

    Container_Boundary(api_backend, "Backend API / App API") {
        Component(auth_guard, "Auth Guard", "NestJS Guard", "Valida JWT via Supabase/Clerk")
        
        Component(transaction_module, "Transaction Module", "NestJS Module", "Gerencia o ciclo de vida das transações")
        Component(category_module, "Category Module", "NestJS Module", "Gerencia categorias customizadas")
        Component(goal_module, "Goal Module", "NestJS Module", "Gerencia metas e progressos")
        Component(ai_module, "AI Module", "NestJS Module", "Orquestra prompts e cache de IA")
        
        Component(prisma_service, "Prisma Service", "NestJS Provider", "Camada de abstração do Banco de Dados via Prisma ORM")

        Rel(transaction_module, prisma_service, "Lê/Escreve dados de transações usando")
        Rel(category_module, prisma_service, "Lê/Escreve dados de categorias usando")
        Rel(goal_module, prisma_service, "Lê/Escreve dados de metas usando")
        Rel(ai_module, transaction_module, "Obtém dados serializados das transações para inferência usando")
    }

    Rel(auth_guard, transaction_module, "Protege rotas do")
    Rel(prisma_service, db_relacional, "Requisita/Salva dados via TCP/IP", "Prisma/SQL")
    Rel(ai_module, provedor_llm, "Request de Geração (HTTPS)", "JSON")
```

---

## 4. Nível 4: Diagrama de Classes / Código (Code)

Foco interno de uma das entidades principais. Exemplificado com o diagrama de classes da entidade "Transaction" e sua relação com "Category" e "User".

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String name
        +Date createdAt
        +Date updatedAt
    }

    class Category {
        +String id
        +String name
        +String icon
        +String color
        +String userId
        +create()
        +update()
        +delete()
    }

    class Transaction {
        +String id
        +Decimal amount
        +Date date
        +String description
        +TransactionType type
        +String categoryId
        +String userId
        +create()
        +update()
        +delete()
    }

    class TransactionType {
        <<enumeration>>
        INCOME
        EXPENSE
    }

    User "1" -- "*" Category : owns
    User "1" -- "*" Transaction : makes
    Category "1" -- "*" Transaction : classifies
    Transaction --> TransactionType : is of type
```

---

## 5. Diagrama de Implantação (Deployment)

Mapeia a topologia e implantação da aplicação nos provedores de nuvem (Vercel, Render/Railway, Supabase).

```mermaid
C4Deployment
    title Diagrama de Implantação - Controle Financeiro

    Deployment_Node(usuario_device, "Dispositivo do Usuário", "Smartphones / Laptops") {
        Deployment_Node(browser, "Web Browser", "Chrome, Safari, Firefox") {
            Container(spa_frontend, "Web Application", "Next.js SPA", "Interface renderizada do cliente")
        }
    }

    Deployment_Node(vercel, "Provedor Frontend", "Vercel") {
        Container(static_hosting, "Static Hosting / Serverless", "Vercel Edge", "Hospeda o App React/Next.js")
    }

    Deployment_Node(backend_cloud, "Provedor Backend", "Railway / Render") {
        Deployment_Node(node_server, "Node.js Container", "Docker") {
            Container(api_backend, "Backend API", "NestJS", "Atende requisições de regras de negócio")
        }
    }

    Deployment_Node(supabase_cloud, "Provedor de Dados & Auth", "Supabase AWS") {
        ContainerDb(db_relacional, "Banco de Dados", "PostgreSQL", "Módulo de Dados Relacionais")
        Container(auth_service, "Auth Service", "Go/Supabase Auth", "Valida JWTs e Sessões")
    }

    Rel(spa_frontend, static_hosting, "Baixa estáticos / Hydration", "HTTPS")
    Rel(spa_frontend, auth_service, "Autentica usuário via", "HTTPS")
    Rel(spa_frontend, api_backend, "Chamadas de API de Dados via", "HTTPS / JSON")
    Rel(api_backend, db_relacional, "Leitura e Gravação relacional via", "Mux/Prisma (Port 5432)")
```
