import { Link } from "react-router-dom";

const stats = [
  { label: "Documents ready", value: "10k+" },
  { label: "Answer speed", value: "< 4s" },
  { label: "Research trust", value: "99.9%" },
];

const features = [
  {
    title: "Grounded answers",
    text: "Every response is linked to the source section in your PDF, so you can validate findings instantly.",
  },
  {
    title: "Cross-document search",
    text: "Find the right paper, report, or appendix across your workspace in seconds instead of opening file after file.",
  },
  {
    title: "Built for research flow",
    text: "Summarize, compare, and extract evidence without leaving the conversation or breaking your focus.",
  },
];

const steps = [
  { title: "Upload", text: "Drop in one PDF or a full research pack and let DocMind prepare it for instant questions." },
  { title: "Ask", text: "Use natural language to compare sections, pull out evidence, or summarize long documents." },
  { title: "Advance", text: "Move from reading to insight with clear answers you can bring into your next draft or presentation." },
];

const useCases = [
  "Literature reviews and evidence mapping",
  "Policy and compliance document analysis",
  "Product research and strategy synthesis",
  "Academic paper summaries for faster discussion",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,163,61,0.16),_transparent_30%),linear-gradient(135deg,_#050816_0%,_#0d1326_100%)] text-paper">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold text-accent shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
            D
          </div>
          <div>
            <p className="font-display text-lg text-paper">DocMind AI</p>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Research, clarified</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-paper-dim md:flex">
          <a href="#features" className="transition hover:text-paper">
            Features
          </a>
          <a href="#workflow" className="transition hover:text-paper">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-paper-dim transition hover:border-accent/50 hover:text-paper">
            Sign in
          </Link>
          <Link to="/register" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-[#f0b965]">
            Get started
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm text-accent">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              Built for researchers and knowledge teams
            </div>
            <h1 className="mt-6 font-display text-4xl leading-tight text-paper sm:text-5xl lg:text-6xl">
              Ask questions from your PDFs and get answers you can trust.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-paper-dim">
              DocMind helps researchers turn dense documents into searchable insight. Upload papers, reports, and contracts, then ask natural questions and get grounded answers in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-[#f0b965]">
                Start free
              </Link>
              <a href="#workflow" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-paper-dim transition hover:border-accent/50 hover:text-paper">
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                  <p className="text-xl font-semibold text-paper">{item.value}</p>
                  <p className="mt-1 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-ink-900/70 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(232,163,61,0.2),rgba(255,255,255,0.04))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-accent">Research workspace</p>
                  <p className="mt-1 text-xl font-semibold text-paper">Literature review bundle</p>
                </div>
                <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-accent">
                  live
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-ink-950/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-ink-900/90">
                  <p className="text-sm text-paper">“What are the main limitations mentioned in the appendix?”</p>
                  <p className="mt-3 text-sm leading-7 text-paper-dim">
                    DocMind pulled the answer from the source PDF and surfaced the relevant section for you.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-accent">Cited answer</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-paper-dim">
                    “The review identifies reduced sample size, limited follow-up data, and mixed outcome consistency.”
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-accent">Real-time Web Search</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-paper-dim">
                    Found latest meta-analyses and systematic reviews on this topic from web search, ranked by relevance and citation count.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Features</p>
            <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
              Built to make document-heavy work faster and clearer.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[24px] border border-white/10 bg-ink-900/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-ink-800/80 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-lg text-accent">
                  ✦
                </div>
                <h3 className="mt-4 text-lg font-semibold text-paper">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-paper-dim">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
          <div className="rounded-[32px] border border-white/10 bg-ink-900/70 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur lg:p-10">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">How it works</p>
              <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
                From upload to insight in a few clear steps.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/8 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-paper">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-paper-dim">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <div className="rounded-[32px] border border-white/10 bg-ink-900/70 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Made for serious work</p>
                <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
                  Spend less time skimming and more time forming the next insight.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-paper-dim">
                  Whether you are reviewing literature, comparing policy documents, or preparing a report, DocMind gives you a faster path from question to evidence.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/register" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-[#f0b965]">
                    Start with your first PDF
                  </Link>
                  <a href="#features" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-paper-dim transition hover:border-accent/50 hover:text-paper">
                    Explore features
                  </a>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <h3 className="text-lg font-semibold text-paper">Ideal for</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-paper-dim">
                  {useCases.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6">
          <p className="text-center text-sm text-paper-dim">
            Made with <span className="text-accent">❤️</span> by <span className="font-semibold text-paper">Vivek Gupta</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/V1vekgupta"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-muted transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              title="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/vivek-gupta-0bb0992b7/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-muted transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              title="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href="#workflow"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-muted transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              title="Documentation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="19" x2="12" y2="5" />
                <line x1="9" y1="9" x2="15" y2="9" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
