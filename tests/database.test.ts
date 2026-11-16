import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { questions as povQuestions } from "../src/data/questions.ts";
import { questions as mythQuestions } from "../src/data/mythOrFactQuestions.ts";
import { scenarios as wwydScenarios } from "../src/data/whatWouldYouDoScenarios.ts";

// Runs the real migrations on an in-process Postgres with a minimal stand-in for Supabase's
// roles, auth schema and default privileges, then attacks it the way the public anon key could.

const MIGRATIONS = new URL("../supabase/migrations/", import.meta.url);
const ADMIN_ID = "00000000-0000-4000-8000-000000000001";
const OTHER_ID = "00000000-0000-4000-8000-000000000002";

const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.jwt() returns jsonb language sql stable as
    $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
  grant usage on schema public, auth to anon, authenticated;
  grant execute on all functions in schema auth to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`;

function redFlagCatalog() {
  const html = readFileSync(new URL("../public/games/game3/code.js", import.meta.url), "utf8");
  return [...html.matchAll(/"id": "(s\d+)",[\s\S]*?"correct": "(green|yellow|red)"/g)].map(([, id, correct]) => ({ id, correct }));
}

const expectedCatalog: Record<string, { question: string; options: string[]; best: string }[]> = {
  "pov-friend-texted-you-this": povQuestions.map((q) => ({
    question: q.id,
    options: q.options.map((o) => o.id),
    best: q.options.find((o) => o.isHelpful)!.id,
  })),
  "myth-or-fact": mythQuestions.map((q) => ({ question: q.id, options: ["myth", "fact"], best: q.correctAnswer })),
  "red-or-green-flag": redFlagCatalog().map((s) => ({ question: s.id, options: ["green", "yellow", "red"], best: s.correct })),
  "what-would-you-do": wwydScenarios.map((s) => ({
    question: s.id,
    options: s.options.map((o) => o.id),
    best: s.options.find((o) => o.isBest)!.id,
  })),
};

let db: PGlite;

async function as<T>(role: "anon" | "authenticated", claims: object, sql: string, params: unknown[] = []) {
  await db.exec(`set role ${role}`);
  await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify(claims)]);
  try {
    return (await db.query<T>(sql, params)).rows;
  } finally {
    await db.exec("reset role");
  }
}

const anon = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => as<T>("anon", { role: "anon" }, sql, params);

function fullRun(gameId: string, pick: "best" | "first" = "best", skip: string[] = [], retried: string[] = []) {
  const answers = expectedCatalog[gameId]
    .filter((q) => !skip.includes(q.question))
    .map((q) => ({ question_id: q.question, option_id: pick === "best" ? q.best : q.options[0] }));
  return [gameId, JSON.stringify(answers), skip, retried];
}

const submit = (args: unknown[]) =>
  anon<{ r: { recorded: boolean } }>("select public.submit_game_run($1, $2::jsonb, $3, $4) as r", args);

before(async () => {
  db = new PGlite();
  await db.exec(SUPABASE_STUB);
  for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(new URL(file, MIGRATIONS), "utf8"));
  }
  await db.query("insert into auth.users (id, email) values ($1, 'admin@shy.test'), ($2, 'someone@shy.test')", [ADMIN_ID, OTHER_ID]);
  await db.query("insert into shy_private.shy_admins (user_id, note) values ($1, 'test admin')", [ADMIN_ID]);
});

describe("migration file", () => {
  const sql = readFileSync(new URL("20261108000000_shy_analytics_all_games.sql", MIGRATIONS), "utf8");

  test("locks down tables, schema and every function", () => {
    assert.ok(sql.includes("revoke all on all tables in schema shy_private"));
    assert.ok(sql.includes("revoke all on schema shy_private from public"));
    for (const fn of ["take_rate_slot", "is_admin"]) {
      assert.ok(sql.includes(`revoke all on function shy_private.${fn}`));
    }
    for (const fn of ["record_game_start", "submit_game_run", "record_game_exit", "admin_game_stats", "admin_check"]) {
      assert.ok(sql.includes(`revoke all on function public.${fn}`));
    }
    // Only the three write functions may be callable by players.
    assert.ok(sql.includes("grant execute on function public.record_game_start(text) to anon, authenticated"));
    assert.ok(sql.includes("grant execute on function public.submit_game_run(text, jsonb, text[], text[]) to anon, authenticated"));
    assert.ok(sql.includes("grant execute on function public.record_game_exit(text, text) to anon, authenticated"));
    assert.doesNotMatch(sql, /grant execute on function public\.admin_game_stats.* to anon/);
    assert.ok(sql.includes("grant execute on function public.admin_game_stats() to authenticated"));
    assert.ok(sql.includes("grant execute on function public.admin_check() to authenticated"));
    assert.doesNotMatch(sql, /grant execute on function public\.admin_check.* to anon/);
  });
});

describe("catalog", () => {
  test("database answer catalog matches every game's frontend content", async () => {
    const rows = (
      await db.query<{ game_id: string; question_id: string; answer_option_id: string; is_best: boolean }>(
        "select game_id, question_id, answer_option_id, is_best from shy_private.shy_game_answer_options",
      )
    ).rows;
    for (const [gameId, questions] of Object.entries(expectedCatalog)) {
      assert.ok(questions.length >= 10, `${gameId} has content`);
      for (const q of questions) {
        const options = rows.filter((r) => r.game_id === gameId && r.question_id === q.question);
        assert.deepEqual(options.map((o) => o.answer_option_id).sort(), [...q.options].sort(), `${gameId}/${q.question} options`);
        assert.deepEqual(options.filter((o) => o.is_best).map((o) => o.answer_option_id), [q.best], `${gameId}/${q.question} best`);
      }
      const dbQuestions = new Set(rows.filter((r) => r.game_id === gameId).map((r) => r.question_id));
      assert.equal(dbQuestions.size, questions.length, `${gameId} question count`);
    }
  });
});

describe("public anon key", () => {
  test("cannot read or write any table directly", async () => {
    const tables = (
      await db.query<{ t: string }>(
        "select table_schema || '.' || table_name as t from information_schema.tables where table_name like 'shy_%'",
      )
    ).rows.map((r) => r.t);
    assert.ok(tables.length >= 9);
    assert.ok(tables.every((t) => t.startsWith("shy_private.")), `no shy tables left in public: ${tables}`);
    for (const table of tables) {
      await assert.rejects(anon(`select * from ${table}`), /permission denied/, `select ${table}`);
      await assert.rejects(anon(`delete from ${table}`), /permission denied/, `delete ${table}`);
    }
  });

  test("cannot call internal helpers or the admin report", async () => {
    await assert.rejects(anon("select shy_private.is_admin()"), /permission denied/);
    await assert.rejects(anon("select shy_private.take_rate_slot('x', 1)"), /permission denied/);
    await assert.rejects(anon("select public.admin_game_stats()"), /permission denied/);
  });

  test("only approved write and admin functions are exposed", async () => {
    const callable = (
      await db.query<{ name: string }>(
        `select p.proname as name from pg_proc p join pg_namespace n on n.oid = p.pronamespace
         where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute') order by 1`,
      )
    ).rows.map((r) => r.name);
    assert.deepEqual(callable, ["record_booth_start", "record_game_exit", "record_game_start", "register_booth_player", "submit_booth_run", "submit_game_run"]);
    const callableByAuthed = (
      await db.query<{ name: string }>(
        `select p.proname as name from pg_proc p join pg_namespace n on n.oid = p.pronamespace
         where n.nspname = 'public' and has_function_privilege('authenticated', p.oid, 'execute') order by 1`,
      )
    ).rows.map((r) => r.name);
    assert.deepEqual(callableByAuthed, ["admin_booth_results", "admin_check", "admin_game_stats", "record_game_exit", "record_game_start", "submit_game_run"]);
  });
});

