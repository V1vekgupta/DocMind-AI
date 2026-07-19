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
