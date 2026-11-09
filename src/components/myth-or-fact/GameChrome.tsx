export function Brand() {
  return (
    <div className="brand standard-brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      </span>
      <span className="brand-name"><strong>SHY</strong><small>Sexual Health for Youth</small></span>
    </div>
  );
}

export function NavigationIcon({ exit = false }: { exit?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="navigation-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {exit ? <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" /> : <path d="m12 19-7-7 7-7M5 12h14" />}
    </svg>
  );
}

export function PondBackdrop() {
  return (
    <div className="pond-backdrop" aria-hidden="true">
      <span className="pond-sun" />
      <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className="pond-scene">
        <defs>
          <linearGradient id="pond-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7FDCD8" />
            <stop offset="0.45" stopColor="#4EC9D4" />
            <stop offset="1" stopColor="#2E9DB2" />
          </linearGradient>
          <linearGradient id="pond-reflection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD45C" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFD45C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* distant tree line */}
        <path d="M0 232C40 218 70 224 95 214C120 204 150 212 175 208C205 202 235 212 265 208C300 200 330 214 365 210C400 202 430 216 470 212C510 204 545 218 590 214C640 206 690 220 740 216C800 208 860 222 920 218C980 210 1040 224 1100 220C1160 212 1220 224 1280 222C1330 218 1390 226 1440 224V260H0Z" fill="#5FA968" />
        <path d="M0 246C180 240 340 246 520 244C700 240 880 248 1060 246C1220 242 1340 248 1440 246V272H0Z" fill="#4E9457" />

        {/* water */}
        <rect x="0" y="258" width="1440" height="102" fill="url(#pond-water)" />
        <path d="M0 258H1440" stroke="#2B2350" strokeWidth="3" strokeLinecap="round" />

        {/* sun reflection */}
        <path d="M990 258L1040 360H870L940 258Z" fill="url(#pond-reflection)" />
        <path d="M920 275Q965 268 1010 275M900 295Q960 286 1020 295M880 320Q955 310 1030 320" stroke="#FFE9B0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* water ripples */}
        <path d="M60 290Q140 284 220 290M330 305Q420 298 510 305M620 285Q700 279 780 285M1180 305Q1270 298 1360 305M150 335Q240 328 330 335M480 340Q570 333 660 340" stroke="#3AA9BC" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />

        {/* lily pads */}
        <g>
          <ellipse cx="450" cy="308" rx="30" ry="9" fill="#5FBF77" stroke="#2B2350" strokeWidth="3" />
          <path d="M450 308L470 302" stroke="#2B2350" strokeWidth="2.5" />
          <circle cx="448" cy="297" r="6" fill="#F7B8D0" stroke="#2B2350" strokeWidth="2.5" />
          <ellipse cx="1250" cy="322" rx="26" ry="8" fill="#5FBF77" stroke="#2B2350" strokeWidth="3" />
          <path d="M1250 322L1232 318" stroke="#2B2350" strokeWidth="2.5" />
          <ellipse cx="820" cy="300" rx="20" ry="6" fill="#5FBF77" stroke="#2B2350" strokeWidth="3" />
        </g>

        {/* capybara dam: woven sticks at the waterline */}
        <g transform="translate(360,0)" stroke="#2B2350" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="160" y="246" width="150" height="12" rx="6" fill="#8A5832" transform="rotate(-7 235 252)" />
          <rect x="165" y="258" width="140" height="12" rx="6" fill="#A97143" transform="rotate(6 235 264)" />
          <rect x="168" y="250" width="135" height="11" rx="5.5" fill="#B9804E" transform="rotate(-2 235 256)" />
          <rect x="172" y="264" width="128" height="11" rx="5.5" fill="#8A5832" transform="rotate(-4 236 270)" />
          <rect x="175" y="242" width="120" height="10" rx="5" fill="#C98F5E" transform="rotate(4 235 247)" />
          <rect x="182" y="270" width="110" height="10" rx="5" fill="#A97143" transform="rotate(-9 237 275)" />
          <path d="M180 236L232 218L288 236" fill="none" />
          <path d="M195 230L228 220L265 232" fill="none" />
          <circle cx="232" cy="216" r="5" fill="#8A5832" />
        </g>
        {/* dam waterline base */}
        <path d="M510 278Q595 272 680 278" stroke="#2E9DB2" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* capybara wading at the shore, side profile */}
        <g transform="translate(-160,0)" stroke="#2B2350" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* body */}
          <path d="M1080 302C1080 284 1098 272 1130 270C1162 268 1185 276 1190 292C1194 304 1188 314 1172 318L1096 320C1086 316 1080 310 1080 302Z" fill="#B9804E" />
          {/* head */}
          <path d="M1050 290C1050 278 1060 270 1074 270C1088 270 1098 278 1098 290C1098 302 1088 310 1074 310C1060 310 1050 302 1050 290Z" fill="#B9804E" />
          {/* muzzle */}
          <ellipse cx="1062" cy="298" rx="14" ry="9" fill="#E9B98A" />
          {/* nose + mouth */}
          <ellipse cx="1055" cy="295" rx="4" ry="3" fill="#2B2350" stroke="none" />
          <path d="M1058 302Q1064 305 1070 302" fill="none" strokeWidth="2.5" />
          {/* ear */}
          <path d="M1078 272Q1076 262 1086 262Q1094 262 1092 272" fill="#8A5832" />
          {/* eye */}
          <circle cx="1078" cy="288" r="3" fill="#2B2350" stroke="none" />
          {/* waterline across legs */}
          <path d="M1044 318Q1130 312 1200 316" stroke="#3AA9BC" strokeWidth="10" fill="none" opacity="0.9" />
        </g>
        {/* capybara reflection */}
        <ellipse cx="965" cy="330" rx="70" ry="8" fill="#2E9DB2" opacity="0.5" />

        {/* reeds by the shore */}
        <g transform="translate(340,0)" stroke="#4a7c41" strokeWidth="4" strokeLinecap="round">
          <path d="M60 258C58 238 56 226 52 212" />
          <path d="M74 258C74 240 76 228 80 214" />
          <path d="M88 258C90 242 94 230 100 218" />
        </g>
        <g transform="translate(340,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M52 212Q46 220 54 226M80 214Q74 222 82 228" stroke="#4a7c41" strokeWidth="3" fill="none" />
          <ellipse cx="52" cy="208" rx="6" ry="14" fill="#8A5832" stroke="#2B2350" strokeWidth="3" />
          <ellipse cx="80" cy="210" rx="6" ry="14" fill="#8A5832" stroke="#2B2350" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export function WorldBackdrop() {
  return (
    <div className="world-backdrop" aria-hidden="true">
      <span className="world-sun" />
      <svg viewBox="0 0 160 70" className="world-cloud cloud-left"><g fill="white" fillOpacity="0.92"><circle cx="46" cy="44" r="24" /><circle cx="86" cy="32" r="30" /><circle cx="122" cy="46" r="22" /><rect x="22" y="44" width="124" height="24" rx="12" /></g></svg>
      <svg viewBox="0 0 160 70" className="world-cloud cloud-right"><g fill="white" fillOpacity="0.85"><circle cx="46" cy="44" r="24" /><circle cx="86" cy="32" r="30" /><circle cx="122" cy="46" r="22" /><rect x="22" y="44" width="124" height="24" rx="12" /></g></svg>
      <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className="world-hills">
        <path d="M0 200C240 120 420 120 640 190S1040 150 1440 170V360H0Z" fill="#8F78E0" fillOpacity="0.55" />
        <path d="M0 250C300 180 560 200 800 250S1200 220 1440 240V360H0Z" fill="#9BE7A0" />
        <path d="M0 300C360 260 720 300 1080 280S1380 290 1440 300V360H0Z" fill="#6FCB87" />
        {[180, 420, 760, 1100, 1320].map((x, index) => <circle key={x} cx={x} cy={318 + index * 3} r="8" fill={index % 2 ? "#FFE0A8" : "#F7B8D0"} stroke="#2B2350" strokeWidth="3" />)}
      </svg>
    </div>
  );
}
