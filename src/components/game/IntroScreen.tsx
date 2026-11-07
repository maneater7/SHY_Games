import { ArrowRight } from "lucide-react";
import { Character } from "@/components/Character";
import { ChatBubble } from "@/components/game/ChatBubble";
import { primaryButton } from "@/components/game/ui";

interface IntroScreenProps {
  onBegin: () => void;
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <section className="space-y-8 pov-rise-in">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
        <Character expression="neutral" pose="idle" className="h-44 w-44 shrink-0 sm:h-56 sm:w-56" />
        <ChatBubble live>
          <p>
            Hi, it’s me! I’m the friend who keeps sending you messages. I’m going to share a few things that have been
            on my mind, and I’d love to know how you’d reply. Skip anything you want, there’s no score, and you can
            leave whenever you like.
          </p>
        </ChatBubble>
      </div>

      <div className="flex justify-center sm:justify-end">
        <button type="button" onClick={onBegin} className={primaryButton}>
          Begin
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
