const DEMO_LINES = [
  {
    label: "GROUNDED",
    text: "Section 3.2 defines onboarding as a 14-day guided setup.",
    borderClass: "border-tab-grounded",
    textClass: "text-tab-grounded",
  },
  {
    label: "DETAILED",
    text: "Beyond the excerpt, this pattern typically reduces early churn by giving new users a clear first win.",
    borderClass: "border-tab-detailed",
    textClass: "text-tab-detailed",
  },
  {
    label: "WEB",
    text: "Recent industry data suggests most SaaS products now front-load onboarding within the first session.",
    borderClass: "border-tab-web",
    textClass: "text-tab-web",
  },
];

export default function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink-900 md:flex md:flex-col md:justify-between md:p-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full [background-image:linear-gradient(var(--color-paper)_1px,transparent_1px)] [background-size:100%_28px]" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-700 bg-ink-950 font-display text-sm text-accent">
            D
          </div>
          <span className="font-display text-lg text-paper">DocMind AI</span>
        </div>
      </div>

      <div className="relative">
        <p className="font-display text-3xl leading-snug text-paper">
          Every answer, <span className="text-accent">marked by where it came from.</span>
        </p>

        <div className="mt-10 space-y-4 rounded-xl border border-ink-800 bg-ink-950/60 p-5">
          {DEMO_LINES.map((line) => (
            <div key={line.label} className={`border-l-2 pl-4 ${line.borderClass}`}>
              <span className={`font-mono text-[10px] tracking-wider ${line.textClass}`}>{line.label}</span>
              <p className="mt-1 text-sm leading-relaxed text-paper-dim">{line.text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="relative text-xs text-muted">Chat with your PDFs. Know which mode answered.</p>
    </div>
  );
}
