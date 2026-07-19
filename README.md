# DocMind AI — PDF Assistant (Backend)

A Spring Boot backend that lets users upload PDFs and ask natural-language
questions about them, answered using a Retrieval-Augmented Generation (RAG)
pipeline: PDF parsing → chunking → embeddings → AstraDB vector search → Ollama
Cloud LLM.

> **Status:** Backend only. No frontend yet (CORS is pre-configured for a
> Vite dev server at `http://localhost:5173` for when one is built).

## Tech stack

- **Java 21 / Spring Boot 3** — REST API, security, JPA
- **PostgreSQL** — relational data (users, PDFs, conversations, messages)
- **LangChain4j** — PDF parsing (Apache PDFBox), chunking, embeddings, LLM calls
- **AstraDB (DataStax)** — Cassandra-based vector store for embeddings
- **Ollama Cloud** — hosted LLM (`gpt-oss:20b`) for chat completions
- **JWT + Spring Security** — stateless authentication

## Project structure

```
com.docmind
├── config/       # non-security app config (AstraDB, Ollama, LangChain beans)
├── security/      # JWT, Spring Security config, auth filter, user details
├── controller/     # REST endpoints
├── service/       # business logic (auth, PDF processing, chat/RAG)
├── repository/     # Spring Data JPA repositories
├── model/
│   ├── entity/     # JPA entities
│   └── dto/       # request/response DTOs
├── exception/      # custom exceptions + global handler
└── util/         # DtoMapper
```

## Setup

### 1. Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL running locally (or update `DB_URL`)
- An AstraDB database (vector-enabled) — https://astra.datastax.com
- An Ollama Cloud API key — https://ollama.com

### 2. Configure environment variables

`application.properties` is intentionally **not committed** (it's gitignored)
because it would otherwise hold real secrets. Two ways to configure it:

**Option A — real environment variables** (recommended):
```bash
export DB_PASSWORD=your_real_password
export JWT_SECRET=$(openssl rand -base64 48)
export ASTRA_TOKEN=your_real_astra_token
export ASTRA_DATABASE_ID=your_real_database_id
export OLLAMA_API_KEY=your_real_ollama_key
```

**Option B — local `.env` file** (this project already depends on
`spring-dotenv`, so a `.env` file in `backend/` is picked up automatically):
```bash
cp backend/.env.example backend/.env
# then fill in real values in backend/.env
```

`backend/src/main/resources/application.properties.example` documents every
property; copy it to `application.properties` if you'd rather not use env
vars, but never commit that copy with real values in it.

### 3. Run

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

## Key endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Get a JWT |
| POST | `/api/pdfs` | Upload a PDF (multipart) |
| GET | `/api/pdfs` | List your PDFs |
| DELETE | `/api/pdfs/{id}` | Delete a PDF |
| POST | `/api/pdfs/{id}/chat` | Ask a question about a PDF (RAG) |
| GET | `/api/pdfs/{id}/conversations` | List conversations for a PDF |

All endpoints except `/api/auth/**` and `GET /api/health` require
`Authorization: Bearer <token>`.

### Response detail control

`POST /api/pdfs/{id}/chat` accepts an optional `responseStyle` field
(`CONCISE` or `DETAILED`). If omitted, the backend auto-detects intent from
the question text — e.g. asking "explain that in more detail" will
automatically switch to a fuller, structured answer for that turn.

```json
{
  "question": "Summarize section 2 in more detail",
  "conversationId": 12
}
```

### Web search ("+" icon)

The same endpoint accepts an optional `webSearch` boolean, meant to be set
`true` when the user picks a web-search option in the chat UI (e.g. a "+"
icon). If omitted, the backend also auto-detects intent from phrases like
"search on internet" / "search on web".

```json
{
  "question": "What's the latest version of Spring Boot?",
  "webSearch": true
}
```

When `webSearch` is true, the backend calls a configured search provider
(Tavily or Serper — pick one, see `.env.example`) and has the LLM synthesize
an answer from the results, with inline source citations. If no provider key
is configured yet, it automatically falls back to the LLM's own general
knowledge instead of failing, and says so in the answer.

**Note:** this is a live web search via a third-party search API, not a
browsing agent — it works from short search snippets, not full pages, so the
model is instructed to note that specific facts should be verified at the
source.

## Known limitations / next steps

- No automated tests yet beyond the default Spring context-load test.
- No rate limiting on auth or chat endpoints.
- PDF processing happens synchronously during upload; large files may be slow.
- No frontend.

See project notes for the fuller improvement backlog (async processing,
pagination, refresh tokens, Docker, OpenAPI docs, etc.).
