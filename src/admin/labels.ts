import { questions as povQuestions } from "@/data/questions";
import { questions as mythQuestions } from "@/data/mythOrFactQuestions";
import { scenarios } from "@/data/whatWouldYouDoScenarios";

export interface GameLabels {
  title: string;
  question: Record<string, string>;
  option: (questionId: string, optionId: string) => string;
}

const letter = (optionId: string) => optionId.slice(-1).toUpperCase();

const redFlagTitles: Record<string, string> = {
  s1: "Asking before a hug",
  s2: "Joking after being asked to stop",
  s3: "Going quiet when upset",
  s4: "“Prove you trust me”",
  s5: "Respecting topics you don’t want to discuss",
  s6: "Time with friends",
  s7: "Changing your mind",
  s8: "Asking before sharing",
  s9: "Personal questions from someone online",
  s10: "Choosing where to meet",
};

const optionText = (list: { id: string; options: { id: string; text: string }[] }[]) => (questionId: string, optionId: string) =>
  `${letter(optionId)}. ${list.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId)?.text ?? optionId}`;

export const gameLabels: Record<string, GameLabels> = {
  "pov-friend-texted-you-this": {
    title: "POV: Your Friend Texted You This",
    question: Object.fromEntries(povQuestions.map((q) => [q.id, q.topic])),
    option: optionText(povQuestions),
  },
  "myth-or-fact": {
    title: "Myth or Fact?",
    question: Object.fromEntries(mythQuestions.map((q) => [q.id, q.statement])),
    option: (_, optionId) => (optionId === "myth" ? "Myth" : "Fact"),
  },
  "red-or-green-flag": {
    title: "Red Flag or Green Flag?",
    question: redFlagTitles,
    option: (_, optionId) => `${optionId[0].toUpperCase()}${optionId.slice(1)} flag`,
  },
  "what-would-you-do": {
    title: "What Would You Do?",
    question: Object.fromEntries(scenarios.map((s) => [s.id, s.topic])),
    option: optionText(scenarios),
  },
};

export const GAME_ORDER = ["pov-friend-texted-you-this", "myth-or-fact", "red-or-green-flag", "what-would-you-do"];
