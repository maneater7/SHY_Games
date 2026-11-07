export const optionTones = ["bg-turquoise", "bg-lavender", "bg-soft-pink"] as const;

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-turquoise px-7 py-3.5 text-lg font-extrabold text-ink shadow-chunky transition duration-150 hover:brightness-110 motion-safe:hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-none";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-chunky-sm transition duration-150 hover:bg-peach active:translate-y-[4px] active:shadow-none";

export const skipButton =
  "inline-flex items-center gap-2 rounded-full border-2 border-dashed border-ink/60 bg-white/60 px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink hover:bg-white active:scale-95";

export const optionCard = (tone: string) =>
  `group flex w-full items-center gap-4 rounded-3xl border-[3px] border-ink px-4 py-4 text-left text-base font-bold leading-snug text-ink shadow-chunky transition duration-150 hover:brightness-105 motion-safe:hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-none sm:px-5 sm:py-5 ${tone}`;

export const panel = (tone = "bg-cream") =>
  `rounded-3xl border-[3px] border-ink p-5 shadow-chunky sm:p-6 ${tone}`;

export const chip =
  "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold text-ink";

export const badge =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-cream text-sm font-extrabold";
