import { LifeBuoy, UserRound } from "lucide-react";
import { PEER_ADVOCATE_URL, supportResources } from "@/config/supportResources";
import { panel, primaryButton } from "@/components/game/ui";

export function SupportPanel() {
  return (
    <section aria-labelledby="support-heading" className={`${panel("bg-soft-pink")} pov-rise-in space-y-4`}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-cream">
          <LifeBuoy className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 id="support-heading" className="text-xl font-extrabold">
          Support is close by
        </h2>
      </div>
      <p className="font-semibold leading-relaxed">
        If you or someone you know feels unsafe or deeply hopeless, it’s okay to reach out to someone you trust, a
        counsellor, or another qualified support person.
      </p>
      {supportResources.length > 0 && (
        <ul className="space-y-3">
          {supportResources.map((resource) => (
            <li key={resource.name} className="rounded-2xl border-2 border-ink bg-cream p-4">
              <p className="font-extrabold">{resource.name}</p>
              <p className="text-sm leading-relaxed">{resource.description}</p>
              {resource.href && (
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-bold underline underline-offset-4"
                >
                  Visit resource
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      <a href={PEER_ADVOCATE_URL} target="_blank" rel="noopener noreferrer" className={primaryButton}>
        <UserRound className="h-5 w-5" aria-hidden="true" />
        Talk to a SHY Peer Advocate
      </a>
    </section>
  );
}