describe("write API", () => {
  test("records starts and rejects unknown games", async () => {
    for (const gameId of Object.keys(expectedCatalog)) {
      const [{ r }] = await anon<{ r: { recorded: boolean } }>("select public.record_game_start($1) as r", [gameId]);
      assert.equal(r.recorded, true);
    }
    await assert.rejects(anon("select public.record_game_start('not-a-game')"), /Unknown game/);
  });

  test("accepts a complete run for every game", async () => {
    for (const gameId of Object.keys(expectedCatalog)) {
      const first = expectedCatalog[gameId][0].question;
      const [{ r }] = await submit(fullRun(gameId, "best", [expectedCatalog[gameId][1].question], [first]));
      assert.equal(r.recorded, true, gameId);
    }
  });

  test("one session id counts one player, dedupes starts, and tallies repeat responses", async () => {
    const [g, answers, skipped, retried] = fullRun("pov-friend-texted-you-this");
    const sid = "a0a0a0a0-b1b1-c2c2-d3d3-e4e4e4e4e4e4";
    await anon("select public.record_game_start($1, $2) as r", [g, sid]);
    await anon("select public.record_game_start($1, $2) as r", [g, sid]);
    await anon("select public.submit_game_run($1, $2::jsonb, $3, $4, $5) as r", [g, answers, skipped, retried, sid]);
    await anon("select public.submit_game_run($1, $2::jsonb, $3, $4, $5) as r", [g, answers, skipped, retried, sid]);

    const [{ c }] = (
      await db.query<{ c: number }>("select completions::int as c from shy_private.shy_game_sessions where game_id = $1 and session_id = $2", [g, sid])
    ).rows;
    assert.equal(c, 2, "two responses from one session");

    const [{ s }] = await as<{ s: { game_id: string; starts: number; unique_players: number; repeat_responses: number }[] }>(
      "authenticated",
      { role: "authenticated", sub: ADMIN_ID, aal: "aal1" },
      "select public.admin_game_stats() as s",
    );
    const pov = s.find((x) => x.game_id === g)!;
    assert.equal(pov.unique_players, 1);
    assert.equal(pov.repeat_responses, 1);
    assert.equal(pov.starts, 2, "first start plus one deduped session");
  });

  test("hides per-question detail below the privacy floor, then reveals it at ten finishes", async () => {
    const report = () =>
      as<{ s: { game_id: string; question_detail_available: boolean; questions: unknown[] }[] }>(
        "authenticated",
        { role: "authenticated", sub: ADMIN_ID, aal: "aal1" },
        "select public.admin_game_stats() as s",
      );
    const [{ s: low }] = await report();
    for (const g of low) {
      assert.equal(g.question_detail_available, false, g.game_id);
      assert.deepEqual(g.questions, []);
    }
    for (const gameId of Object.keys(expectedCatalog)) {
      for (let i = 0; i < 9; i++) {
        const [{ r }] = await submit(fullRun(gameId, "best"));
        assert.equal(r.recorded, true, `${gameId} run ${i + 2}`);
      }
    }
    const [{ s: full }] = await report();
    for (const g of full) {
      assert.equal(g.question_detail_available, true, g.game_id);
    }
  });

  test("rejects malformed or forged runs", async () => {
    const g = "what-would-you-do";
    const cases: [string, unknown[]][] = [
      ["option from another question", [g, JSON.stringify(expectedCatalog[g].map((q, i) => ({ question_id: q.question, option_id: i === 0 ? "s2-a" : q.best }))), [], []]],
      ["missing a question", [g, JSON.stringify(expectedCatalog[g].slice(1).map((q) => ({ question_id: q.question, option_id: q.best }))), [], []]],
      ["answered and skipped", [g, JSON.parse(JSON.stringify(fullRun(g)))[1], ["s1"], []]],
      ["duplicate answers", [g, JSON.stringify([...Array(10)].map(() => ({ question_id: "s1", option_id: "s1-a" }))), [], []]],
      ["retry of a skipped question", fullRun(g, "best", ["s3"], ["s3"])],
      ["not an array", [g, JSON.stringify({ question_id: "s1" }), [], []]],
      ["non-object items", [g, JSON.stringify(["s1-a"]), [], []]],
      ["oversized payload", [g, JSON.stringify([...Array(5000)].map((_, i) => ({ question_id: `x${i}`, option_id: "y" }))), [], []]],
      ["unknown skipped id", [g, JSON.stringify(expectedCatalog[g].slice(1).map((q) => ({ question_id: q.question, option_id: q.best }))), ["s99"], []]],
      ["sql in ids", [g, JSON.stringify([{ question_id: "s1'; drop table shy_private.shy_admins; --", option_id: "s1-a" }]), [], []]],
      ["unknown game", ["drop-tables", "[]", [], []]],
    ];
    for (const [label, args] of cases) {
      await assert.rejects(submit(args), /Invalid|Duplicate|Unknown|must|Retries/, label);
    }
    const [{ n }] = (await db.query<{ n: number }>("select count(*)::int as n from shy_private.shy_admins")).rows;
    assert.equal(n, 1);
  });

  test("exits must point at a real question", async () => {
    const [{ r }] = await anon<{ r: { recorded: boolean } }>("select public.record_game_exit('myth-or-fact', 'q5') as r");
    assert.equal(r.recorded, true);
    await assert.rejects(anon("select public.record_game_exit('myth-or-fact', 's5')"), /Unknown/);
  });

  test("a shared ceiling stops floods of submissions", async () => {
    const g = "red-or-green-flag";
    let accepted = 0;
    let limited = 0;
    for (let i = 0; i < 510; i++) {
      const [{ r }] = await submit(fullRun(g, "first"));
      if (r.recorded) accepted++;
      else limited++;
    }
    assert.equal(accepted, 490, "500 per window, ten already used earlier");
    assert.equal(limited, 20);
  });
});

