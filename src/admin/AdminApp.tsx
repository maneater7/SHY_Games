import { useCallback, useEffect, useState } from "react";
import { createAdminClient } from "@/lib/supabase";
import { BoothResults } from "./BoothResults";
import { localBoothPreview } from "@/lib/booth";
import "../components/games-hub.css";

const IDLE_MS = 30 * 60 * 1000;

type Client = NonNullable<ReturnType<typeof createAdminClient>>;
type Step = "loading" | "unavailable" | "signin" | "dashboard";

const button =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-turquoise px-6 py-3 text-base font-extrabold text-ink shadow-chunky transition hover:brightness-110 active:translate-y-[4px] active:shadow-none disabled:opacity-50";
const input =
  "w-full rounded-2xl border-[3px] border-ink bg-white px-4 py-3 font-semibold text-ink placeholder:text-ink/40";

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

function Dashboard({ client, onSignOut }: { client: Client; onSignOut: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-8">
      <div className="lobby-backdrop" aria-hidden />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">SHY analytics</h1>
          <p className="mt-1 font-semibold text-ink/70">Completed-game results per player. Each answer counts a player’s first pick.</p>
        </div>
        <button type="button" onClick={onSignOut} className={`${button} !bg-peach !px-4 !py-2 text-sm`}>Sign out</button>
      </header>
      <BoothResults client={client} />
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

  if (localBoothPreview) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="lobby-backdrop" aria-hidden />
        <h1 className="text-3xl font-extrabold">SHY analytics — local preview</h1>
        <p className="mt-2 font-semibold text-ink/70">Dev mode: admin sign-in skipped. Only in-memory results from this browser session appear here; the live database is untouched.</p>
        <BoothResults />
      </main>
    );
  }
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
