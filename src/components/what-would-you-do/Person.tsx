import type { Mood } from "@/data/whatWouldYouDoScenarios";
import { colors } from "@/config/theme";

export type HairStyle = "short" | "spiky" | "sidepart" | "curls" | "long" | "hoodie" | "hijab";

export interface Look {
  outfit: string;
  pants: string;
  skin: string;
  hair: string;
  style: HairStyle;
  extra?: "headset" | "lanyard";
}

interface PersonProps {
  look: Look;
  mood: Mood;
  x: number;
  y: number;
  scale?: number;
  pose?: "idle" | "arms-open";
  flip?: boolean;
  bobDelay?: number;
}

const INK = colors.ink;
const STROKE = { stroke: INK, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

function RoundEyes({ big = false, sleepy = false }: { big?: boolean; sleepy?: boolean }) {
  const ry = big ? 6 : sleepy ? 2.6 : 4.5;
  return (
    <g className="pov-blink">
      <ellipse cx="48" cy="62" rx={big ? 4.5 : 3.5} ry={ry} fill={INK} />
      <ellipse cx="72" cy="62" rx={big ? 4.5 : 3.5} ry={ry} fill={INK} />
      {!sleepy && (
        <>
          <circle cx="49.5" cy="60" r="1.6" fill="#FFF" />
          <circle cx="73.5" cy="60" r="1.6" fill="#FFF" />
        </>
      )}
    </g>
  );
}

function Face({ mood }: { mood: Mood }) {
  switch (mood) {
    case "pressuring":
      return (
        <>
          <path d="M38 50 Q47 54 55 57 M65 57 Q73 54 82 50" {...STROKE} strokeWidth="3" />
          <RoundEyes sleepy />
          <path d="M48 83 Q62 88 73 78" {...STROKE} strokeWidth="2.8" />
        </>
      );
    case "concerned":
      return (
        <>
          <path d="M40 56 Q47 50 55 51 M65 51 Q73 50 80 56" {...STROKE} strokeWidth="2.6" />
          <RoundEyes />
          <path d="M49 86 Q60 79 71 86" {...STROKE} strokeWidth="2.6" />
        </>
      );
    case "pleased":
      return (
        <>
          <path d="M40 50 Q48 46 56 50 M64 50 Q72 46 80 50" {...STROKE} strokeWidth="2.6" />
          <path d="M42 63 Q48 57 54 63 M66 63 Q72 57 78 63" {...STROKE} strokeWidth="3" />
          <path d="M46 78 Q60 92 74 78" {...STROKE} strokeWidth="2.8" />
          <circle cx="41" cy="71" r="5" fill={colors["soft-pink"]} opacity="0.75" />
          <circle cx="79" cy="71" r="5" fill={colors["soft-pink"]} opacity="0.75" />
        </>
      );
    case "thoughtful":
      return (
        <>
          <path d="M40 54 Q48 52 56 55 M64 49 Q72 46 80 51" {...STROKE} strokeWidth="2.6" />
          <RoundEyes />
          <path d="M51 83 Q60 81 69 82" {...STROKE} strokeWidth="2.6" />
        </>
      );
    case "surprised":
      return (
        <>
          <path d="M38 46 Q47 41 56 46 M64 46 Q73 41 82 46" {...STROKE} strokeWidth="2.6" />
          <RoundEyes big />
          <ellipse cx="60" cy="84" rx="5.5" ry="7" fill={INK} />
        </>
      );
    case "uneasy":
      return (
        <>
          <path d="M40 55 Q47 49 55 52 M65 52 Q73 49 80 55" {...STROKE} strokeWidth="2.6" />
          <RoundEyes />
          <path d="M49 85 Q53 81 57 85 Q61 89 65 85 Q68 82 71 85" {...STROKE} strokeWidth="2.4" />
          <path d="M88 44 Q93 52 88 56 Q83 52 88 44 Z" fill={colors.sky} stroke={INK} strokeWidth="1.8" />
        </>
      );
    default:
      return (
        <>
          <path d="M40 54 Q48 50 56 54 M64 54 Q72 50 80 54" {...STROKE} strokeWidth="2.6" />
          <RoundEyes />
          <path d="M50 82 Q60 87 70 82" {...STROKE} strokeWidth="2.6" />
        </>
      );
  }
}

function HairBack({ look }: { look: Look }) {
  const { hair, style, outfit } = look;
  switch (style) {
    case "long":
      return <path d="M28 64 C24 26 96 26 92 64 L97 116 Q60 124 23 116 Z" fill={hair} stroke={INK} strokeWidth="3" />;
    case "curls":
      return (
        <g fill={hair} stroke={INK} strokeWidth="2.5">
          {[[34, 50], [44, 36], [60, 31], [76, 36], [86, 50], [30, 66], [90, 66]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="12" />
          ))}
        </g>
      );
    case "hoodie":
      return <path d="M22 72 C20 20 100 20 98 72 L100 118 L20 118 Z" fill={outfit} stroke={INK} strokeWidth="3" />;
    case "hijab":
      return <path d="M26 62 C26 26 94 26 94 62 C94 94 88 126 78 134 L42 134 C32 126 26 94 26 62 Z" fill={hair} stroke={INK} strokeWidth="3" />;
    default:
      return <ellipse cx="60" cy="46" rx="31" ry="25" fill={hair} stroke={INK} strokeWidth="3" />;
  }
}