describe("admin report", () => {
  type Stats = { game_id: string; starts: number; completions: number; question_detail_available: boolean; questions: { question_id: string; skips: number; retries: number; exits: number; options: { option_id: string; is_best: boolean; count: number }[] }[] }[];
  const stats = (claims: object) => as<{ s: Stats }>("authenticated", claims, "select public.admin_game_stats() as s");

  test("refuses signed-in users who are not admins", async () => {
    await assert.rejects(stats({ role: "authenticated", sub: OTHER_ID, aal: "aal2" }), /Not authorized/);
    await assert.rejects(stats({ role: "authenticated", sub: OTHER_ID }), /Not authorized/);
  });

  test("admin_check passes allow-listed admins only", async () => {
    const [{ ok }] = await as<{ ok: boolean }>("authenticated", { role: "authenticated", sub: ADMIN_ID }, "select public.admin_check() as ok");
    assert.equal(ok, true);
    const [{ ok: nope }] = await as<{ ok: boolean }>("authenticated", { role: "authenticated", sub: OTHER_ID }, "select public.admin_check() as ok");
    assert.equal(nope, false);
    await assert.rejects(anon("select public.admin_check()"), /permission denied/);
  });


  test("returns correct aggregates to an allow-listed admin", async () => {
    const [{ s }] = await stats({ role: "authenticated", sub: ADMIN_ID, aal: "aal1" });
    assert.deepEqual(s.map((g) => g.game_id).sort(), Object.keys(expectedCatalog).sort());

    const wwyd = s.find((g) => g.game_id === "what-would-you-do")!;
    assert.equal(wwyd.starts, 1);
    assert.equal(wwyd.completions, 10);
    assert.deepEqual(wwyd.questions.map((q) => q.question_id), wwydScenarios.map((x) => x.id));
    const s1 = wwyd.questions[0];
    assert.equal(s1.retries, 1);
    assert.deepEqual(s1.options.find((o) => o.is_best), { option_id: "s1-c", is_best: true, count: 10 });
    assert.equal(wwyd.questions[1].skips, 1);

    const flags = s.find((g) => g.game_id === "red-or-green-flag")!;
    assert.equal(flags.completions, 500);

    const myth = s.find((g) => g.game_id === "myth-or-fact")!;
    assert.equal(myth.questions.find((q) => q.question_id === "q5")!.exits, 1);
  });
});

