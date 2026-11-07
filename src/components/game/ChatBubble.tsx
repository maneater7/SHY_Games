import type { ReactNode } from "react";

interface ChatBubbleProps {
  children: ReactNode;
  live?: boolean;
}

export function ChatBubble({ children, live = false }: ChatBubbleProps) {
  return (
    <div className="pov-pop relative min-w-0 flex-1">
      <span className="mb-2 inline-block rounded-full border-2 border-ink bg-turquoise px-3 py-0.5 text-xs font-extrabold">
        Your friend
      </span>
      <div
        aria-live={live ? "polite" : undefined}
        className="relative rounded-3xl border-[3px] border-ink bg-cream px-5 py-4 text-lg font-semibold leading-relaxed shadow-chunky-sm"
      >
        {children}
        <span
          aria-hidden="true"
          className="absolute -left-[11px] top-8 h-5 w-5 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-cream"
        />
      </div>
    </div>
  );
}

export function PlayerBubble({ children }: { children: ReactNode }) {
  return (
    <div className="pov-pop flex max-w-[85%] flex-col items-end self-end">
      <span className="mb-2 inline-block rounded-full border-2 border-ink bg-peach px-3 py-0.5 text-xs font-extrabold">
        You replied
      </span>
      <div className="relative rounded-3xl border-[3px] border-ink bg-lavender px-5 py-4 text-base font-bold leading-relaxed shadow-chunky-sm">
        {children}
      </div>
    </div>
  );
}
