import { useState } from "react";
import ModeTag, { modeBorderClass } from "./ModeTag";

export default function MessageItem({ message }) {
  const isUser = message.role === "USER";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleLike() {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  }

  function handleDislike() {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] rounded-lg border border-white/10 bg-gradient-to-r from-blue-600/40 to-blue-500/30 px-4 py-2.5 text-sm leading-6 text-paper shadow-[0_4px_12px_rgba(30,100,255,0.1)]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="group animate-sweep-in space-y-2">
      <div className={`rounded-lg border border-white/10 bg-white/5 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${modeBorderClass(message.mode)}`}>
        {message.mode && (
          <div className="mb-3">
            <ModeTag mode={message.mode} />
          </div>
        )}
        <p className="max-w-[75ch] whitespace-pre-wrap text-sm leading-6 text-paper-dim">{message.content}</p>
      </div>
      
      <div className="flex items-center gap-2 px-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy"}
          className="flex h-7 w-7 items-center justify-center rounded text-muted transition hover:bg-white/10 hover:text-paper"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11.5 3.5L5 10l-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 1.5h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM3 3.5v8a1 1 0 0 0 1 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        
        <button
          onClick={handleLike}
          title="Like"
          className={`flex h-7 w-7 items-center justify-center rounded transition ${
            liked ? "bg-accent/20 text-accent" : "text-muted hover:bg-white/10 hover:text-paper"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 12L1 7l1-1 5 4 5-4 1 1-6 5Z" />
          </svg>
        </button>
        
        <button
          onClick={handleDislike}
          title="Dislike"
          className={`flex h-7 w-7 items-center justify-center rounded transition ${
            disliked ? "bg-danger/20 text-danger" : "text-muted hover:bg-white/10 hover:text-paper"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 2l6 5-1 1-5-4-5 4-1-1 6-5Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

