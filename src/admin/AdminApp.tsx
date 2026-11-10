import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminClient } from "@/lib/supabase";
import { GAME_ORDER, gameLabels } from "./labels";

const IDLE_MS = 30 * 60 * 1000;

type Client = NonNullable<ReturnType<typeof createAdminClient>>;
type Step = "loading" | "unavailable" | "signin" | "dashboard";

interface StatsOption { option_id: string; is_best: boolean; count: number }
interface StatsQuestion { question_id: string; skips: number; retries: number; exits: number; options: StatsOption[] }
interface StatsGame {
  game_id: string;
  starts: number;
  completions: number;
  answered: number;
  skipped: number;
  unique_players: number;
  repeat_responses: number;
  question_detail_available: boolean;
  questions: StatsQuestion[];
}

const FLAG_COLORS: Record<string, string> = { green: "#86E0AE", yellow: "#FFD95A", red: "#FF8F80" };

const button =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-turquoise px-6 py-3 text-base font-extrabold text-ink shadow-chunky transition hover:brightness-110 active:translate-y-[4px] active:shadow-none disabled:opacity-50";
const input =
  "w-full rounded-2xl border-[3px] border-ink bg-white px-4 py-3 font-semibold text-ink placeholder:text-ink/40";

async function loadStats(client: Client): Promise<StatsGame[]> {
  const { data, error } = await client.rpc("admin_game_stats");
  if (error) throw new Error(error.message ?? String(error));
  if (!Array.isArray(data)) return [];
  return data as StatsGame[];
}

function Unavailable() {
  return (
    <main className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="text-3xl font-extrabold">Admin isn’t set up yet</h1>
      <p className="mt-3 font-semibold leading-relaxed">
        The Supabase URL and anon key haven’t been added to this build’s environment.
      </p>
    </main>
  );
}

function SignIn({ client, onDone }: { client: Client; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: err } = await client.auth.signInWithPassword({ email, password });
    if (err || !data.user) {
      setError("That email and password didn’t work.");
      setBusy(false);
      return;
    }
    const { data: isAdmin } = await client.rpc("admin_check");
    if (!isAdmin) {
      await client.auth.signOut();
      setError("This account signed in, but it isn’t on the admin list.");
      setBusy(false);
      return;
    }
    onDone();
  };

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-extrabold">SHY analytics</h1>
      <p className="mt-2 font-semibold text-ink/70">Team sign-in.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border-[3px] border-ink bg-cream p-6 shadow-chunky">
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-extrabold">Email</label>
          <input id="admin-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-1 block text-sm font-extrabold">Password</label>
          <input id="admin-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </div>
        {error && <p role="alert" className="font-bold text-[#A33A2C]">{error}</p>}
        <button type="submit" disabled={busy} className={`${button} w-full`}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function QuestionInsight({ options, gameId, questionId }: { options: StatsOption[]; gameId: string; questionId: string }) {
  const total = options.reduce((n, o) => n + o.count, 0);
  if (total === 0) return null;
  const label = (id: string) => gameLabels[gameId]?.option(questionId, id) ?? id;
  const best = options.find((o) => o.is_best);
  const topWrong = options.filter((o) => !o.is_best).sort((a, b) => b.count - a.count)[0];
  if (!topWrong || topWrong.count === 0) {
    return <p className="text-sm font-semibold text-ink/70">Everyone who answered picked the recommended move.</p>;
  }
  return (
    <p className="text-sm font-semibold leading-relaxed text-ink/80">
      <span className="font-extrabold">{topWrong.count} of {total}</span> picked “{label(topWrong.option_id)}”
      {best ? <> — recommended was “{label(best.option_id)}” ({best.count}).</> : "."}
    </p>
  );
}

const OPTION_PALETTE = ["#B9A5F5", "#F7B8D0", "#8AD4F0", "#FFD95A"];

function optionColor(option: StatsOption, index: number): string {
  return FLAG_COLORS[option.option_id] ?? (option.is_best ? "#4DEBE3" : OPTION_PALETTE[index % OPTION_PALETTE.length]);
}

