import { colors } from "@/config/theme";

const FLOWERS: { x: number; y: number; color: string }[] = [
  { x: 180, y: 318, color: colors["soft-pink"] },
  { x: 420, y: 330, color: colors.peach },
  { x: 760, y: 322, color: colors["soft-pink"] },
  { x: 1100, y: 334, color: colors.peach },
  { x: 1320, y: 316, color: colors.lavender },
];

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 160 70" aria-hidden="true" className={`pov-float absolute ${className}`}>
      <g fill="#FFFFFF" fillOpacity={0.92}>
        <circle cx="46" cy="44" r="24" />
        <circle cx="86" cy="32" r="30" />
        <circle cx="122" cy="46" r="22" />
        <rect x="22" y="44" width="124" height="24" rx="12" />
      </g>
    </svg>
  );
}

export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky via-turquoise/60 to-cream"
    >
      <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-sun shadow-[0_0_0_20px_rgba(255,212,92,0.35)] sm:h-56 sm:w-56" />
      <Cloud className="left-[4%] top-[14%] w-28 sm:w-40" />
      <Cloud className="right-[12%] top-[34%] w-20 opacity-80 sm:w-28" />
      <svg
        viewBox="0 0 1440 360"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 h-[40vh] w-full"
      >
        <path
          d="M0 200 C240 120 420 120 640 190 S1040 150 1440 170 V360 H0 Z"
          fill={colors["lavender-deep"]}
          fillOpacity={0.55}
        />
        <path d="M0 250 C300 180 560 200 800 250 S1200 220 1440 240 V360 H0 Z" fill={colors.meadow} />
        <path d="M0 300 C360 260 720 300 1080 280 S1380 290 1440 300 V360 H0 Z" fill={colors["meadow-deep"]} />
        {FLOWERS.map((flower) => (
          <circle key={flower.x} cx={flower.x} cy={flower.y} r={8} fill={flower.color} stroke={colors.ink} strokeWidth={3} />
        ))}
      </svg>
    </div>
  );
}
