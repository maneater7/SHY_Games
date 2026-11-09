import type { ReactNode } from "react";
import type { Mood, SceneId } from "@/data/whatWouldYouDoScenarios";
import { colors } from "@/config/theme";
import { Person, type Look } from "./Person";

const INK = colors.ink;

const cast = {
  zack: { outfit: colors.peach, pants: "#38315E", skin: "#D99B6A", hair: INK, style: "spiky" },
  mei: { outfit: colors["soft-pink"], pants: "#3E2F52", skin: "#F1C5A2", hair: "#2A1F1D", style: "long" },
  arun: { outfit: colors.lavender, pants: "#2A224D", skin: "#8C5832", hair: "#1B1733", style: "short" },
  danial: { outfit: colors.turquoise, pants: "#2A224D", skin: "#C68B59", hair: "#1B1733", style: "short" },
  ghost: { outfit: colors.lavender, pants: "#1E1838", skin: "#F5D0B1", hair: "#4B3869", style: "sidepart", extra: "headset" },
  ryan: { outfit: colors["soft-pink"], pants: "#3E2F52", skin: "#8C5832", hair: INK, style: "curls" },
  herbdoc: { outfit: colors.meadow, pants: "#352B57", skin: "#E5A670", hair: "#2A1F1D", style: "long" },
  aina: { outfit: colors.lavender, pants: "#2E244D", skin: "#D99B6A", hair: colors["lavender-deep"], style: "hijab" },
  stranger: { outfit: "#5B5482", pants: "#1E1838", skin: "#C68B59", hair: "#1B1733", style: "short" },
  farah: { outfit: colors.turquoise, pants: "#DEF3EF", skin: "#F5CEB0", hair: "#DCEFEA", style: "hijab", extra: "lanyard" },
  maya: { outfit: colors.peach, pants: INK, skin: "#BB7D4F", hair: "#1A1528", style: "long" },
  clerk: { outfit: "#DEF3EF", pants: "#2C394B", skin: "#AA6E44", hair: "#6B6390", style: "hijab", extra: "lanyard" },
  mystic: { outfit: "#3A2F66", pants: "#1B1630", skin: "#F1C5A2", hair: "#322744", style: "hoodie" },
} satisfies Record<string, Look>;

const MOOD_WORDS: Record<Mood, string> = {
  neutral: "calm",
  pressuring: "pushy",
  concerned: "worried",
  pleased: "pleased",
  thoughtful: "thoughtful",
  surprised: "surprised",
  uneasy: "uneasy",
};

const ARIA: Record<SceneId, (mood: string) => string> = {
  park: (m) => `Zack and two friends in a park. Zack looks ${m}.`,
  "school-fair": (m) => `Danial at a school fair with his arms open for a hug. He looks ${m}.`,
  "gaming-chat": (m) => `Ghost99 on a video call in a gaming chat. They look ${m}.`,
  cafe: (m) => `Ryan at a cafe table. He looks ${m}.`,
  "social-feed": (m) => `A video post from @herbdoc on a phone. They look ${m}.`,
  mall: (m) => `A stranger keeps talking to Aina at a mall. Aina looks ${m}.`,
  "clinic-reception": (m) => `Nurse Farah behind a clinic reception desk. She looks ${m}.`,
  "dusk-bench": (m) => `Maya by a bench at dusk. She looks ${m}.`,
  "clinic-counter": (m) => `A clinic staff member behind a counter. They look ${m}.`,
  "late-night-chat": (m) => `A late-night chat from MysticX on a phone. They look ${m}.`,
};

function Screen({ id, x, y, w, h, r = 10, fill, children }: { id: string; x: number; y: number; w: number; h: number; r?: number; fill: string; children: ReactNode }) {
  return (
    <>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={r} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="2.5">
      <path d="M-25 240 L-5 50 L10 50 L30 240 Z" fill="#6A462F" />
      <circle cx="0" cy="0" r="80" fill="#46996D" />
      <circle cx="-45" cy="35" r="55" fill="#58A87C" />
      <circle cx="45" cy="25" r="58" fill="#75C298" />
    </g>
  );
}

