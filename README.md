<div align="center">

<h1>📄 DocMind AI</h1>
<h3>RAG-Powered PDF Chat Assistant</h3>

<p>
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-orange?style=for-the-badge" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/LangChain4j-1C3C3C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AstraDB-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Ollama-white?style=for-the-badge&logo=ollama&logoColor=black" />
</p>

> A full-stack RAG (Retrieval-Augmented Generation) application that lets users upload PDFs and have a real conversation with them — grounded answers, elaborated explanations, or live web search, all from a single chat interface.

**[Report Bug](https://github.com/V1vekgupta/DocMind-AI/issues)**

</div>

---

## 📑 Table of Contents
- [Description](#-description)
- [What Makes This Stand Out](#-what-makes-this-stand-out)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Known Limitations & Future Improvements](#-known-limitations--future-improvements)

---

## 📝 Description

DocMind AI is a production-style RAG pipeline built with **Spring Boot and React**: PDFs are parsed, chunked, embedded, and stored in a vector database, then retrieved and synthesized into natural-language answers by an LLM. On top of the standard "ask your PDF" pattern, it adds a **mode-aware chat system** — grounded, detailed, or live web search — each visually tagged in the UI so the user always knows where an answer came from.

---

## 🎯 What Makes This Stand Out

| Capability | Details |
|---|---|
| 🔐 **Security & Auth** | Spring Security with stateless JWT authentication, custom `UserDetailsService`, and a dedicated `security` package (not bundled into generic config) |
| 🧠 **Real RAG Pipeline** | PDF parsing (Apache PDFBox) → chunking → embeddings → AstraDB vector search → Ollama Cloud LLM synthesis, orchestrated via LangChain4j |
| 🎛️ **Mode-Aware Answers** | Three response modes — **Grounded** (strict, document-only), **Detailed** (structured elaboration), and **Web Search** (live results via Tavily/Serper) — auto-detected from phrasing or explicitly toggled |
| 🌐 **Optional Live Web Search** | Pluggable provider (Tavily or Serper) with source-cited synthesis; gracefully falls back to the model's own knowledge if unconfigured, instead of failing |
| 🗄️ **Dual-Database Architecture** | PostgreSQL for relational data (users, PDFs, conversations, messages) + AstraDB (Cassandra-based vector store) for embeddings |
| 🛡️ **Clean Error Handling** | Centralized `GlobalExceptionHandler` mapping domain exceptions to proper HTTP status codes (400/401/404/503) instead of raw stack traces |

---

## ✨ Features

### 👤 User
- Sign up and sign in with JWT-based session handling
- Upload PDFs and track processing status in real time
- Start a new chat per document or resume any past conversation
- Toggle **Detailed** or **Web Search** mode via a "+" menu in the chat input
- See which mode answered each message via a color-coded margin tag

### 🧠 RAG / Chat Engine
- Automatic text chunking and embedding on upload
- Vector similarity search scoped to the authenticated user's own documents
- Mode-aware prompt templates (concise vs. elaborated vs. web-synthesis)
- Conversation history maintained and fed back into the model for context

### 🔐 Authentication
- Register with full name, email, and password (BCrypt-hashed)
- Login to receive a stateless JWT for all protected routes
- Expired/malformed tokens are handled gracefully (clean 401s, not server errors)

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS v4, fetch-based API client

**Backend:** Spring Boot 3, Spring Security (JWT), Spring Data JPA, Maven

**AI / RAG:** LangChain4j, Ollama Cloud (LLM), AstraDB (vector store), Tavily / Serper (optional web search)

**Database:** PostgreSQL

**Tools:** Git, Postman

---

## 📂 Project Structure

DocMind-AI/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/docmind/
│   │   ├── controller/                # REST endpoints (Auth, PDF, Chat)
│   │   ├── service/                   # Business logic (RAG, PDF processing, web search)
│   │   ├── repository/                # Data access (JPA)
│   │   ├── model/
│   │   │   ├── entity/                # JPA entities
│   │   │   └── dto/                   # Request/response DTOs
│   │   ├── security/                  # JWT filter, Spring Security config, user details
│   │   ├── config/                    # Non-security app config (AstraDB, Ollama, web search)
│   │   └── exception/                 # Custom exceptions + global handler
│   └── src/main/resources/
│       └── application.properties.example
│
└── frontend/                         # React Frontend
├── src/
│   ├── api/                       # Backend API client
│   ├── context/                   # Auth context
│   ├── pages/                     # Login, Register, Dashboard
│   └── components/                # Sidebar, ChatPane, ChatInput, MessageItem
└── public/

---

## 🔑 API Reference

> All protected routes require an `Authorization: Bearer <JWT>` header.

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new account |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT |
| `GET` | `/api/auth/me` | Auth | Get the current user's profile |

### PDFs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/pdfs/upload` | Auth | Upload a PDF (multipart) for processing |
| `GET` | `/api/pdfs` | Auth | List the current user's PDFs |
| `GET` | `/api/pdfs/{id}` | Auth | Get a PDF's details and processing status |
| `DELETE` | `/api/pdfs/{id}` | Auth | Delete a PDF and its conversations |

### Conversations & Chat
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/conversations` | Auth | List all conversations |
| `GET` | `/api/conversations/{id}` | Auth | Get a conversation with full message history |
| `DELETE` | `/api/conversations/{id}` | Auth | Delete a conversation |
| `POST` | `/api/pdfs/{id}/conversations` | Auth | Create a new conversation for a PDF |
| `POST` | `/api/pdfs/{id}/chat` | Auth | Ask a question — supports `responseStyle` (`CONCISE`/`DETAILED`) and `webSearch` flags |

---

## ⚡ Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+
- An [AstraDB](https://astra.datastax.com) vector-enabled database
- An [Ollama Cloud](https://ollama.com) API key
- (Optional) A [Tavily](https://tavily.com) or [Serper](https://serper.dev) API key for live web search

```bash
# 1. Clone the repo
git clone https://github.com/V1vekgupta/DocMind-AI.git
cd DocMind-AI

# 2. Start the backend
cd backend
cp .env.example .env       # Fill in your credentials
mvn spring-boot:run

# 3. Start the frontend (new terminal)
cd ../frontend
cp .env.example .env       # Fill in your API base URL
npm install
npm run dev
```

> ⚠️ Make sure PostgreSQL is running and reachable before starting the backend.

---

## 🔐 Environment Variables

### Backend — `backend/.env`
```env
DB_URL=jdbc:postgresql://localhost:5432/PDFMind
DB_USERNAME=postgres
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret_minimum_256_bits
JWT_EXPIRATION_MS=86400000

ASTRA_TOKEN=your_astra_db_token
ASTRA_DATABASE_ID=your_astra_database_id

OLLAMA_API_KEY=your_ollama_cloud_api_key

# Optional — pick ONE provider, leave the other blank
WEB_SEARCH_PROVIDER=tavily
TAVILY_API_KEY=
SERPER_API_KEY=
```

### Frontend — `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8080
```

> ⚠️ Never commit `.env` or `application.properties` files. Use the committed `.example` templates instead.

---

## 📸 Screenshots

<p align="center">
<em>Add your own screenshots here — login screen, chat interface with mode tags, PDF sidebar, etc.</em>
</p>

---

## 🌟 Known Limitations & Future Improvements

- No automated test suite yet beyond the default Spring context-load test
- No rate limiting on auth or chat endpoints
- PDF processing runs synchronously on upload; large files may be slow
- Mode tags only apply to answers from the current session — not persisted on historical messages
- Deploy using Docker & CI/CD pipeline (GitHub Actions)
- Add refresh tokens and stronger file-type validation
- Add OpenAPI/Swagger docs and API rate limiting
- Write unit and integration tests (JUnit 5, Mockito, React Testing Library)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **[Vivek Gupta](https://github.com/V1vekgupta)**

⭐ Star this repo if you found it useful!

</div>
