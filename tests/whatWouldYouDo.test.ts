import { test } from "node:test";
import assert from "node:assert/strict";
import { scenarios } from "../src/data/whatWouldYouDoScenarios.ts";
import { createInitialState, gameReducer, startRun, summarize, type GameState } from "../src/game/whatWouldYouDoState.ts";

const bestId = (index: number) => scenarios[index].options.find((option) => option.isBest)!.id;
const otherId = (index: number) => scenarios[index].options.find((option) => !option.isBest)!.id;
const canonicalRun = () => ({ ...startRun(), sequence: scenarios.map((scenario) => scenario.id) });

test("scenario content is complete and safe to shuffle", () => {
  assert.equal(scenarios.length, 10);
  const optionIds = new Set<string>();
  for (const scenario of scenarios) {
    assert.equal(scenario.options.length, 3, scenario.id);
    assert.equal(scenario.options.filter((option) => option.isBest).length, 1, scenario.id);
    for (const option of scenario.options) {
      assert.ok(!optionIds.has(option.id), `duplicate option id ${option.id}`);
      optionIds.add(option.id);
      if (!option.isBest) assert.ok(option.whyNot, `${option.id} needs a whyNot`);
      // Options are shuffled, so feedback must never point at a letter position.
      assert.doesNotMatch(
        option.whyNot ?? "",
        /^[BC]\b|\b[ABC] (and|or) [ABC]\b|^A (sets|avoids|leaves|puts|gives|adds|risks|seeks|could|means|relies|delays|breaks|accepts|goes)\b/,
        option.id,
      );
    }
    const copy = [scenario.situation, scenario.explanation, scenario.takeaway, ...scenario.options.map((o) => o.text)];
    for (const text of copy) assert.doesNotMatch(text, /\[|\]/, `placeholder left in ${scenario.id}`);
  }
});

test("a new run shuffles options and scenario order without losing any", () => {
  const state = startRun(() => 0);
  assert.deepEqual(state.phase, { name: "scene", index: 0 });
  assert.deepEqual([...state.sequence].sort(), scenarios.map((scenario) => scenario.id).sort());
  for (const scenario of scenarios) {
    const shuffled = state.orders[scenario.id].map((option) => option.id).sort();
    assert.deepEqual(shuffled, scenario.options.map((option) => option.id).sort());
  }
});

test("only the first choice counts, but players can try other moves", () => {
  let state = canonicalRun();
  state = gameReducer(state, { type: "choose", optionId: otherId(0) });
  assert.deepEqual(state.phase, { name: "outcome", index: 0, chosenId: otherId(0) });
  state = gameReducer(state, { type: "retry" });
  state = gameReducer(state, { type: "choose", optionId: bestId(0) });
  assert.equal(state.firstChoices.s1, otherId(0));
  assert.equal(state.phase.name === "outcome" && state.phase.chosenId, bestId(0));
  state = gameReducer(gameReducer(state, { type: "retry" }), { type: "choose", optionId: otherId(0) });
  assert.deepEqual(state.retried, ["s1"], "retries are counted once per scenario");
});

test("skipping is blocked once a scenario has been answered", () => {
  let state = canonicalRun();
  state = gameReducer(state, { type: "choose", optionId: bestId(0) });
  state = gameReducer(state, { type: "retry" });
  const before = state;
  state = gameReducer(state, { type: "skip" });
  assert.equal(state, before);
});

test("options from another scenario are rejected", () => {
  const state = canonicalRun();
  assert.equal(gameReducer(state, { type: "choose", optionId: bestId(3) }), state);
});

test("a full run reaches the summary with correct counts", () => {
  let state: GameState = canonicalRun();
  scenarios.forEach((_, index) => {
    if (index === 2) {
      state = gameReducer(state, { type: "skip" });
      return;
    }
    state = gameReducer(state, { type: "choose", optionId: index % 2 ? otherId(index) : bestId(index) });
    state = gameReducer(state, { type: "next" });
  });
  assert.deepEqual(state.phase, { name: "complete" });
  assert.deepEqual(state.skipped, ["s3"]);
  assert.deepEqual(summarize(state), { answered: 9, skipped: 1, safest: 4 });
});

test("exit resets everything", () => {
  const state = gameReducer(startRun(), { type: "exit" });
  assert.deepEqual(state, createInitialState());
});
