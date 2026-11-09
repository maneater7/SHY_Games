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

function StackedBar({ options, gameId, questionId }: { options: StatsOption[]; gameId: string; questionId: string }) {
  const total = options.reduce((n, o) => n + o.count, 0);
  if (total === 0) return <p className="text-sm font-semibold text-ink/60">No answers recorded yet.</p>;
  return (
    <div>
      <div className="flex h-7 overflow-hidden rounded-full border-[3px] border-ink bg-white">
        {options.map((o) => {
          const pct = (o.count / total) * 100;
          if (pct === 0) return null;
          const color = FLAG_COLORS[o.option_id] ?? (o.is_best ? "#4DEBE3" : o.option_id.endsWith("-b") ? "#B9A5F5" : "#F7B8D0");
          return <span key={o.option_id} style={{ width: `${pct}%`, background: color }} title={`${o.option_id}: ${o.count}`} />;
        })}
      </div>
      <ul className="mt-2 space-y-1">
        {options.map((o) => (
          <li key={o.option_id} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded border-2 border-ink px-1 text-[10px] font-black ${o.is_best ? "bg-turquoise" : "bg-cream"}`}>
              {o.option_id.includes("-") ? o.option_id.slice(-1).toUpperCase() : o.option_id.slice(0, 1).toUpperCase()}
            </span>
            <span className="flex-1 font-semibold leading-snug">
              {gameLabels[gameId]?.option(questionId, o.option_id) ?? o.option_id}
              {o.is_best && <span className="ml-1 text-xs font-extrabold text-ink/60">(safest)</span>}
            </span>
            <span className="font-extrabold tabular-nums">{o.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GameCard({ game }: { game: StatsGame }) {
  const labels = gameLabels[game.game_id];
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
    <section className="rounded-3xl border-[3px] border-ink bg-white shadow-chunky">
      <header className="border-b-[3px] border-ink px-5 py-4 sm:px-6">
        <h2 className="text-xl font-extrabold">{labels?.title ?? game.game_id}</h2>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold text-ink/75">
          {headline.map(([label, value]) => (
            <span key={label}>
              {value}
              {label === "finish rate" ? "%" : ""} <span className="font-semibold text-ink/55">{label}</span>
            </span>
          ))}
        </div>
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
          return (
            <li key={q.question_id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : q.question_id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 py-3 text-left"
              >
                <span className="font-bold leading-snug">{title}</span>
                <span className="flex shrink-0 items-center gap-3 text-xs font-bold text-ink/60">
                  {q.skips > 0 && <span>{q.skips} skip{q.skips > 1 ? "s" : ""}</span>}
                  {q.retries > 0 && <span>{q.retries} retr{q.retries > 1 ? "ies" : "y"}</span>}
                  {q.exits > 0 && <span>{q.exits} exit{q.exits > 1 ? "s" : ""}</span>}
                  <span aria-hidden="true" className={`inline-block transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </span>
              </button>
              {isOpen && (
                <div className="space-y-2 pb-4">
                  <StackedBar options={q.options} gameId={game.game_id} questionId={q.question_id} />
                  <QuestionInsight options={q.options} gameId={game.game_id} questionId={q.question_id} />
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
