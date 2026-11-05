// The Austin Candy Trail cast: native Texas animals drawn as candy characters.
// Each one is drawn standing on y = 0 (fliers are centered on 0, 0), facing right.

const INK = '#5a2a4a';
const CHEEK = '#ff6f9f';

// Gradients shared by every character. Rendered once inside the board's <defs>.
export function CharacterDefs() {
  return (
    <>
      <radialGradient id="dilloSkin" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#ffd9c0" />
        <stop offset="1" stopColor="#d48a68" />
      </radialGradient>
      <linearGradient id="dilloShell" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffc2da" />
        <stop offset="1" stopColor="#e2588f" />
      </linearGradient>
      <radialGradient id="rrBody" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#d9a3e6" />
        <stop offset="1" stopColor="#6b2579" />
      </radialGradient>
      <radialGradient id="salBody" cx="0.4" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#c8fff0" />
        <stop offset="0.6" stopColor="#6fd8c6" />
        <stop offset="1" stopColor="#2a9f92" />
      </radialGradient>
      <linearGradient id="batWing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffc4e1" />
        <stop offset="1" stopColor="#9ed3ff" />
      </linearGradient>
      <radialGradient id="batFur" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#a68bb8" />
        <stop offset="1" stopColor="#5d3f70" />
      </radialGradient>
      <radialGradient id="lizBody" cx="0.4" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#ffe2b0" />
        <stop offset="1" stopColor="#d0843a" />
      </radialGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9b276" />
        <stop offset="1" stopColor="#b2733f" />
      </linearGradient>
      <radialGradient id="shine" cx="0.35" cy="0.3" r="0.7">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

function Eye({ x, y, r = 4, lashes = false, look = 0.6 }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.2} fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx={x + look} cy={y + 0.6} r={r * 0.7} fill="#3a1a3a" />
      <circle cx={x + look + r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" />
      {lashes && (
        <path
          d={`M ${x - r * 0.9} ${y - r * 0.9} l -2 -2 M ${x - r * 0.2} ${y - r * 1.2} l -0.6 -2.6 M ${x + r * 0.6} ${y - r * 1.05} l 0.8 -2.4`}
          stroke={INK}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function Cheek({ x, y, r = 3 }) {
  return <circle cx={x} cy={y} r={r} fill={CHEEK} stroke="none" opacity="0.55" />;
}

function Swirl({ x, y, r, color }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} stroke={INK} strokeWidth="1.4" />
      <path
        d={`M ${x} ${y} m ${-r * 0.6} 0 a ${r * 0.6} ${r * 0.6} 0 1 1 ${r * 0.6} ${r * 0.6} a ${r * 0.38} ${r * 0.38} 0 1 1 ${-r * 0.38} ${-r * 0.38} a ${r * 0.15} ${r * 0.15} 0 1 1 ${r * 0.15} ${r * 0.15}`}
        fill="none"
        stroke="#fff"
        strokeWidth={r * 0.2}
      />
      <circle cx={x} cy={y} r={r} fill="url(#shine)" />
    </g>
  );
}

function MiniGumdrop({ x, y, color, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -4 0 Q -4 -7 0 -7.5 Q 4 -7 4 0 Z" fill={color} stroke={INK} strokeWidth="1" />
      <circle cx="-1.2" cy="-4.5" r="0.8" fill="#fff" />
      <circle cx="1.4" cy="-2.2" r="0.6" fill="#fff" />
    </g>
  );
}

/** Duke Dillo: an armadillo with a layer-cake shell, cupcake crown and lollipop scepter. */
export function DukeDillo() {
  // Half-width of the shell ellipse at a given height, so the cake layers stay inside it.
  const hw = (y) => 30 * Math.sqrt(Math.max(0, 1 - ((y + 36) / 32) ** 2));
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="0" cy="-1" rx="30" ry="4" fill="#000" opacity="0.12" stroke="none" />
      {/* Tail */}
      <path d="M -20 -14 Q -42 -12 -46 2 Q -38 -4 -18 -5 Z" fill="url(#dilloShell)" />
      {/* Feet */}
      <ellipse cx="-11" cy="-4" rx="9" ry="4.5" fill="url(#dilloSkin)" />
      <ellipse cx="11" cy="-4" rx="9" ry="4.5" fill="url(#dilloSkin)" />
      {/* Layer-cake shell */}
      <ellipse cx="0" cy="-36" rx="30" ry="32" fill="url(#dilloShell)" />
      {[-58, -48, -38, -28, -18].map((y) => (
        <path key={y} d={`M ${-hw(y)} ${y} Q 0 ${y + 7} ${hw(y)} ${y}`} fill="none" stroke="#fff6e6" strokeWidth="3.2" />
      ))}
      {[
        [-22, -42, '#ffe200'],
        [21, -32, '#1e9ad6'],
        [-18, -22, '#3bb54a'],
        [24, -52, '#8e3a9d'],
        [-24, -54, '#f7941d'],
      ].map(([x, y, c]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="4" height="1.6" rx="0.8" fill={c} stroke="none" transform={`rotate(35 ${x} ${y})`} />
      ))}
      {/* Belly with candy buttons */}
      <ellipse cx="0" cy="-32" rx="16" ry="22" fill="#fff3e2" />
      <circle cx="0" cy="-42" r="2.6" fill="#e31e26" />
      <circle cx="0" cy="-32" r="2.6" fill="#ffe200" />
      <circle cx="0" cy="-22" r="2.6" fill="#1e9ad6" />
      {/* Arms */}
      <ellipse cx="-22" cy="-36" rx="5" ry="10" fill="url(#dilloSkin)" transform="rotate(25 -22 -36)" />
      {/* Lollipop scepter */}
      <path d="M 30 -4 V -78" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 30 -4 V -78" stroke="#fff" strokeWidth="3.5" />
      <path d="M 30 -4 V -78" stroke="#e31e26" strokeWidth="3.5" strokeDasharray="3 3" />
      <Swirl x={30} y={-88} r={11} color="#e31e26" />
      <ellipse cx="24" cy="-44" rx="5" ry="10" fill="url(#dilloSkin)" transform="rotate(-35 24 -44)" />
      {/* Ears */}
      <ellipse cx="-12" cy="-90" rx="5" ry="10" fill="url(#dilloSkin)" transform="rotate(-20 -12 -90)" />
      <ellipse cx="-12" cy="-90" rx="2.3" ry="6" fill="#ff9fbf" stroke="none" transform="rotate(-20 -12 -90)" />
      <ellipse cx="12" cy="-90" rx="5" ry="10" fill="url(#dilloSkin)" transform="rotate(20 12 -90)" />
      <ellipse cx="12" cy="-90" rx="2.3" ry="6" fill="#ff9fbf" stroke="none" transform="rotate(20 12 -90)" />
      {/* Head and snout */}
      <ellipse cx="0" cy="-74" rx="15" ry="13" fill="url(#dilloSkin)" />
      <path d="M -13 -80 Q 0 -93 13 -80 Q 9 -76 6 -79 Q 3 -74 0 -78 Q -3 -74 -6 -79 Q -9 -76 -13 -80 Z" fill="#ff8fc1" />
      <path d="M -7 -69 Q -8 -54 0 -52 Q 8 -54 7 -69" fill="url(#dilloSkin)" />
      <ellipse cx="0" cy="-54.5" rx="4" ry="2.8" fill="#e8578a" />
      <path d="M -3 -49.5 Q 0 -47 3 -49.5" fill="none" />
      <Eye x={-6.5} y={-74} r={3.6} />
      <Eye x={6.5} y={-74} r={3.6} />
      <path d="M -10 -80 Q -6.5 -82 -3 -80 M 3 -80 Q 6.5 -82 10 -80" fill="none" strokeWidth="1.3" />
      <Cheek x={-11} y={-66} />
      <Cheek x={11} y={-66} />
      {/* Cupcake crown */}
      <path d="M -8 -87 L 8 -87 L 10 -96 L -10 -96 Z" fill="#ffe200" />
      <path d="M -4 -87 L -5 -96 M 0 -87 V -96 M 4 -87 L 5 -96" stroke="#d4a900" strokeWidth="1" />
      <ellipse cx="0" cy="-99" rx="11" ry="4.5" fill="#fff" />
      <ellipse cx="0" cy="-103" rx="7.5" ry="3.8" fill="#ffd1e5" />
      <circle cx="0" cy="-109" r="3.2" fill="#e31e26" />
      <path d="M 0 -112 Q 2 -116 5 -116" fill="none" strokeWidth="1" />
    </g>
  );
}

/** Rosie Roadrunner: rainbow taffy feathers and a candy-apple guitar. */
export function RosieRoadrunner() {
  const tail = [
    ['M -10 -44 Q -28 -62 -42 -88', '#1e9ad6'],
    ['M -10 -42 Q -32 -56 -52 -78', '#ffe200'],
    ['M -10 -40 Q -34 -48 -56 -62', '#e31e26'],
  ];
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="4" cy="-1" rx="20" ry="3.5" fill="#000" opacity="0.12" stroke="none" />
      {/* Taffy tail */}
      {tail.map(([d, c]) => (
        <g key={c}>
          <path d={d} fill="none" strokeWidth="10" strokeLinecap="round" />
          <path d={d} fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 7" opacity="0.8" />
        </g>
      ))}
      {/* Legs */}
      <path d="M -2 -30 L -4 -2 M 8 -30 L 10 -2" fill="none" stroke="#f7941d" strokeWidth="3" strokeLinecap="round" />
      <path d="M -12 0 L -4 -2 L 2 0 M 4 0 L 10 -2 L 18 0" fill="none" stroke="#f7941d" strokeWidth="2.4" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="0" cy="-42" rx="21" ry="15" fill="url(#rrBody)" transform="rotate(-25 0 -42)" />
      <ellipse cx="7" cy="-36" rx="11" ry="8" fill="#f6dcff" stroke="none" transform="rotate(-25 7 -36)" />
      {[
        [-12, -46],
        [-6, -52],
        [-14, -38],
        [-2, -46],
      ].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.6" ry="1" fill="#fff" stroke="none" opacity="0.85" />
      ))}
      {/* Neck */}
      <path d="M 4 -50 Q 8 -60 12 -66 L 22 -60 Q 18 -50 14 -44 Z" fill="url(#rrBody)" />
      {/* Crest */}
      {[
        [9, -80, -40, '#e31e26'],
        [13, -83, -20, '#f7941d'],
        [17, -84, 0, '#ffe200'],
        [21, -82, 20, '#3bb54a'],
      ].map(([x, y, a, c]) => (
        <ellipse key={c} cx={x} cy={y} rx="3.4" ry="10" fill={c} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {/* Head */}
      <circle cx="17" cy="-68" r="11" fill="url(#rrBody)" />
      <ellipse cx="21" cy="-64" rx="6" ry="5" fill="#f6dcff" stroke="none" />
      <path d="M 26 -70 L 46 -66 L 26 -62 Z" fill="#ffb43a" />
      <path d="M 27 -66 L 44 -66" fill="none" strokeWidth="1" />
      <path d="M 13 -69 Q 9 -67 7 -64" fill="none" stroke="#1e9ad6" strokeWidth="2" strokeLinecap="round" />
      <Eye x={19} y={-70} r={4} lashes look={1} />
      <Cheek x={24} y={-62} r={2.5} />
      {/* Guitar */}
      <g transform="translate(0 -32) rotate(68)">
        <rect x="-1.8" y="-34" width="3.6" height="26" fill="#b5651d" />
        <rect x="-3" y="-40" width="6" height="7" rx="1.5" fill="#8a4b20" />
        <circle cx="0" cy="-6" r="7" fill="#e31e26" />
        <circle cx="0" cy="3" r="9" fill="#e31e26" />
        <circle cx="0" cy="-2" r="2.6" fill="#3a1a3a" />
        <rect x="-4" y="6" width="8" height="2" fill="#3a1a3a" stroke="none" />
        <circle cx="-3" cy="-1" r="9" fill="url(#shine)" stroke="none" />
      </g>
      {/* Wing strumming the guitar */}
      <path d="M -10 -48 Q 6 -50 16 -34 Q 2 -33 -10 -40 Z" fill="#8e3a9d" />
    </g>
  );
}

/** Sal of the Springs: a gummy Barton Springs salamander in a peppermint swim ring. */
export function SalSalamander() {
  const gills = [
    [20, -66, -50],
    [23, -56, -90],
    [20, -46, -130],
  ];
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="0" cy="-1" rx="26" ry="3.5" fill="#000" opacity="0.12" stroke="none" />
      {/* Tail */}
      <path d="M -12 -8 Q -34 -4 -40 -16 Q -44 -30 -33 -31 Q -26 -31 -29 -24 Q -33 -15 -14 -17 Z" fill="url(#salBody)" />
      {/* Feet */}
      <ellipse cx="-10" cy="-3" rx="7" ry="3.5" fill="url(#salBody)" />
      <ellipse cx="10" cy="-3" rx="7" ry="3.5" fill="url(#salBody)" />
      {/* Body */}
      <ellipse cx="0" cy="-24" rx="17" ry="21" fill="url(#salBody)" />
      <ellipse cx="0" cy="-20" rx="10" ry="14" fill="#effff9" stroke="none" opacity="0.7" />
      {/* Frilly gills */}
      {[-1, 1].map((s) =>
        gills.map(([x, y, a]) => (
          <ellipse key={`${s}${y}`} cx={s * x} cy={y} rx="4" ry="9" fill="#ff7fb0" transform={`rotate(${s * a} ${s * x} ${y})`} />
        )),
      )}
      {/* Head */}
      <ellipse cx="0" cy="-56" rx="20" ry="15" fill="url(#salBody)" />
      {[
        [-12, -64],
        [10, -66],
        [-3, -68],
        [14, -58],
        [-8, -34],
        [9, -40],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="#f5c542" stroke="none" />
      ))}
      <Eye x={-7.5} y={-58} r={4.2} lashes look={0.3} />
      <Eye x={7.5} y={-58} r={4.2} lashes look={0.8} />
      <path d="M -9 -50 Q 0 -43 9 -50" fill="#ff8fb3" />
      <Cheek x={-13} y={-51} />
      <Cheek x={13} y={-51} />
      {/* Bluebonnet behind one gill */}
      <g stroke="none">
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={12 + 3 * Math.cos((a * Math.PI) / 180)} cy={-70 + 3 * Math.sin((a * Math.PI) / 180)} r="2.4" fill="#3d6fe0" />
        ))}
        <circle cx="12" cy="-70" r="1.6" fill="#fff" />
      </g>
      {/* Peppermint swim ring */}
      <ellipse cx="0" cy="-20" rx="25" ry="8" fill="none" strokeWidth="11" />
      <ellipse cx="0" cy="-20" rx="25" ry="8" fill="none" stroke="#fff" strokeWidth="8.5" />
      <ellipse cx="0" cy="-20" rx="25" ry="8" fill="none" stroke="#e31e26" strokeWidth="8.5" strokeDasharray="7 7" />
      <ellipse cx="-13" cy="-25" rx="4" ry="3" fill="url(#salBody)" />
      <ellipse cx="13" cy="-25" rx="4" ry="3" fill="url(#salBody)" />
    </g>
  );
}

