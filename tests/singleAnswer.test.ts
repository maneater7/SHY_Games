import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { createInitialState as povInitial, gameReducer as povReducer, questionAt } from "../src/game/gameState.ts";
import { createInitialState as mythInitial, gameReducer as mythReducer } from "../src/game/mythOrFactState.ts";

test("POV keeps the original wrong answer and does not reopen feedback", () => {
  let state = povReducer(povReducer(povInitial(), { type: "newGame" }), { type: "begin" });
  const question = questionAt(state, 0);
  const wrong = question.options.find(o => !o.isHelpful)!;
  const best = question.options.find(o => o.isHelpful)!;
  state = povReducer(state, { type: "answer", questionId: question.id, optionId: wrong.id });
  assert.equal(povReducer(state, { type: "tryAgain" }), state);
  assert.equal(povReducer(state, { type: "begin" }), state);
  assert.equal(povReducer(state, { type: "answer", questionId: question.id, optionId: best.id }), state);
  assert.equal(povReducer(state, { type: "skip", questionId: question.id }), state);
  assert.equal(state.firstChoices[question.id], wrong.id);
  assert.equal(povReducer(state, { type: "continue" }).phase.name, "scenario");
});

test("POV rejects stale question IDs and invalid options", () => {
  const state = povReducer(povReducer(povInitial(), { type: "newGame" }), { type: "begin" });
  const question = questionAt(state, 0);
  assert.equal(povReducer(state, { type: "answer", questionId: question.id, optionId: "invalid" }), state);
  assert.equal(povReducer(state, { type: "skip", questionId: "other-question" }), state);
  assert.equal(povReducer(state, { type: "answer", questionId: "other-question", optionId: question.options[0].id }), state);
});

test("Myth or Fact allows only one answer before continuing", () => {
  let state = mythReducer(mythInitial(), { type: "start" });
  const id = state.questionOrder[0];
  state = mythReducer(state, { type: "answer", answer: "myth" });
  assert.equal(mythReducer(state, { type: "answer", answer: "fact" }), state);
  assert.equal(mythReducer(state, { type: "skip" }), state);
  assert.equal(state.answers[id], "myth");
  assert.equal(mythReducer(state, { type: "continue" }).currentIndex, 1);
});

test("Red Flag locks the first classification even if another event fires", () => {
  const source = readFileSync(new URL("../public/games/game3/code.js", import.meta.url), "utf8");
  const body = source.slice(source.indexOf("    function handleClassification("), source.indexOf("    function handleSkip("));
  const answers: Record<string, { chosen: string; isCorrect: boolean }> = {};
  let hidden = false;
  const classify = runInNewContext(`${body}; handleClassification;`, {
    currentIndex: 0,
    gameScenarios: [{ id: "s1", correct: "green" }],
    userAnswers: answers,
    screenPlay: { classList: { contains: () => hidden } },
    screenFeedback: {},
    document: { getElementById: () => null },
    window: {},
    renderFeedback: () => {},
    showScreen: () => { hidden = true; },
    triggerDuckRain: () => {},
  });
  classify("red");
  classify("green");
  hidden = false;
  classify("green");
  assert.equal(answers.s1.chosen, "red");
  assert.equal(answers.s1.isCorrect, false);
});
