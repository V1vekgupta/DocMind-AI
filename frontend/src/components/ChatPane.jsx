import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { api } from "../api/client";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";

function deriveMode({ responseStyle, webSearch }) {
  if (webSearch) return "WEB";
  return responseStyle === "DETAILED" ? "DETAILED" : "CONCISE";
}

export default function ChatPane({ mode }) {
  const { pdfId: pdfIdParam, conversationId: conversationIdParam } = useParams();
  const navigate = useNavigate();
  const { refresh } = useOutletContext();

  const [pdf, setPdf] = useState(null);
  const [conversationId, setConversationId] = useState(mode === "conversation" ? Number(conversationIdParam) : null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function load() {
      try {
        if (mode === "conversation") {
          const conversation = await api.getConversation(conversationIdParam);
          if (cancelled) return;
          setConversationId(conversation.id);
          setMessages(conversation.messages.map((m) => ({ ...m })));
          const pdfInfo = await api.getPdf(conversation.pdfId);
          if (cancelled) return;
          setPdf(pdfInfo);
        } else {
          const pdfInfo = await api.getPdf(pdfIdParam);
          if (cancelled) return;
          setPdf(pdfInfo);
          setConversationId(null);
          setMessages([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, pdfIdParam, conversationIdParam]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(question, options) {
    if (!pdf) return;
    setError("");
    setSending(true);

    const optimisticId = `optimistic-${Date.now()}`;
    setMessages((prev) => [...prev, { id: optimisticId, role: "USER", content: question }]);

    try {
      const res = await api.askQuestion(pdf.id, { question, conversationId, ...options });

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
        return [
          ...withoutOptimistic,
          { ...res.userMessage },
          { ...res.assistantMessage, mode: deriveMode(options) },
        ];
      });

      if (!conversationId) {
        setConversationId(res.conversationId);
        navigate(`/app/conversation/${res.conversationId}`, { replace: true });
      }
      refresh();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setError(err.message || "Something went wrong answering that.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink-700 border-t-accent" />
      </div>
    );
  }

  const notReady = pdf && pdf.status !== "READY";

  function handleGoBack() {
    navigate("/app");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-white/10 bg-ink-950/50 px-6 py-4 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={handleGoBack}
            className="shrink-0 text-paper-dim transition hover:text-paper"
            title="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 5L7 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold text-paper">{messages.length > 0 ? (messages[0]?.content?.substring(0, 50) + "...") : "New chat"}</h1>
          </div>
        </div>

        {pdf && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-red-500">
                <rect x="4" y="2" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 6h4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <div className="text-sm">
                <p className="text-xs font-medium text-paper truncate max-w-xs">{pdf.originalFilename}</p>
                <p className="text-[10px] text-muted">12 pages • 1.2 MB</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-paper transition hover:bg-white/10">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M3 6h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              View Document
            </button>
            <button
              onClick={() => navigate("/app")}
              className="text-paper-dim transition hover:text-paper"
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 && !sending && (
          <div className="flex items-center justify-center h-32 text-paper-dim">
            <p className="text-sm">Start chatting by asking a question below.</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} />
        ))}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={sending || notReady}
        disabledReason={notReady ? "This document isn't ready yet..." : ""}
      />
    </div>
  );
}
