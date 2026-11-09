interface CapybaraProps {
  happy?: boolean;
  holdingCard?: boolean;
}

export function Capybara({ happy = false, holdingCard = false }: CapybaraProps) {
  return (
    <svg viewBox="0 0 260 250" role={holdingCard ? undefined : "img"} aria-hidden={holdingCard || undefined} aria-label={holdingCard ? undefined : "Your friendly capybara guide"} className="capybara-illustration shared-capybara">
      <ellipse cx="130" cy="235" rx="98" ry="10" fill="#2B2350" opacity="0.1" />
      <g stroke="#2B2350" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M64 226C53 193 58 144 82 124H178C202 144 207 193 196 226Z" fill="#B9804E" />
        <ellipse cx="83" cy="226" rx="27" ry="12" fill="#8A5832" />
        <ellipse cx="177" cy="226" rx="27" ry="12" fill="#8A5832" />
        <ellipse cx="77" cy="48" rx="19" ry="24" fill="#B9804E" transform="rotate(-22 77 48)" />
        <ellipse cx="183" cy="48" rx="19" ry="24" fill="#B9804E" transform="rotate(22 183 48)" />
        <path d="M70 48Q77 34 85 48M175 48Q183 34 190 48" fill="none" stroke="#8A5832" />
        <path d="M54 89C54 52 83 39 130 39S206 52 206 89V116C206 148 180 162 130 162S54 148 54 116Z" fill="#B9804E" />
        <ellipse cx="130" cy="119" rx="63" ry="36" fill="#E9B98A" />
        {happy ? (
          <path d="M82 84Q90 73 98 84M162 84Q170 73 178 84" fill="none" />
        ) : (
          <g fill="#2B2350" stroke="none"><ellipse cx="90" cy="82" rx="4" ry="6" /><ellipse cx="170" cy="82" rx="4" ry="6" /></g>
        )}
        <ellipse cx="130" cy="106" rx="12" ry="8" fill="#8A5832" />
        <path d="M130 114V126M116 126Q130 137 144 126" fill="none" />
        <path d="M73 110H85M175 110H187" stroke="#D99579" strokeWidth="7" />
        {holdingCard && <rect x="47" y="163" width="166" height="62" rx="13" fill="currentColor" />}
        <ellipse cx={holdingCard ? 52 : 80} cy={holdingCard ? 180 : 195} rx="15" ry="20" fill="#B9804E" transform={`rotate(-18 ${holdingCard ? 52 : 80} ${holdingCard ? 180 : 195})`} />
        <ellipse cx={holdingCard ? 208 : 180} cy={holdingCard ? 180 : 195} rx="15" ry="20" fill="#B9804E" transform={`rotate(18 ${holdingCard ? 208 : 180} ${holdingCard ? 180 : 195})`} />
      </g>
    </svg>
  );
}

export function CapybaraCard({ label, happy = false }: { label: string; happy?: boolean }) {
  return <span className="capybara-card"><Capybara happy={happy} holdingCard /><span className="capybara-sign">{label}</span></span>;
}
