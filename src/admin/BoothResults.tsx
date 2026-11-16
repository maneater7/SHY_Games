import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { localBoothPreview, localResults, type BoothResult } from "@/lib/booth";
import { GAME_ORDER, gameLabels } from "./labels";

const GAME_COLORS = ["#D7F8F4", "#E7DFFB", "#FFE3DD", "#FFF0BA"];
const gameColor = (gameId: string) => GAME_COLORS[GAME_ORDER.indexOf(gameId)] ?? "#F4ECD9";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" : "") + text.replace(/"/g, '""')}"`;
}
function exportResults(rows: BoothResult[]) {
  const table: unknown[][] = [["Attempt ID", "Name", "Email", "Game", "Completed (UTC)", "Score", "Questions", "Topic", "First answer", "Recommended answer", "Result", "Retried"]];
  for (const r of rows) for (const a of r.answers) {
    const label = gameLabels[r.game_id];
    table.push([r.id, r.name, r.email, label?.title ?? r.game_id, r.completed_at, r.score, r.question_count,
      label?.question[a.question_id] ?? a.question_id,
      a.option_id ? label?.option(a.question_id, a.option_id) ?? a.option_id : "",
      label?.option(a.question_id, a.correct_option_id) ?? a.correct_option_id,
      a.skipped ? "Skipped" : a.is_correct ? "Correct" : "Incorrect", a.retried ? "Yes" : "No"]);
  }
  const url = URL.createObjectURL(new Blob(["\uFEFF", table.map(row => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `shy-completed-games-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BoothResults({ client }: { client?: SupabaseClient }) {
  const [rows, setRows] = useState<BoothResult[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const fetchPage = useCallback(async (offset: number, limit = 100): Promise<BoothResult[]> => {
    if (!client && localBoothPreview) return localResults().slice(offset, offset + limit);
    if (!client) throw new Error("Admin sign-in required.");
    const { data, error } = await client.rpc("admin_booth_results", { p_offset: offset, p_limit: limit });
    if (error) throw new Error(error.message);
    return data ?? [];
  }, [client]);
  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try { setRows(await fetchPage(page * 100)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load results."); }
    finally { setBusy(false); }
  }, [fetchPage, page]);
  useEffect(() => { void load(); }, [load]);
  const exportAll = async () => {
    setBusy(true);
    setError("");
    try {
      const all: BoothResult[] = [];
      for (let offset = 0; ; offset += 500) {
        const batch = await fetchPage(offset, 500);
        all.push(...batch);
        if (batch.length < 500) break;
      }
      exportResults(all);
    } catch (e) { setError(e instanceof Error ? e.message : "Export failed."); }
    finally { setBusy(false); }
  };
  const gameStats = GAME_ORDER.map(id => {
    const g = rows.filter(r => r.game_id === id);
    return {
      id,
      attempts: g.length,
      players: new Set(g.map(r => r.email)).size,
      avg: g.length ? Math.round(g.reduce((s, r) => s + (r.score / r.question_count) * 100, 0) / g.length) : 0,
    };
  });
  const playerGroups = Object.values(rows.reduce<Record<string, BoothResult[]>>((groups, r) => {
    (groups[`${r.name}\n${r.email}`] ??= []).push(r);
    return groups;
  }, {})).sort((a, b) => Math.min(...a.map(r => Date.parse(r.completed_at))) - Math.min(...b.map(r => Date.parse(r.completed_at))));
  const visible = playerGroups.filter(g => `${g[0].name} ${g[0].email}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-6 space-y-6">
    <div className="rounded-3xl border-[3px] border-ink bg-white p-5 shadow-chunky">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-extrabold">Game results</h2><div className="flex items-center gap-3"><button disabled={busy} onClick={() => void load()} className="min-h-11 font-bold underline">Refresh</button><button disabled={busy} onClick={() => void exportAll()} className="min-h-11 rounded-xl border-2 border-ink bg-turquoise px-4 font-bold">Export all CSV</button></div></div>
      <p className="mt-2 text-sm text-ink/70">Completed games only. Scores use first choices; skipped questions earn no points. Each replay is a separate attempt. The CSV contains every completed game for every player and opens in Excel.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{gameStats.map(g => <div key={g.id} className="rounded-2xl border-2 border-ink p-3" style={{ backgroundColor: gameColor(g.id) }}>
        <p className="text-sm font-extrabold leading-tight">{gameLabels[g.id]?.title ?? g.id}</p>
        <p className="mt-2 text-2xl font-extrabold">{g.attempts}</p><p className="text-xs font-bold">completed {g.attempts === 1 ? "run" : "runs"}</p>
        <p className="mt-1 text-xs font-bold">{g.players} {g.players === 1 ? "player" : "players"} · {g.avg}% avg score</p>
      </div>)}</div>
    </div>
    <div className="rounded-3xl border-[3px] border-ink bg-white p-5 shadow-chunky">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-extrabold">Players</h2><input aria-label="Search players by name or email" placeholder="Search name or email…" value={query} onChange={e => setQuery(e.target.value)} className="w-full max-w-56 rounded-xl border-2 border-ink px-3 py-2 text-sm" /></div>
      {error && <p role="alert" className="mt-3 font-bold text-red-800">{error}</p>}
      {busy && <p role="status">Loading…</p>}
      {!busy && !error && rows.length === 0 && <p className="mt-4">No completed games on this page yet.</p>}
      <div className="mt-4 space-y-3">{visible.map((games, i) => { const p = games[0]; return <details key={`${p.name}-${p.email}`} className="rounded-xl border-2 border-ink/20 p-3">
        <summary className="cursor-pointer"><span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-extrabold">{i + 1}</span><strong>{p.name}</strong><span className="ml-2 rounded-full bg-turquoise/60 px-2 py-0.5 text-sm font-bold">{games.length} {games.length === 1 ? "game" : "games"}</span><span className="mt-1 block break-all text-sm">{p.email}</span></summary>
      <div className="mt-3 space-y-2">{games.map(r => <details key={r.id} className="rounded-lg border-2 border-ink/20 p-3" style={{ backgroundColor: gameColor(r.game_id) }}>
        <summary className="cursor-pointer"><strong>{gameLabels[r.game_id]?.title ?? r.game_id}</strong> · <strong>{r.score}/{r.question_count}</strong>{r.skipped > 0 && <span className="text-sm"> · {r.skipped} skipped</span>}<span className="mt-1 block text-sm">{new Date(r.completed_at).toLocaleString()}</span></summary>
        <ul className="mt-3 divide-y divide-ink/10">{r.answers.map(a => { const labels = gameLabels[r.game_id]; return <li key={a.question_id} className="py-3"><p className="font-bold">{labels?.question[a.question_id] ?? a.question_id}</p><p className="text-sm">{a.skipped ? "Skipped" : `${a.is_correct ? "Correct" : "Incorrect"} — ${labels?.option(a.question_id, a.option_id ?? "") ?? a.option_id}`}</p>{!a.is_correct && <p className="text-sm text-ink/70">Recommended: {labels?.option(a.question_id, a.correct_option_id) ?? a.correct_option_id}</p>}</li>; })}</ul>
      </details>)}</div>
    </details>; })}</div>
      <nav aria-label="Results pages" className="mt-4 flex items-center gap-4"><button disabled={busy || page === 0} onClick={() => setPage(p => p - 1)} className="min-h-11 font-bold disabled:opacity-40">Previous</button><span>Page {page + 1}</span><button disabled={busy || rows.length < 100} onClick={() => setPage(p => p + 1)} className="min-h-11 font-bold disabled:opacity-40">Next</button></nav>
    </div>
  </section>;
}