function Donut({ options }: { options: StatsOption[] }) {
  const total = options.reduce((n, o) => n + o.count, 0);
  const R = 34;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 84 84" className="h-28 w-28 shrink-0" role="img" aria-label="Share of answers">
      <circle cx="42" cy="42" r={R} fill="none" stroke="#F4ECD9" strokeWidth="14" />
      {options.map((o, i) => {
        const offset = C / 4 - acc * C;
        const frac = total === 0 ? 0 : o.count / total;
        acc += frac;
        if (frac === 0) return null;
        return (
          <circle
            key={o.option_id}
            cx="42"
            cy="42"
            r={R}
            fill="none"
            stroke={optionColor(o, i)}
            strokeWidth="14"
            strokeDasharray={`${frac * C} ${C}`}
            strokeDashoffset={offset}
          />
        );
      })}
      <text x="42" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill="#2B2350">
        {total}
      </text>
      <text x="42" y="53" textAnchor="middle" fontSize="8" fontWeight="700" fill="#6B6486">
        answers
      </text>
    </svg>
  );
}

function OptionBreakdown({ options, gameId, questionId }: { options: StatsOption[]; gameId: string; questionId: string }) {
  const total = options.reduce((n, o) => n + o.count, 0);
  if (total === 0) return <p className="text-sm font-semibold text-ink/60">No answers recorded yet.</p>;
  return (
    <div className="flex flex-wrap items-start gap-5">
      <Donut options={options} />
      <ul className="min-w-52 flex-1 space-y-1.5">
        {options.map((o, i) => {
          const pct = Math.round((o.count / total) * 100);
          return (
            <li key={o.option_id} className="flex items-start gap-2 text-sm">
              <span aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-2 border-ink" style={{ background: optionColor(o, i) }} />
              <span className="flex-1 font-semibold leading-snug">
                {gameLabels[gameId]?.option(questionId, o.option_id) ?? o.option_id}
                {o.is_best && <span className="ml-1 text-xs font-extrabold text-ink/60">(recommended)</span>}
              </span>
              <span className="shrink-0 font-extrabold tabular-nums">
                {o.count} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GameCard({ game }: { game: StatsGame }) {
  const labels = gameLabels[game.game_id];
  const gameIndex = GAME_ORDER.indexOf(game.game_id);
  const headerColor = ["#D7F8F4", "#E7DFFB", "#FFE3DD", "#FFF0BA"][gameIndex] ?? "#F4ECD9";
  const rate = game.starts > 0 ? Math.round((game.completions / game.starts) * 100) : 0;
  const [open, setOpen] = useState<string | null>(null);
  const headline: [string, number][] = [
    ["players", game.unique_players],
    ["responses", game.completions],
    ["repeat plays", game.repeat_responses],
    ["finish rate", rate],
    ["skips", game.skipped],
  ];
  return (
    <section className="overflow-hidden rounded-3xl border-[3px] border-ink bg-white shadow-chunky">
      <header className="border-b-[3px] border-ink px-5 py-4 sm:px-6" style={{ backgroundColor: headerColor }}>
        <div className="flex flex-wrap items-center gap-3">
          {gameIndex >= 0 && (
            <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-extrabold">
              Game {gameIndex + 1}
            </span>
          )}
          <h2 className="text-xl font-extrabold">{labels?.title ?? game.game_id}</h2>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {headline.map(([label, value]) => (
            <div key={label} className="rounded-2xl border-2 border-ink/15 bg-white/80 px-3 py-2">
              <dt className="text-xs font-bold capitalize text-ink/70">{label}</dt>
              <dd className="mt-1 text-2xl font-extrabold tabular-nums">
                {value}{label === "finish rate" ? "%" : ""}
              </dd>
            </div>
          ))}
        </dl>
      </header>
      {!game.question_detail_available && (
        <p className="px-5 py-4 text-sm font-semibold text-ink/70 sm:px-6">
          Per-question detail unlocks at 10 finishes so a single player’s answers can’t stand out.
          Currently at {game.completions} of 10.
        </p>
      )}
      <ol className="divide-y-2 divide-ink/10 px-5 sm:px-6">
        {game.questions.map((q) => {
          const title = labels?.question[q.question_id] ?? q.question_id;
          const isOpen = open === q.question_id;
          const totalAnswers = q.options.reduce((n, o) => n + o.count, 0);
          const topWrong = q.options.filter((o) => !o.is_best).sort((a, b) => b.count - a.count)[0];
          const wrongPct = topWrong && totalAnswers ? Math.round((topWrong.count / totalAnswers) * 100) : 0;
          const wrongLabel = topWrong ? (labels?.option(q.question_id, topWrong.option_id) ?? topWrong.option_id) : "";
          return (
            <li key={q.question_id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : q.question_id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 py-3 text-left"
              >
                <span className="font-bold leading-snug">{title}</span>
                <span className="flex shrink-0 items-center gap-3">
                  {totalAnswers === 0 ? (
                    <span className="text-xs font-bold text-ink/45">no answers yet</span>
                  ) : wrongPct === 0 ? (
                    <span className="rounded-full border-2 border-ink bg-turquoise px-2 py-0.5 text-[11px] font-extrabold">all recommended</span>
                  ) : (
                    <span
                      title={`Most-picked other move: “${wrongLabel}”`}
                      className={`rounded-full border-2 border-ink px-2 py-0.5 text-[11px] font-extrabold ${wrongPct >= 40 ? "bg-soft-pink" : "bg-peach"}`}
                    >
                      {wrongPct}% “{wrongLabel.length > 22 ? `${wrongLabel.slice(0, 21)}…` : wrongLabel}”
                    </span>
                  )}
                  <span aria-hidden="true" className={`inline-block text-xs font-bold text-ink/60 transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </span>
              </button>
              {isOpen && (
                <div className="space-y-3 pb-5">
                  <OptionBreakdown options={q.options} gameId={game.game_id} questionId={q.question_id} />
                  <QuestionInsight options={q.options} gameId={game.game_id} questionId={q.question_id} />
                  <p className="flex flex-wrap gap-3 text-xs font-bold text-ink/55">
                    {q.skips > 0 && <span>{q.skips} skipped</span>}
                    {q.retries > 0 && <span>{q.retries} retried another move first</span>}
                    {q.exits > 0 && <span>{q.exits} left the game here</span>}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Dashboard({ client, onSignOut }: { client: Client; onSignOut: () => void }) {
  const [stats, setStats] = useState<StatsGame[] | null>(null);
  const [error, setError] = useState("");
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStats(await loadStats(client));
      setLoadedAt(new Date());
      setError("");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(
        /not authorized|permission|42501/i.test(message)
          ? "This account signed in, but it isn’t on the admin list. Ask who manages the project to run the shy_admins insert, then sign in again."
          : `Couldn’t load the stats (${message}). Check the connection and try again.`,
      );
    }
  }, [client]);

  useEffect(() => { void refresh(); }, [refresh]);

  const games = useMemo(
    () => GAME_ORDER.map((id) => stats?.find((g) => g.game_id === id)).filter((g): g is StatsGame => !!g),
    [stats],
  );

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">SHY analytics</h1>
          <p className="mt-1 font-semibold text-ink/70">Anonymous totals only. Each answer counts a player’s first pick.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void refresh()} className={`${button} !bg-cream !px-4 !py-2 text-sm`}>Refresh</button>
          <button type="button" onClick={onSignOut} className={`${button} !bg-peach !px-4 !py-2 text-sm`}>Sign out</button>
        </div>
      </header>

      {error && <p role="alert" className="mt-6 rounded-2xl border-[3px] border-[#A33A2C] bg-[#F8DCE9] px-4 py-3 font-bold">{error}</p>}
      {loadedAt && <p className="mt-4 text-sm font-semibold text-ink/60">Loaded {loadedAt.toLocaleTimeString()}.</p>}
      {!stats && !error && <p className="mt-10 font-semibold">Loading totals…</p>}

      <div className="mt-6 space-y-8">
        {games.map((g) => <GameCard key={g.game_id} game={g} />)}
      </div>
    </main>
  );
}

export default function AdminApp() {
  const [client] = useState(() => createAdminClient());
  const [step, setStep] = useState<Step>("loading");


  const signOut = useCallback(() => {
    void client?.auth.signOut();
    setStep("signin");
  }, [client]);

  useEffect(() => {
    if (!client) { setStep("unavailable"); return; }
    let mounted = true;
    client.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (!data.session) { setStep("signin"); return; }
      const { data: isAdmin } = await client.rpc("admin_check");
      if (!mounted) return;
      if (isAdmin) setStep("dashboard");
      else {
        await client.auth.signOut();
        if (mounted) setStep("signin");
      }
    }).catch(() => {
      if (mounted) setStep("signin");
    });
    return () => { mounted = false; };
  }, [client]);

  useEffect(() => {
    if (step !== "dashboard" || !client) return;
    let timer = window.setTimeout(signOut, IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(signOut, IDLE_MS);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [step, client, signOut]);

  if (!client) return <Unavailable />;
  switch (step) {
    case "loading":
      return <main className="mx-auto max-w-md px-5 py-24 text-center font-semibold">Loading…</main>;
    case "unavailable":
      return <Unavailable />;
    case "signin":
      return <SignIn client={client} onDone={() => setStep("dashboard")} />;
    case "dashboard":
      return <Dashboard client={client} onSignOut={signOut} />;
  }
}
