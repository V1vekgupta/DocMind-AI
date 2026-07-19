import { useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function StatusDot({ status }) {
  const map = {
    READY: "bg-success",
    PROCESSING: "bg-accent animate-pulse",
    FAILED: "bg-danger",
  };
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${map[status] || "bg-muted"}`} aria-hidden="true" />;
}

export default function Sidebar({ pdfs, conversations, loading, onChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const pdf = await api.uploadPdf(file);
      await onChange();
      navigate(`/app/pdf/${pdf.id}`);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeletePdf(e, pdfId) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this PDF and its conversations?")) return;
    await api.deletePdf(pdfId);
    await onChange();
    if (String(params.pdfId) === String(pdfId)) {
      navigate("/app");
    }
  }

  async function handleDeleteConversation(e, conversationId) {
    e.preventDefault();
    e.stopPropagation();
    await api.deleteConversation(conversationId);
    await onChange();
    if (String(params.conversationId) === String(conversationId)) {
      navigate("/app");
    }
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,_rgba(10,16,31,0.95),_rgba(7,11,21,0.98))]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-700 bg-ink-950 font-display text-xs text-accent">
          D
        </div>
        <div>
          <span className="font-display text-base text-paper">DocMind</span>
          <p className="text-xs text-paper-dim">Chat with your documents</p>
        </div>
      </div>

      <div className="space-y-2 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate("/app")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-600"
        >
          <span className="text-lg leading-none">+</span>
          New Chat
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm text-paper-dim transition hover:border-white/20 hover:bg-white/10 hover:text-paper disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v9M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {uploading ? "Uploading…" : "Upload PDF"}
        </button>
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
      </div>

      <nav className="mt-5 flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <div>
          <h2 className="mb-2 px-1 font-mono text-[11px] tracking-wider text-muted">DOCUMENTS</h2>
          {loading ? (
            <p className="px-1 text-sm text-muted">Loading…</p>
          ) : pdfs.length === 0 ? (
            <p className="px-1 text-sm text-muted">No documents yet.</p>
          ) : (
            <ul className="space-y-0.5">
              {pdfs.map((pdf) => (
                <li key={pdf.id}>
                  <NavLink
                    to={`/app/pdf/${pdf.id}`}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition ${
                        isActive ? "bg-white/15 text-paper" : "text-paper-dim hover:bg-white/8 hover:text-paper"
                      }`
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-red-500">
                      <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M6 5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{pdf.originalFilename}</p>
                      <p className="text-[10px] text-muted">12 pages • 1.2 MB</p>
                    </div>
                    <button
                      onClick={(e) => handleDeletePdf(e, pdf.id)}
                      aria-label={`Delete ${pdf.originalFilename}`}
                      className="shrink-0 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                    >
                      ⋮
                    </button>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-2 px-1 font-mono text-[11px] tracking-wider text-muted">HISTORY</h2>
          {conversations.length === 0 ? (
            <p className="px-1 text-sm text-muted">No conversations yet.</p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((c) => (
                <li key={c.id}>
                  <NavLink
                    to={`/app/conversation/${c.id}`}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition ${
                        isActive ? "bg-white/15 text-paper" : "text-paper-dim hover:bg-white/8 hover:text-paper"
                      }`
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <path d="M2 4h10v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{c.title}</p>
                      <p className="text-[10px] text-muted">Today, 10:30 AM</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(e, c.id)}
                      aria-label={`Delete conversation ${c.title}`}
                      className="shrink-0 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                    >
                      ⋮
                    </button>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-display text-sm font-semibold text-white">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-paper">{user?.fullName}</p>
            <p className="truncate text-[10px] text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-paper-dim transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
