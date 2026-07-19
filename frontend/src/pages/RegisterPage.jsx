import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(fullName, email, password);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,163,61,0.16),_transparent_34%),linear-gradient(135deg,_#050816_0%,_#0d1326_100%)] text-paper">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16 lg:px-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-ink-900/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            Start your workspace
          </div>
          <h1 className="mt-6 font-display text-3xl text-paper">Create your account</h1>
          <p className="mt-2 text-sm leading-7 text-paper-dim">Launch your first AI-powered document workspace in minutes.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm text-paper-dim">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-ink-950/70 px-3.5 py-3 text-sm text-paper placeholder:text-muted focus:border-accent/60 focus:outline-none"
                placeholder="Jordan Lee"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-paper-dim">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-ink-950/70 px-3.5 py-3 text-sm text-paper placeholder:text-muted focus:border-accent/60 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm text-paper-dim">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-ink-950/70 px-3.5 py-3 text-sm text-paper placeholder:text-muted focus:border-accent/60 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-ink-950 transition hover:bg-[#f0b965] disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-paper transition hover:text-accent">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