describe("individual booth results", () => {
  const token = "11111111-1111-4111-8111-111111111111";
  const tokenB = "22222222-2222-4222-8222-222222222222";
  const run = "33333333-3333-4333-8333-333333333333";
  const register = (t: string, name = "Fictional Student", email = "student@example.test") =>
    anon("select public.register_booth_player($1::uuid, $2, $3)", [t, name, email]);
  const finish = (t: string, id: string, answers = fullRun("myth-or-fact")) =>
    anon("select public.submit_booth_run($1::uuid,$2::uuid,$3,$4::jsonb,$5,$6)", [t, id, ...answers]);

  test("validates registration and never exposes identities to public clients", async () => {
    await assert.rejects(register(token, " "), /valid name/);
    await assert.rejects(register(token, "Student", "not-an-email"), /valid name/);
    await register(token);
    await register(token);
    await register(tokenB, "Another Student", "another@example.test");
    await assert.rejects(register(token, "Someone else"), /could not be saved/);
    await assert.rejects(anon("select * from shy_private.booth_players"), /permission denied/);
    await assert.rejects(anon("select public.admin_booth_results()"), /permission denied/);
    await assert.rejects(as("authenticated", { sub: OTHER_ID }, "select public.admin_booth_results()"), /Not authorized/);
  });

  test("saves completed games once, calculates scores server-side, and keeps players separate", async () => {
    await assert.rejects(finish(OTHER_ID, run), /Register before/);
    await assert.rejects(finish(token, run, ["myth-or-fact", "[]", [], []]), /every question/);
    const args = fullRun("myth-or-fact", "best", ["q12"]);
    const values = JSON.parse(args[1] as string);
    values[0].option_id = "myth";
    args[1] = JSON.stringify(values);
    await finish(token, run, args);
    await finish(token, run, args);
    await assert.rejects(finish(tokenB, run, args), /Invalid attempt/);
    const [{ r }] = await as<{ r: { name: string; score: number; question_count: number; skipped: number; answers: { question_id: string; skipped: boolean }[] }[] }>("authenticated", { sub: ADMIN_ID }, "select public.admin_booth_results() as r");
    assert.equal(r.length, 1);
    assert.equal(r[0].name, "Fictional Student");
    assert.equal(r[0].score, 10);
    assert.equal(r[0].question_count, 12);
    assert.equal(r[0].skipped, 1);
    assert.equal(r[0].answers.find(q => q.question_id === "q12")!.skipped, true);
    await finish(tokenB, "44444444-4444-4444-8444-444444444444");
    const [{ n }] = await db.query<{ n: number }>("select count(*)::int n from shy_private.booth_runs").then(r => r.rows);
    assert.equal(n, 2);
    await assert.rejects(anon("select * from shy_private.booth_runs"), /permission denied/);
  });

  test("keeps separate completed games and replays without storing unfinished attempts", async () => {
    await anon("select public.record_booth_start($1::uuid, 'what-would-you-do')", [token]);
    const before = (await db.query<{ n: number }>("select count(*)::int n from shy_private.booth_runs")).rows[0].n;
    await anon("select public.record_booth_start($1::uuid, 'pov-friend-texted-you-this')", [token]);
    await finish(token, "55555555-5555-4555-8555-555555555555", fullRun("pov-friend-texted-you-this"));
    await finish(token, "66666666-6666-4666-8666-666666666666", fullRun("pov-friend-texted-you-this"));
    const [{ n }] = (await db.query<{ n: number }>("select count(*)::int n from shy_private.booth_runs")).rows;
    assert.equal(n, before + 2);
    const [{ r }] = await as<{ r: { game_id: string }[] }>("authenticated", { sub: ADMIN_ID }, "select public.admin_booth_results(0,500) as r");
    assert.equal(r.filter(x => x.game_id === "pov-friend-texted-you-this").length, 2);
    assert.equal(r.filter(x => x.game_id === "what-would-you-do").length, 0);
    await assert.rejects(as("authenticated", { sub: ADMIN_ID }, "select * from shy_private.booth_runs"), /permission denied/);
  });
});