/** Bella of the Bridge: a Mexican free-tailed bat with cotton-candy wings. Centered on 0, 0. */
export function BellaBat() {
  const wing = 'M -6 -2 Q -20 -24 -44 -16 Q -37 -7 -40 2 Q -31 -2 -27 7 Q -19 0 -14 9 Q -10 3 -6 5 Z';
  return (
    <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
      {[1, -1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <path d={wing} fill="url(#batWing)" />
          <path d="M -8 -2 L -40 -14 M -10 0 L -38 1 M -10 2 L -26 6" fill="none" stroke="#fff" strokeWidth="1" opacity="0.8" />
        </g>
      ))}
      {/* Ears */}
      <path d="M -9 -13 L -13 -29 L -2 -17 Z M 9 -13 L 13 -29 L 2 -17 Z" fill="url(#batFur)" />
      <path d="M -8.5 -15 L -11 -25 L -4.5 -18 Z M 8.5 -15 L 11 -25 L 4.5 -18 Z" fill="#ff9fbf" stroke="none" />
      {/* Body and head */}
      <ellipse cx="0" cy="5" rx="9" ry="12" fill="url(#batFur)" />
      <ellipse cx="0" cy="8" rx="5" ry="7" fill="#cdb6dc" stroke="none" />
      <circle cx="0" cy="-9" r="10.5" fill="url(#batFur)" />
      <ellipse cx="0" cy="-5" rx="6" ry="4" fill="#cdb6dc" stroke="none" />
      <Eye x={-4.2} y={-11} r={3} lashes look={0.2} />
      <Eye x={4.2} y={-11} r={3} lashes look={0.6} />
      <path d="M -3 -4.5 Q 0 -1.5 3 -4.5" fill="none" strokeWidth="1.2" />
      <path d="M 1.4 -3.4 L 2 -1.6 L 2.6 -3.6 Z" fill="#fff" strokeWidth="0.6" />
      <Cheek x={-7} y={-5} r={2.2} />
      <Cheek x={7} y={-5} r={2.2} />
      {/* Bow */}
      <path d="M -10 -22 L -17 -26 L -16 -18 Z M -10 -22 L -4 -27 L -5 -19 Z" fill="#e8358f" strokeWidth="1.1" />
      <circle cx="-10" cy="-22" r="1.8" fill="#ff8fc1" strokeWidth="1" />
    </g>
  );
}