function scene(id: SceneId, mood: Mood): ReactNode {
  const crowdMood: Mood = mood === "pleased" || mood === "pressuring" ? mood : "neutral";

  switch (id) {
    case "park":
      return (
        <>
          <rect width="960" height="540" fill="#BCE6F0" />
          <circle cx="850" cy="90" r="50" fill={colors.sun} opacity="0.85" />
          <path d="M0 320 Q240 250 500 300 T960 290 V540 H0 Z" fill="#75C298" />
          <path d="M0 380 Q320 330 620 380 T960 360 V540 H0 Z" fill="#58A87C" stroke={INK} strokeWidth="3" />
          <Tree x={120} y={170} />
          <g stroke={INK} strokeWidth="2.5">
            <rect x="200" y="350" width="170" height="14" rx="4" fill="#8C5832" />
            <rect x="215" y="364" width="9" height="34" fill="#4B3869" />
            <rect x="345" y="364" width="9" height="34" fill="#4B3869" />
          </g>
          <Person look={cast.mei} mood={crowdMood} x={380} y={175} scale={1.12} bobDelay={400} />
          <Person look={cast.arun} mood={crowdMood} x={480} y={165} scale={1.16} bobDelay={900} flip />
          <Person look={cast.zack} mood={mood} x={610} y={125} scale={1.45} />
        </>
      );

    case "school-fair":
      return (
        <>
          <rect width="960" height="540" fill="#FFF2E5" />
          <g stroke={INK} strokeWidth="3">
            <rect x="80" y="120" width="300" height="230" fill={colors.peach} />
            <polygon points="60,120 230,60 400,120" fill={colors["soft-pink"]} />
            <rect x="120" y="160" width="36" height="52" fill={colors.lavender} strokeWidth="2" />
            <rect x="300" y="160" width="36" height="52" fill={colors.lavender} strokeWidth="2" />
            <rect x="0" y="360" width="960" height="180" fill="#E8D2BE" />
          </g>
          <path d="M30 50 Q480 100 930 50" fill="none" stroke={INK} strokeWidth="2.5" />
          {[[110, colors.turquoise], [230, colors["soft-pink"]], [350, colors.peach], [470, colors.lavender], [590, colors.turquoise], [710, colors["soft-pink"]], [830, colors.peach]].map(([x, fill], i) => (
            <polygon key={i} points={`${x},${58 + i * 2} ${Number(x) + 26},${96} ${Number(x) + 52},${60 + i * 2}`} fill={String(fill)} stroke={INK} strokeWidth="1.5" />
          ))}
          <rect x="110" y="300" width="230" height="78" rx="6" fill={colors.turquoise} stroke={INK} strokeWidth="3" />
          <text x="225" y="346" fontSize="18" fontWeight="900" fill={INK} textAnchor="middle">SCHOOL FAIR</text>
          <Person look={cast.danial} mood={mood} x={600} y={125} scale={1.45} pose="arms-open" />
        </>
      );

    case "gaming-chat":
      return (
        <>
          <rect width="960" height="540" fill="#E4DDF3" />
          <rect x="60" y="70" width="150" height="200" rx="6" fill={colors.lavender} stroke={INK} strokeWidth="2.5" />
          <path d="M90 200 L135 120 L180 200 Z" fill={colors.turquoise} stroke={INK} strokeWidth="2.5" />
          <rect x="0" y="420" width="960" height="120" fill="#B9A9DE" stroke={INK} strokeWidth="3" />
          <rect x="330" y="400" width="620" height="24" rx="6" fill="#8C5832" stroke={INK} strokeWidth="3" />
          <rect x="625" y="372" width="30" height="30" fill={INK} />
          <rect x="380" y="40" width="530" height="336" rx="18" fill="#221A42" stroke={INK} strokeWidth="4" />
          <Screen id="wwyd-call" x={400} y={60} w={300} h={296} fill="#3B2F6B">
            <circle cx="550" cy="180" r="120" fill={colors["lavender-deep"]} opacity="0.5" />
            <Person look={cast.ghost} mood={mood} x={422} y={40} scale={2.15} />
          </Screen>
          <rect x="400" y="60" width="300" height="296" rx="10" fill="none" stroke={colors.turquoise} strokeWidth="3" />
          <rect x="414" y="72" width="96" height="26" rx="13" fill={INK} />
          <text x="462" y="90" fontSize="14" fontWeight="900" fill={colors.turquoise} textAnchor="middle">Ghost99</text>
          <g>
            <rect x="716" y="76" width="176" height="44" rx="12" fill="#3B2F6B" />
            <rect x="740" y="134" width="152" height="44" rx="12" fill={colors.turquoise} />
            <rect x="716" y="192" width="176" height="60" rx="12" fill="#3B2F6B" />
            {[92, 106, 150, 164, 208, 222, 236].map((ly, i) => (
              <rect key={ly} x={i === 2 || i === 3 ? 754 : 730} y={ly} width={i % 2 ? 90 : 130} height="7" rx="3.5" fill={i === 2 || i === 3 ? INK : colors.lavender} opacity="0.8" />
            ))}
          </g>
        </>
      );

    case "cafe":
      return (
        <>
          <rect width="960" height="540" fill="#FAF1E0" />
          <g stroke={INK}>
            <rect x="70" y="65" width="380" height="260" rx="10" fill="#E6F4F1" strokeWidth="3.5" />
            <line x1="260" y1="65" x2="260" y2="325" strokeWidth="2.5" />
            <line x1="70" y1="195" x2="450" y2="195" strokeWidth="2.5" />
            <rect x="0" y="365" width="960" height="175" fill="#D6BDA0" strokeWidth="3" />
            <rect x="290" y="370" width="20" height="80" fill="#8C5832" strokeWidth="2.5" />
            <ellipse cx="300" cy="372" rx="150" ry="34" fill={colors.cream} strokeWidth="3.5" />
            <rect x="240" y="338" width="24" height="28" rx="4" fill={colors["soft-pink"]} strokeWidth="2" />
            <rect x="335" y="338" width="24" height="28" rx="4" fill={colors.turquoise} strokeWidth="2" />
          </g>
          <path d="M248 330 Q252 318 248 308 M343 330 Q347 318 343 308" {...{ stroke: INK, strokeWidth: 2, fill: "none", strokeLinecap: "round" }} opacity="0.5" />
          <Person look={cast.ryan} mood={mood} x={600} y={125} scale={1.45} />
        </>
      );

    case "social-feed":
      return (
        <>
          <rect width="960" height="540" fill="#ECE5F5" />
          <rect x="70" y="70" width="160" height="200" rx="6" fill={colors.peach} stroke={INK} strokeWidth="2.5" />
          {[110, 140, 170, 200, 230].map((ly) => (
            <rect key={ly} x="92" y={ly} width="116" height="10" rx="5" fill={INK} opacity="0.18" />
          ))}
          <rect x="0" y="380" width="960" height="160" fill="#CFC0B0" stroke={INK} strokeWidth="3" />
          <rect x="560" y="10" width="260" height="470" rx="32" fill={colors.cream} stroke={INK} strokeWidth="4" />
          <Screen id="wwyd-feed" x={576} y={38} w={228} h={414} r={18} fill="#BCE6F0">
            <rect x="576" y="300" width="228" height="152" fill={colors.meadow} />
            <Person look={cast.herbdoc} mood={mood} x={566} y={58} scale={2.05} />
            <rect x="576" y="372" width="228" height="80" fill={INK} opacity="0.75" />
          </Screen>
          <text x="590" y="402" fontSize="15" fontWeight="900" fill={colors.cream}>@herbdoc</text>
          <text x="590" y="428" fontSize="14" fontWeight="700" fill={colors.cream}>cleared it in 3 days!!</text>
          <g fill={colors.cream} stroke={INK} strokeWidth="2.5">
            <circle cx="782" cy="250" r="15" />
            <circle cx="782" cy="306" r="15" />
          </g>
          <path d="M782 258 L774 250 Q770 243 776 241 Q781 240 782 245 Q783 240 788 241 Q794 243 790 250 Z" fill={colors["soft-pink"]} stroke={INK} strokeWidth="1.8" />
          <rect x="774" y="299" width="16" height="12" rx="4" fill="none" stroke={INK} strokeWidth="2" />
          <text x="782" y="282" fontSize="11" fontWeight="900" fill={INK} textAnchor="middle">14k</text>
        </>
      );

    case "mall":
      return (
        <>
          <rect width="960" height="540" fill="#EDF1F5" />
          <g stroke={INK}>
            <rect x="60" y="70" width="230" height="250" fill="#FFF" strokeWidth="3" />
            <rect x="80" y="90" width="190" height="40" rx="6" fill={colors.lavender} strokeWidth="2" />
            <polygon points="300,365 450,150 520,150 370,365" fill="#CBD5E1" strokeWidth="2.5" />
            <rect x="0" y="365" width="960" height="175" fill="#DEE5ED" strokeWidth="3" />
          </g>
          <text x="175" y="117" fontSize="17" fontWeight="900" fill={INK} textAnchor="middle">LEVEL 2</text>
          <line x1="292" y1="355" x2="442" y2="140" stroke={colors.turquoise} strokeWidth="5" strokeLinecap="round" />
          <Person look={cast.stranger} mood="pressuring" x={430} y={140} scale={1.38} />
          <Person look={cast.aina} mood={mood} x={630} y={130} scale={1.4} flip />
        </>
      );

    case "clinic-reception":
      return (
        <>
          <rect width="960" height="540" fill="#E7F7F4" />
          <rect x="60" y="60" width="270" height="105" rx="10" fill="#FFF" stroke={INK} strokeWidth="3" />
          <rect x="80" y="92" width="38" height="38" rx="7" fill={colors.turquoise} stroke={INK} strokeWidth="2" />
          <path d="M99 100 V122 M88 111 H110" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <text x="216" y="108" fontSize="17" fontWeight="900" textAnchor="middle" fill={INK}>YOUTH CLINIC</text>
          <text x="216" y="130" fontSize="13" fontWeight="700" textAnchor="middle" fill={INK}>Walk-ins welcome</text>
          <rect x="0" y="365" width="960" height="175" fill="#CFEDE6" stroke={INK} strokeWidth="3" />
          <Person look={cast.farah} mood={mood} x={555} y={62} scale={1.7} />
          <rect x="380" y="300" width="520" height="260" rx="10" fill="#FFF" stroke={INK} strokeWidth="3.5" />
          <rect x="400" y="320" width="130" height="12" rx="6" fill={colors.lavender} />
          <rect x="400" y="342" width="90" height="12" rx="6" fill={colors.turquoise} opacity="0.7" />
        </>
      );

    case "dusk-bench":
      return (
        <>
          <defs>
            <linearGradient id="wwyd-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FCB4A6" />
              <stop offset="0.6" stopColor="#C5A3CF" />
              <stop offset="1" stopColor="#8E86B5" />
            </linearGradient>
          </defs>
          <rect width="960" height="540" fill="url(#wwyd-dusk)" />
          <circle cx="300" cy="150" r="60" fill={colors.peach} opacity="0.7" />
          <path d="M0 350 Q400 310 960 340 V540 H0 Z" fill="#6E6896" stroke={INK} strokeWidth="3" />
          <path d="M120 420 L180 190 L200 190 L240 420 Z" fill="#4A4370" />
          <circle cx="195" cy="150" r="100" fill="#524A7D" />
          <g stroke={INK} strokeWidth="2.5">
            <rect x="290" y="360" width="210" height="16" rx="4" fill="#B58156" />
            <rect x="310" y="376" width="10" height="36" fill={INK} />
            <rect x="470" y="376" width="10" height="36" fill={INK} />
          </g>
          <Person look={cast.maya} mood={mood} x={600} y={125} scale={1.45} />
        </>
      );

    case "clinic-counter":
      return (
        <>
          <rect width="960" height="540" fill="#FFFDF8" />
          <rect x="50" y="55" width="300" height="230" rx="10" fill="#E6F2F7" stroke={INK} strokeWidth="3.5" />
          <line x1="200" y1="55" x2="200" y2="285" stroke={INK} strokeWidth="2.5" />
          <rect x="0" y="365" width="960" height="175" fill="#E6DCD0" stroke={INK} strokeWidth="3" />
          <rect x="450" y="40" width="440" height="40" rx="8" fill={colors.peach} stroke={INK} strokeWidth="2.5" />
          <text x="670" y="67" fontSize="16" fontWeight="900" fill={INK} textAnchor="middle">HEALTH ENQUIRIES</text>
          <Person look={cast.clerk} mood={mood} x={570} y={92} scale={1.7} />
          <rect x="440" y="310" width="460" height="230" fill="#D8CBBB" stroke={INK} strokeWidth="3.5" />
          <rect x="440" y="300" width="460" height="22" rx="6" fill="#FFF" stroke={INK} strokeWidth="3" />
        </>
      );

    case "late-night-chat":
      return (
        <>
          <rect width="960" height="540" fill="#1E1838" />
          <rect x="60" y="60" width="230" height="230" rx="12" fill="#2A2350" stroke={colors.lavender} strokeWidth="3" />
          <line x1="175" y1="60" x2="175" y2="290" stroke={colors.lavender} strokeWidth="2" />
          <circle cx="240" cy="120" r="28" fill={colors.peach} />
          <circle cx="252" cy="112" r="24" fill="#2A2350" />
          <rect x="0" y="380" width="960" height="160" fill="#140F28" />
          <rect x="40" y="350" width="380" height="80" rx="16" fill="#3A2F66" stroke={INK} strokeWidth="3" />
          <rect x="60" y="326" width="110" height="44" rx="18" fill="#C7B9EC" stroke={INK} strokeWidth="3" />
          <path d="M190 352 Q300 336 410 352" fill="none" stroke={colors.lavender} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <rect x="560" y="22" width="260" height="500" rx="32" fill="#2A2350" stroke={colors.lavender} strokeWidth="4" />
          <rect x="576" y="52" width="228" height="440" rx="18" fill="#15112A" />
          <Screen id="wwyd-avatar" x={640} y={70} w={100} h={100} r={50} fill={colors["lavender-deep"]}>
            <Person look={cast.mystic} mood={mood} x={628} y={28} scale={1.45} />
          </Screen>
          <circle cx="690" cy="120" r="50" fill="none" stroke={colors.lavender} strokeWidth="3" />
          <text x="690" y="198" fontSize="16" fontWeight="900" fill={colors.cream} textAnchor="middle">MysticX</text>
          <text x="690" y="218" fontSize="11" fontWeight="700" fill={colors.turquoise} textAnchor="middle">online now</text>
          <rect x="592" y="240" width="160" height="38" rx="14" fill="#3A2F66" />
          <text x="606" y="264" fontSize="13" fontWeight="700" fill={colors.cream}>let’s meet tonight</text>
          <rect x="592" y="290" width="186" height="38" rx="14" fill="#3A2F66" />
          <text x="606" y="314" fontSize="13" fontWeight="700" fill={colors.cream}>just us two. don’t tell</text>
          <rect x="592" y="340" width="96" height="38" rx="14" fill="#3A2F66" />
          <text x="606" y="364" fontSize="13" fontWeight="700" fill={colors.cream}>anyone ok?</text>
          <g fill={colors.lavender}>
            <circle cx="612" cy="410" r="5" />
            <circle cx="628" cy="410" r="5" opacity="0.7" />
            <circle cx="644" cy="410" r="5" opacity="0.4" />
          </g>
        </>
      );
  }
}