function HairFront({ look }: { look: Look }) {
  const { hair, style } = look;
  switch (style) {
    case "spiky":
      return <path d="M30 56 L35 30 L45 43 L51 24 L61 41 L69 24 L76 41 L86 30 L90 56 C78 45 42 45 30 56 Z" fill={hair} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
    case "sidepart":
      return <path d="M31 60 C33 30 86 28 90 54 C80 42 58 40 31 60 Z" fill={hair} stroke={INK} strokeWidth="2.5" />;
    case "curls":
      return (
        <g fill={hair} stroke={INK} strokeWidth="2.5">
          <circle cx="44" cy="44" r="9" />
          <circle cx="60" cy="40" r="10" />
          <circle cx="76" cy="44" r="9" />
        </g>
      );
    case "long":
      return <path d="M32 58 C36 30 84 30 88 58 C80 46 70 42 60 50 C50 42 40 46 32 58 Z" fill={hair} stroke={INK} strokeWidth="2.5" />;
    case "hoodie":
      return <path d="M36 50 C44 38 76 38 84 50 C74 46 46 46 36 50 Z" fill={hair} />;
    case "hijab":
      return <path d="M36 50 C44 36 76 36 84 50" fill="none" stroke={INK} strokeWidth="2.5" />;
    default:
      return <path d="M32 54 C42 34 78 34 88 54 C76 44 44 44 32 54 Z" fill={hair} stroke={INK} strokeWidth="2.5" />;
  }
}

export function Person({ look, mood, x, y, scale = 1, pose = "idle", flip = false, bobDelay = 0 }: PersonProps) {
  const hijab = look.style === "hijab";
  const transform = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})${flip ? " translate(-120 0)" : ""}`;

  return (
    <g transform={transform}>
      <ellipse cx="60" cy="244" rx="44" ry="8" fill={INK} opacity="0.22" />
      <g className="pov-bob" style={{ animationDelay: `${bobDelay}ms` }}>
        <path d="M38 180 V234 H48 V180 M72 180 V234 H82 V180" fill={look.pants} stroke={INK} strokeWidth="2.5" />
        <path d="M33 234 H49 Q53 243 43 243 H33 Z M67 234 H83 Q87 243 77 243 H67 Z" fill={INK} />

        <path d="M26 116 Q60 106 94 116 L102 186 L18 186 Z" fill={look.outfit} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {!hijab && <path d="M50 115 L60 128 L70 115" fill={colors.cream} stroke={INK} strokeWidth="2" />}
        {look.extra === "lanyard" && (
          <>
            <path d="M48 116 L60 146 L72 116" {...STROKE} strokeWidth="2.5" />
            <rect x="52" y="144" width="16" height="20" rx="3" fill={colors.cream} stroke={INK} strokeWidth="2" />
          </>
        )}

        {pose === "arms-open" ? (
          <>
            <path d="M25 122 Q4 126 -14 112 M95 122 Q116 126 134 112" {...STROKE} strokeWidth="3" />
            <circle cx="-15" cy="110" r="6" fill={look.skin} stroke={INK} strokeWidth="2" />
            <circle cx="135" cy="110" r="6" fill={look.skin} stroke={INK} strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M24 122 Q10 152 18 180 M96 122 Q110 152 102 180" {...STROKE} strokeWidth="3" />
            <circle cx="18" cy="180" r="6" fill={look.skin} stroke={INK} strokeWidth="2" />
            <circle cx="102" cy="180" r="6" fill={look.skin} stroke={INK} strokeWidth="2" />
          </>
        )}

        <HairBack look={look} />
        {!hijab && <rect x="52" y="86" width="16" height="22" rx="4" fill={look.skin} stroke={INK} strokeWidth="2" />}
        {!hijab && look.style !== "hoodie" && (
          <>
            <circle cx="34" cy="68" r="5" fill={look.skin} stroke={INK} strokeWidth="2" />
            <circle cx="86" cy="68" r="5" fill={look.skin} stroke={INK} strokeWidth="2" />
          </>
        )}
        <ellipse cx="60" cy="66" rx={hijab ? 24 : 26} ry="28" fill={look.skin} stroke={INK} strokeWidth="3" />
        <HairFront look={look} />
        {look.extra === "headset" && (
          <>
            <path d="M28 64 C26 26 94 26 92 64" {...STROKE} strokeWidth="4" />
            <rect x="22" y="58" width="11" height="18" rx="5" fill={colors.turquoise} stroke={INK} strokeWidth="2" />
            <rect x="87" y="58" width="11" height="18" rx="5" fill={colors.turquoise} stroke={INK} strokeWidth="2" />
            <path d="M28 76 Q32 92 46 90" {...STROKE} strokeWidth="2.5" />
          </>
        )}

        <g key={mood} className="wwyd-face-pop">
          <Face mood={mood} />
          <path d="M60 66 L57 72 L63 72" {...STROKE} strokeWidth="2" />
        </g>
      </g>
    </g>
  );
}