/** Prickles: a Texas horned lizard with a crown of gumdrop horns. */
export function Prickles() {
  const topY = (x) => -12 - 12 * Math.sqrt(Math.max(0, 1 - ((x + 4) / 26) ** 2));
  const drops = ['#e31e26', '#ffe200', '#1e9ad6', '#3bb54a', '#f7941d', '#8e3a9d'];
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="0" cy="-1" rx="34" ry="3.5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M -26 -10 Q -44 -8 -52 -2 Q -42 -1 -24 -4 Z" fill="url(#lizBody)" />
      {/* Legs */}
      <ellipse cx="-20" cy="-3" rx="7" ry="3" fill="url(#lizBody)" transform="rotate(-15 -20 -3)" />
      <ellipse cx="10" cy="-3" rx="7" ry="3" fill="url(#lizBody)" transform="rotate(15 10 -3)" />
      {/* Body with gumdrop spikes */}
      {[-24, -16, -8, 0, 8, 15].map((x, i) => (
        <MiniGumdrop key={x} x={x} y={topY(x) + 3} color={drops[i]} s={0.9} />
      ))}
      <ellipse cx="-4" cy="-12" rx="26" ry="12" fill="url(#lizBody)" />
      {[
        [-16, -14],
        [-6, -18],
        [4, -12],
        [-12, -8],
      ].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="3" ry="2" fill="#a0562a" stroke="none" opacity="0.55" />
      ))}
      <ellipse cx="-4" cy="-10" rx="26" ry="12" fill="url(#shine)" stroke="none" />
      {/* Head with gumdrop crown */}
      <MiniGumdrop x={18} y={-25} color="#e31e26" s={1.2} />
      <MiniGumdrop x={25} y={-27} color="#ffe200" s={1.3} />
      <MiniGumdrop x={32} y={-25} color="#1e9ad6" s={1.2} />
      <ellipse cx="25" cy="-17" rx="13" ry="10" fill="url(#lizBody)" />
      <Eye x={28} y={-19} r={3.6} look={0.8} />
      <path d="M 24 -24 Q 28 -26 32 -24" fill="none" strokeWidth="1.2" />
      <path d="M 30 -12 Q 34 -10 37 -13" fill="none" strokeWidth="1.3" />
      <Cheek x={33} y={-14} r={2.4} />
      {/* Red bandana */}
      <path d="M 13 -21 Q 16 -10 14 -6 L 10 -2 L 9 -10 Z" fill="#e31e26" strokeWidth="1.2" />
      <circle cx="12" cy="-12" r="0.9" fill="#fff" stroke="none" />
      <circle cx="11" cy="-7" r="0.9" fill="#fff" stroke="none" />
    </g>
  );
}

