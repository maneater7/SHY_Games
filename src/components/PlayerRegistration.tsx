import { useState } from "react";
import { localBoothPreview, registerPlayer } from "@/lib/booth";

export function PlayerRegistration({ onReady }: { onReady: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10 text-ink">
      <img src="/tuki_logo.png" alt="SHY — Sexual Health for Youth" className="mb-6 h-20 w-20 object-contain" />
      <p className="text-sm font-extrabold uppercase tracking-widest text-ink/60">The play room</p>
      <h1 className="mt-2 text-4xl font-extrabold">Your turn to play.</h1>
      <p className="mt-3 font-semibold text-ink/70">Enter your name and email to get started.</p>
      {localBoothPreview && <p role="note" className="mt-4 rounded-xl bg-yellow-100 p-3 text-sm font-bold">Local preview: use fictional details. Nothing is sent to Supabase. Refreshing clears preview data.</p>}
      <form className="mt-6 space-y-5 rounded-3xl border-[3px] border-ink bg-cream p-6 shadow-chunky" onSubmit={async e => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        try { await registerPlayer(name, email); onReady(); }
        catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
        finally { setBusy(false); }
      }}>
        <div><label htmlFor="player-name" className="mb-2 block font-extrabold">Name</label><input id="player-name" required maxLength={120} pattern=".*\S.*" autoComplete="off" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3" /></div>
        <div><label htmlFor="player-email" className="mb-2 block font-extrabold">Email address</label><input id="player-email" required type="email" maxLength={254} autoComplete="off" autoCapitalize="none" spellCheck={false} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3" /></div>
        {error && <p role="alert" className="font-bold text-red-800">{error}</p>}
        <button disabled={busy} className="min-h-12 w-full rounded-xl border-[3px] border-ink bg-turquoise px-5 py-3 font-extrabold shadow-chunky disabled:opacity-60">{busy ? "Getting ready…" : "Let’s play"}</button>
      </form>
    </main>
  );
}
