import { useOutletContext } from "react-router-dom";

export default function WelcomePane() {
  const { pdfs } = useOutletContext();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="rounded-[24px] border border-white/10 bg-ink-900/70 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 font-display text-xl text-accent">
          D
        </div>
        <h1 className="mt-6 font-display text-2xl text-paper">
          {pdfs.length === 0 ? "Upload a PDF to get started" : "Pick a document to start chatting"}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-paper-dim">
          {pdfs.length === 0
            ? "Once it is processed, you can ask questions, summarize sections, and surface the most important insights instantly."
            : "Choose a document from the sidebar, or upload a new one to keep the conversation moving."}
        </p>
      </div>
    </div>
  );
}
