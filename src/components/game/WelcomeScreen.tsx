import { ArrowRight, Info } from "lucide-react";
import { Character } from "@/components/Character";
import { panel, primaryButton } from "@/components/game/ui";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="flex flex-col items-center pov-rise-in pt-2 text-center sm:pt-8">
      <Character expression="happy" pose="idle" className="h-56 w-56 sm:h-72 sm:w-72" />

      <p className="-rotate-2 rounded-full border-[3px] border-ink bg-peach px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-chunky-sm">
        SHY · Sexual Health for Youth
      </p>

      <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-6xl">
        POV: Your Friend Texted You This
      </h1>

      <p className="mt-4 max-w-md text-lg font-semibold leading-relaxed">
        Read a few messages from a friend, choose how you would reply, and see how your reply might land.
      </p>

      <div className={`${panel()} mt-8 flex max-w-md gap-3 text-left text-sm font-semibold leading-relaxed`}>
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          This game touches on pressure, private images, health stigma, and feeling lonely. You can skip any
          question, or leave at any time.
        </p>
      </div>

      <button type="button" onClick={onStart} className={`${primaryButton} mt-8 text-xl`}>
        Start Game
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </button>
    </section>
  );
}
