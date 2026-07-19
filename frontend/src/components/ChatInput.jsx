import { useEffect, useRef, useState } from "react";

export default function ChatInput({ onSend, disabled, disabledReason }) {
  const [text, setText] = useState("");
  const [detailed, setDetailed] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed, {
      responseStyle: detailed ? "DETAILED" : "CONCISE",
      webSearch,
    });
    setText("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/10 bg-ink-950/80 p-4 backdrop-blur">
      {(detailed || webSearch) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {detailed && (
            <span className="rounded-full border border-tab-detailed/40 bg-tab-detailed/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-tab-detailed">
              DETAILED
            </span>
          )}
          {webSearch && (
            <span className="rounded-full border border-tab-web/40 bg-tab-web/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-tab-web">
              WEB SEARCH
            </span>
          )}
        </div>
      )}

      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Attach file"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-paper-dim transition hover:bg-white/10 hover:text-paper"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v12M3 8h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative flex-1" ref={menuRef}>
          <input
            ref={textareaRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? disabledReason : "Ask anything about your document..."}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-paper placeholder:text-muted focus:border-blue-500/50 focus:bg-white/8 focus:outline-none disabled:opacity-60"
          />

          {menuOpen && (
            <div className="absolute bottom-14 left-0 w-80 rounded-xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur">
              <button
                type="button"
                onClick={() => setDetailed((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-paper-dim transition hover:bg-white/10 hover:text-paper"
              >
                <span>
                  <span className="block text-paper">Detailed answer</span>
                  <span className="block text-xs text-muted">Elaborate with structure and examples</span>
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded border ${
                    detailed ? "border-tab-detailed bg-tab-detailed" : "border-ink-600"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setWebSearch((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-paper-dim transition hover:bg-white/10 hover:text-paper"
              >
                <span>
                  <span className="block text-paper">Web search</span>
                  <span className="block text-xs text-muted">Answer beyond this document</span>
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded border ${
                    webSearch ? "border-tab-web bg-tab-web" : "border-ink-600"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white transition hover:from-blue-700 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