export function SceneArt({ id, mood }: { id: SceneId; mood: Mood }) {
  return (
    <svg
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={ARIA[id](MOOD_WORDS[mood])}
      className="block h-full w-full select-none"
    >
      {scene(id, mood)}
    </svg>
  );
}

export function CastLineup() {
  return (
    <svg viewBox="0 0 960 400" role="img" aria-label="Some of the people you will meet in this game" className="block h-auto w-full select-none">
      <rect width="960" height="400" fill="#BCE6F0" />
      <circle cx="840" cy="80" r="46" fill={colors.sun} />
      <path d="M0 250 Q260 190 520 240 T960 220 V400 H0 Z" fill="#75C298" />
      <path d="M0 300 Q300 262 620 300 T960 286 V400 H0 Z" fill="#58A87C" stroke={INK} strokeWidth="3" />
      <Person look={cast.maya} mood="neutral" x={90} y={88} scale={1.15} bobDelay={0} />
      <Person look={cast.danial} mood="pleased" x={250} y={74} scale={1.2} bobDelay={500} />
      <Person look={cast.aina} mood="thoughtful" x={410} y={66} scale={1.24} bobDelay={1100} />
      <Person look={cast.ryan} mood="neutral" x={570} y={74} scale={1.2} bobDelay={300} flip />
      <Person look={cast.farah} mood="pleased" x={730} y={88} scale={1.15} bobDelay={800} flip />
    </svg>
  );
}
