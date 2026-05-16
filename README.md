# Studio Elegance — Sistema de Agendamento

Site para um estúdio de beleza onde clientes podem **ver serviços**, **criar conta**, **fazer login** e **agendar, reagendar ou cancelar** horários. O projeto combina páginas HTML estáticas no navegador com uma API REST em Node.js que persiste tudo no PostgreSQL.

---

## Sobre o projeto

O **Studio Elegance** é um sistema de agendamento online pensado para salões e estúdios de beleza. O visitante navega por três telas principais:

| Página | Arquivo | Função |
|--------|---------|--------|
| Home | `index.html` | Painel de boas-vindas e navegação entre áreas |
| Serviços | `servicos.html` | Catálogo por categoria (cabelo, unhas, estética) e botão para agendar |
| Agendamentos | `agendamentos.html` | Lista dos horários do cliente (próximos e histórico) |

Funcionalidades principais:

- Cadastro e login com JWT (token guardado no `localStorage`)
- Listagem de serviços vindos do banco
- Modal de agendamento com escolha de data e horários disponíveis
- Cancelamento e reagendamento de compromissos
- Interface escura com detalhes em dourado (Tailwind CSS + CSS customizado)

---

## Como o projeto mistura HTML e Node.js

Este repositório **não** usa um único servidor Node que renderiza HTML (como EJS, Pug ou Next.js). O formato é uma **arquitetura em duas partes**, no mesmo projeto:

```
┌─────────────────────────────────────┐     HTTP (fetch)      ┌──────────────────────────────────┐
│  FRONTEND — arquivos estáticos      │  ──────────────────►  │  BACKEND — API REST (Node.js)    │
│  index.html, servicos.html, etc.    │  ◄──────────────────  │  Express na porta 3000           │
│  Servido pelo Live Server (:5500)   │       JSON + JWT      │  PostgreSQL via Prisma           │
└─────────────────────────────────────┘                       └──────────────────────────────────┘
```

### 1. Frontend: HTML “puro” + JavaScript no navegador

- Cada tela é um arquivo `.html` independente (aplicação **multi-página**, sem React/Vue e sem build).
- O conteúdo fixo (layout, textos, grids) fica no HTML.
- Trechos repetidos (header, modal de login, modal de agendamento) **não** são copiados em cada página: existem `div` vazias (`#header-root`, `#modal-root`, `#booking-root`) e o arquivo `src/components.js` **injeta** o HTML via JavaScript (`innerHTML` + templates em string).
- A comunicação com o servidor é feita por `fetch` em `src/api.js`, que expõe `window.studioApi` (auth, serviços, agendamentos).
- Cada página carrega os mesmos scripts na ordem:

  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="./src/site-setup.js"></script>
  <!-- ... conteúdo da página ... -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="./src/api.js"></script>
  <script src="./src/components.js"></script>
  <script>initPage();</script>
  <!-- Em servicos.html e agendamentos.html há também um <script> inline com a lógica daquela página -->
  ```

- `initPage()` monta header, modais e ícones; a lógica específica (ex.: filtrar serviços, listar agendamentos) fica em `<script>` no final de cada HTML.

### 2. Backend: só API JSON (Node.js não “entrega” as páginas)

- A pasta `backend/` roda **apenas** a API Express (`/api/...`).
- Não há rotas que devolvem `index.html`; o Node cuida de autenticação, validação, regras de negócio e banco.
- O frontend e a API rodam em **processos e portas diferentes**; o CORS (`CORS_ORIGIN` no `.env`) autoriza o origin do Live Server (ex.: `http://127.0.0.1:5500`).

### Por que esse formato?

| Vantagem | Descrição |
|----------|-----------|
| Simplicidade | Sem bundler, sem SSR; HTML abre direto no editor e no navegador |
| Separação clara | UI no cliente; regras e dados no servidor |
| Aprendizado | Mostra o fluxo real: browser → REST → banco |
| Evolução | Depois dá para trocar o front por React/Vite mantendo a mesma API |

Em resumo: **HTML + JS no cliente** para interface; **Node.js + Express** para persistência e segurança. Eles “se misturam” pelo contrato HTTP/JSON, não por templates embutidos no servidor.

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | HTML5, JavaScript (vanilla), Tailwind CSS (CDN), Lucide Icons, CSS custom (`src/styles.css`) |
| Backend | Node.js, Express, Prisma ORM, PostgreSQL |
| Segurança | Argon2 (senhas), JWT, Helmet, rate limit, CORS, Zod (validação) |

---

## Estrutura do repositório

