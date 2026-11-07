import type { Expression } from "@/data/questions";
import { characterColors, colors } from "@/config/theme";

export type CharacterPose = "idle" | "hop" | "lean" | "cheer";

interface CharacterProps {
  expression: Expression;
  pose?: CharacterPose;
  className?: string;
}

const LABELS: Record<Expression, string> = {
  neutral: "Capybara friend, calm",
  worried: "Capybara friend, nervous",
  upset: "Capybara friend, sad",
  relieved: "Capybara friend, relieved",
  happy: "Capybara friend, happy",
  thoughtful: "Capybara friend, thoughtful",
};

const POSE_CLASS: Record<CharacterPose, string> = {
  idle: "pov-bob",
  hop: "pov-hop",
  lean: "pov-lean",
  cheer: "pov-hop pov-cheer",
};

const INK = colors.ink;
const EYE_X = [88, 152];
const LINE = {
  fill: "none",
  stroke: INK,
  strokeWidth: 5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const OUTLINE = { stroke: INK, strokeWidth: 6 } as const;
const THIN = { stroke: INK, strokeWidth: 4 } as const;

function RoundEyes({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
  return (
    <g className="pov-blink">
      {EYE_X.map((x) => (
        <g key={x}>
          <circle cx={x + dx} cy={98 + dy} r={10} fill={INK} />
          <circle cx={x + dx + 3.5} cy={94 + dy} r={3.5} fill="#FFFFFF" />
        </g>
      ))}
    </g>
  );
}

function Blush() {
  return (
    <>
      <ellipse cx={68} cy={126} rx={10} ry={6} fill={colors["soft-pink"]} />
      <ellipse cx={172} cy={126} rx={10} ry={6} fill={colors["soft-pink"]} />
    </>
  );
}

function Face({ expression }: { expression: Expression }) {
  switch (expression) {
    case "neutral":
      return (
        <>
          <RoundEyes />
          <path d="M106 150 Q120 158 134 150" {...LINE} />
        </>
      );
    case "worried":
      return (
        <>
          <path d="M74 82 Q84 70 96 82" {...THIN} strokeLinecap="round" fill="none" />
          <path d="M144 82 Q156 70 166 82" {...THIN} strokeLinecap="round" fill="none" />
          <RoundEyes dx={-3} dy={-1} />
          <path
            d="M182 74 Q190 88 182 96 Q174 88 182 74 Z"
            fill={colors.turquoise}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d="M104 152 L110 146 L116 152 L122 146 L128 152 L134 146" {...THIN} fill="none" />
        </>
      );
    case "upset":
      return (
        <>
          <path d="M74 80 L96 90" {...THIN} strokeLinecap="round" />
          <path d="M166 80 L144 90" {...THIN} strokeLinecap="round" />
          <RoundEyes dy={2} />
          <path
            d="M92 112 Q98 122 92 128 Q86 122 92 112 Z"
            fill={colors.turquoise}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d="M106 160 Q120 146 134 160" {...LINE} />
        </>
      );
    case "relieved":
      return (
        <>
          <Blush />
          <path d="M78 100 Q88 92 98 100" {...LINE} />
          <path d="M142 100 Q152 92 162 100" {...LINE} />
          <path d="M108 150 Q120 160 132 150" {...LINE} />
        </>
      );
    case "happy":
      return (
        <>
          <Blush />
          <path d="M76 102 Q88 88 100 102" {...LINE} />
          <path d="M140 102 Q152 88 164 102" {...LINE} />
          <path d="M104 146 Q120 172 136 146 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={120} cy={160} rx={7} ry={4} fill={colors["soft-pink"]} />
          <path
            d="M204 46 L207 56 L217 59 L207 62 L204 72 L201 62 L191 59 L201 56 Z"
            fill={colors.sun}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </>
      );
    case "thoughtful":
      return (
        <>
          <path d="M140 84 Q154 72 166 82" {...THIN} strokeLinecap="round" fill="none" />
          <RoundEyes dx={3} dy={-3} />
          <path d="M112 152 L128 148" {...LINE} />
          <circle cx={200} cy={92} r={4} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={214} cy={76} r={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        </>
      );
  }
}

export function Character({ expression, pose = "idle", className }: CharacterProps) {
  const { fur, furDark, muzzle } = characterColors;
  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={LABELS[expression]}
      className={`${POSE_CLASS[pose]} ${className ?? ""}`}
    >
      <ellipse cx="120" cy="192" rx="86" ry="44" fill={fur} {...OUTLINE} />
      <ellipse cx="88" cy="228" rx="16" ry="9" fill={furDark} {...OUTLINE} />
      <ellipse cx="152" cy="228" rx="16" ry="9" fill={furDark} {...OUTLINE} />
      <circle cx="72" cy="62" r="14" fill={furDark} {...OUTLINE} />
      <circle cx="168" cy="62" r="14" fill={furDark} {...OUTLINE} />
      <rect x="46" y="56" width="148" height="118" rx="54" fill={fur} {...OUTLINE} />
      <rect x="86" y="118" width="68" height="46" rx="23" fill={muzzle} {...THIN} />
      <circle cx="108" cy="128" r="3" fill={INK} />
      <circle cx="132" cy="128" r="3" fill={INK} />
      <Face expression={expression} />
      <ellipse className="pov-paw pov-paw-left" cx="78" cy="198" rx="15" ry="11" fill={furDark} {...OUTLINE} />
      <ellipse className="pov-paw pov-paw-right" cx="162" cy="198" rx="15" ry="11" fill={furDark} {...OUTLINE} />
    </svg>
  );
}