/** A monarch butterfly with stained-glass candy wings. */
export function Butterfly() {
  return (
    <g stroke={INK} strokeWidth="1">
      <path d="M 0 0 Q -10 -14 -13 -6 Q -14 0 0 0 Z M 0 0 Q 10 -14 13 -6 Q 14 0 0 0 Z" fill="#f7941d" />
      <path d="M 0 0 Q -9 8 -8 3 Q -6 0 0 0 Z M 0 0 Q 9 8 8 3 Q 6 0 0 0 Z" fill="#ffb347" />
      <circle cx="-8" cy="-6" r="1.2" fill="#fff" stroke="none" />
      <circle cx="8" cy="-6" r="1.2" fill="#fff" stroke="none" />
      <path d="M 0 4 V -4 M 0 -4 L -2 -8 M 0 -4 L 2 -8" fill="none" strokeWidth="1.3" />
    </g>
  );
}

/** A wooden signpost with a name, in the style of a vintage board game. */
export function Sign({ x, y, lines, width = 56 }) {
  const h = 6 + lines.length * 9;
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <rect x="-2.5" y={h / 2 - 2} width="5" height="16" fill="#9a5f30" stroke={INK} strokeWidth="1.2" />
      <path
        d={`M ${-width / 2} ${-h / 2 + 1} L ${width / 2 - 1} ${-h / 2} L ${width / 2} ${h / 2 - 1} L ${-width / 2 + 1} ${h / 2} Z`}
        fill="url(#wood)"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d={`M ${-width / 2 + 4} ${-h / 2 + 4} H ${width / 2 - 8}`} stroke="#fff" strokeWidth="1" opacity="0.4" />
      {lines.map((t, i) => (
        <text
          key={t}
          textAnchor="middle"
          x="0"
          y={-h / 2 + 11 + i * 9}
          fontSize="7.5"
          fontWeight="700"
          fill="#4a2410"
          className="font-display"
          letterSpacing="0.3"
        >
          {t}
        </text>
      ))}
    </g>
  );
}

// Who hosts each kind of stop, and how to frame each character on its own.
export const HOSTS = {
  food: { name: 'Duke Dillo', Character: DukeDillo, viewBox: '-50 -118 92 122' },
  music: { name: 'Rosie Roadrunner', Character: RosieRoadrunner, viewBox: '-62 -100 112 104' },
  outdoors: { name: 'Sal of the Springs', Character: SalSalamander, viewBox: '-48 -84 80 88' },
};

/** A character drawn on its own, for cards and pop-ups. */
export function Portrait({ theme, className }) {
  const { Character, viewBox, name } = HOSTS[theme];
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={name}>
      <Character />
    </svg>
  );
}