```
Site_Agendamento/
├── index.html              # Home / dashboard
├── servicos.html           # Catálogo + agendamento
├── agendamentos.html       # Meus agendamentos
├── imagem/                 # Logo, favicon
├── src/
│   ├── api.js              # Cliente HTTP → backend (window.studioApi)
│   ├── components.js       # Header, login e booking (initPage, openBooking)
│   ├── site-setup.js       # Tailwind config + fontes + styles.css
│   └── styles.css          # Estilos globais e componentes
└── backend/
    ├── server.js           # Entry point da API
    ├── prisma/
    │   ├── schema.prisma   # clientes, servicos, agendamentos
    │   └── seed.js         # Serviços iniciais
    └── src/
        ├── app.js          # Express, middlewares, rotas
        ├── config/         # env, Prisma Client
        ├── middlewares/    # auth JWT, erros, Zod
        ├── modules/        # auth, clientes, servicos, agendamentos
        └── utils/          # AppError, asyncHandler, response
```

### Modelo de dados (resumo)

- **clientes** — nome, e-mail, senha (hash), telefone
- **servicos** — categoria, nome, preço, duração, imagem, ativo
- **agendamentos** — cliente + serviço + data/hora + status (`pendente`, `confirmado`, `cancelado`, `concluido`)

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Extensão **Live Server** (VS Code) ou outro servidor estático para abrir os `.html` na raiz do projeto

### 1. Backend (API)

```bash
cd backend
npm install
```

Copie e edite o ambiente:

```bash
cp .env.example .env
```

Exemplo de `.env`:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/studio_elegance"
JWT_SECRET="sua-chave-secreta-forte"
PORT=3000
CORS_ORIGIN="http://127.0.0.1:5500"
```

Crie o banco e aplique as migrations:

```sql
CREATE DATABASE studio_elegance;
```

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

A API ficará em `http://localhost:3000` (teste: `GET /api/health`).

### 2. Frontend (páginas HTML)

1. Abra a pasta **raiz** do projeto (`Site_Agendamento`) no VS Code.
2. Clique com o botão direito em `index.html` → **Open with Live Server**.
3. Confirme que `src/api.js` aponta para `http://localhost:3000/api` (padrão atual).
4. O `CORS_ORIGIN` no backend deve coincidir com a URL do Live Server (geralmente `http://127.0.0.1:5500`).

**Ordem recomendada:** subir o backend primeiro, depois abrir o site no navegador.

---

## Fluxo de dados (exemplo: agendar)

1. Usuário clica em “Agendar” em `servicos.html` → `openBooking(servico)` abre o modal.
2. O modal chama `studioApi.agendamentos.horariosDisponiveis(data)` → `GET /api/agendamentos/horarios-disponiveis`.
3. Ao confirmar, `studioApi.agendamentos.criar(...)` → `POST /api/agendamentos` com JWT no header `Authorization`.
4. O backend valida (Zod), verifica conflito de horário, grava no PostgreSQL e devolve JSON padronizado.

---

## Endpoints da API

Base: `http://localhost:3000/api`

### Auth

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/registrar` | Cadastrar cliente | — |
| POST | `/auth/login` | Login → JWT | — |
| GET | `/auth/me` | Perfil do cliente | ✅ |

### Serviços

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/servicos` | Listar (filtro `?categoria=`) | — |
| GET | `/servicos/:id` | Detalhe | — |
| POST | `/servicos` | Criar | ✅ |
| PATCH | `/servicos/:id` | Atualizar | ✅ |
| DELETE | `/servicos/:id` | Desativar (soft delete) | ✅ |

### Agendamentos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/agendamentos` | Listar do cliente logado | ✅ |
| POST | `/agendamentos` | Criar | ✅ |
| PATCH | `/agendamentos/:id/cancelar` | Cancelar | ✅ |
| PATCH | `/agendamentos/:id/reagendar` | Reagendar | ✅ |
| PATCH | `/agendamentos/:id/status` | Atualizar status | ✅ |
| GET | `/agendamentos/horarios-disponiveis?data=YYYY-MM-DD` | Horários livres | ✅ |

### Clientes

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| PATCH | `/clientes` | Atualizar perfil | ✅ |
| DELETE | `/clientes` | Excluir conta | ✅ |

Respostas seguem o formato `{ sucesso, mensagem, dados }` (ver `backend/src/utils/response.js`).

---

## Scripts do backend

| Comando | Ação |
|---------|------|
| `npm run dev` | API com hot-reload (nodemon) |
| `npm start` | API em produção |
| `npm run db:migrate` | Aplicar migrations Prisma |
| `npm run db:seed` | Popular serviços iniciais |
| `npm run db:studio` | Interface visual do banco (Prisma Studio) |

---

## Módulos do frontend (`window`)

| Global | Arquivo | Uso |
|--------|---------|-----|
| `studioApi` | `api.js` | Chamadas à API e sessão (token/cliente no `localStorage`) |
| `initPage()` | `components.js` | Injeta UI compartilhada ao carregar cada página |
| `openBooking(service)` | `components.js` | Abre modal de agendamento com o serviço escolhido |
| `carregarAgendamentos()` | `agendamentos.html` | Recarrega lista após novo agendamento (exposto no `window`) |

---

## Licença e uso

Projeto educacional / portfólio. Ajuste `JWT_SECRET`, credenciais do banco e `CORS_ORIGIN` antes de qualquer deploy público.
