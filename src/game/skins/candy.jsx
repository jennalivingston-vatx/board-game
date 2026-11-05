import { FINISH, SPACES, THEMES } from '../data';
import { pointsAlong } from '../geometry';

// Option A: a 1950s candy board game. Muted pastels, brown printer's ink and a winding
// path of candy tiles, with the Capitol as the candy castle at the end.

const INK = '#4a2c2a';
const CREAM = '#fff6e3';
const PINK = '#e2557a';
const TILES = ['#f6b8c4', '#f7dc8c', '#acd5ec', '#bfe3c6', '#d3bde8'];

const colors = {
  food: { fill: '#e4573d', dark: '#a8321e', light: '#f9d9cf', on: CREAM },
  music: { fill: '#8a5cb8', dark: '#5d3488', light: '#e9dcf5', on: CREAM },
  outdoors: { fill: '#4b9f6e', dark: '#2c6e47', light: '#d6eedd', on: CREAM },
};

// Stops snake back and forth in rows of four from the bottom up, ending at the castle.
const COLUMNS = [62, 140, 220, 298];
const ROWS = [578, 472, 366, 260, 158];
const POSITIONS = SPACES.map((_, i) => {
  if (i === FINISH) return { x: 284, y: 94 };
  const row = Math.floor(i / 4);
  const step = i % 4;
  const col = row % 2 === 0 ? step : 3 - step;
  return { x: COLUMNS[col], y: ROWS[row] + (step % 2 ? -10 : 8) };
});

const TILE_SPOTS = pointsAlong(POSITIONS, 17).filter(
  (p) => !POSITIONS.some((s, i) => Math.hypot(s.x - p.x, s.y - p.y) < (i === FINISH ? 44 : 27)),
);

function ribbonPath(from, to) {
  const a = POSITIONS[from];
  const b = POSITIONS[to];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bow = mx < 180 ? 46 : -46;
  return `M ${a.x} ${a.y} Q ${mx + bow} ${my - 24} ${b.x} ${b.y}`;
}

function Board({ shown, visits, options, onPick, busy }) {
  const piece = POSITIONS[shown];
  return (
    <svg viewBox="0 0 360 640" className="size-full" role="img" aria-label="Candy-style Austin game board">
      <defs>
        <filter id="c-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.29  0 0 0 0 0.17  0 0 0 0 0.16  0.7 0 0 0 -0.25" />
        </filter>
        <filter id="c-print" x="-20%" y="-20%" width="150%" height="150%">
          <feOffset dx="2.5" dy="2.5" in="SourceAlpha" result="o" />
          <feFlood floodColor={INK} floodOpacity="0.5" />
          <feComposite in2="o" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="c-stripe" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="4.5" height="9" fill={CREAM} />
        </pattern>
        <pattern id="c-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill={INK} opacity="0.12" />
          <circle cx="7" cy="7" r="1.1" fill={INK} opacity="0.12" />
        </pattern>
        <clipPath id="c-card">
          <rect x="6" y="6" width="348" height="628" rx="22" />
        </clipPath>
      </defs>

      <rect x="6" y="6" width="348" height="628" rx="22" fill="#f6ead0" />
      <g clipPath="url(#c-card)">
        <rect width="360" height="640" fill="url(#c-dots)" />
        <Scenery />
      </g>

      {/* Shortcuts: striped candy ribbons */}
      {SPACES.map((s, i) =>
        s.shortcut ? (
          <g key={`r${i}`} fill="none" strokeLinecap="round">
            <path d={ribbonPath(i, s.shortcut.to)} stroke={INK} strokeWidth="9" />
            <path d={ribbonPath(i, s.shortcut.to)} stroke={colors[s.theme].fill} strokeWidth="6" />
            <path d={ribbonPath(i, s.shortcut.to)} stroke={CREAM} strokeWidth="6" strokeDasharray="3 7" strokeLinecap="butt" />
          </g>
        ) : null,
      )}

      {/* The candy path */}
      <g filter="url(#c-print)">
        {TILE_SPOTS.map((p, i) => (
          <rect
            key={i}
            x="-7.5"
            y="-6.5"
            width="15"
            height="13"
            rx="2.5"
            transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}
            fill={TILES[i % TILES.length]}
            stroke={INK}
            strokeWidth="1.3"
          />
        ))}
      </g>

      <Castle />

      <g transform={`translate(${POSITIONS[0].x} ${POSITIONS[0].y})`} filter="url(#c-print)">
        <rect x="-30" y="-17" width="60" height="34" rx="9" fill={PINK} stroke={INK} strokeWidth="2" />
        <text textAnchor="middle" y="6" fontSize="15" fill={CREAM} fontFamily="Shrikhand, serif">
          Start
        </text>
      </g>

      {SPACES.map((s, i) => {
        if (!s.theme) return null;
        const { x, y } = POSITIONS[i];
        const c = colors[s.theme];
        const Icon = s.icon;
        const isOption = !busy && options.includes(i);
        return (
          <g key={i} transform={`translate(${x} ${y})`} onClick={isOption ? () => onPick(i) : undefined} className={isOption ? 'cursor-pointer' : undefined}>
            <title>{s.name}</title>
            {isOption && <rect x="-32" y="-32" width="64" height="64" rx="14" fill={c.fill} opacity="0.3" className="animate-pulse" />}
            {visits.includes(i) && <rect x="-28" y="-28" width="56" height="56" rx="12" fill="#f2c14e" stroke={INK} strokeWidth="1.5" />}
            <g filter="url(#c-print)">
              <rect x="-23" y="-23" width="46" height="46" rx="9" fill={c.fill} stroke={INK} strokeWidth="2" />
            </g>
            <rect x="-19" y="-19" width="38" height="38" rx="6" fill="none" stroke={CREAM} strokeWidth="1" opacity="0.6" />
            <Icon x="-12" y="-12" size={24} color={CREAM} strokeWidth={2.1} />
            {s.shortcut && <Star x={20} y={-20} r={8} />}
          </g>
        );
      })}

      <g
        style={{ transform: `translate(${piece.x}px, ${piece.y - 26}px)`, transition: 'transform 260ms cubic-bezier(.3,1.6,.6,1)' }}
        filter="url(#c-print)"
        pointerEvents="none"
      >
        <Gingerbread />
      </g>

      <rect x="6" y="6" width="348" height="628" rx="22" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="12" y="12" width="336" height="616" rx="17" fill="none" stroke={INK} strokeWidth="1" />
      <rect width="360" height="640" filter="url(#c-grain)" pointerEvents="none" opacity="0.9" clipPath="url(#c-card)" />
    </svg>
  );
}

function Star({ x, y, r, fill = '#f2c14e' }) {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const rad = k % 2 ? r * 0.45 : r;
    const a = (Math.PI / 5) * k - Math.PI / 2;
    return `${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />;
}

function Gingerbread() {
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <ellipse cx="0" cy="21" rx="12" ry="3.5" fill={INK} opacity="0.2" stroke="none" />
      <path d="M -6 -4 L -15 0 Q -18 5 -13 7 L -6 5 L -9 16 Q -9 21 -4 20 L 0 13 L 4 20 Q 9 21 9 16 L 6 5 L 13 7 Q 18 5 15 0 L 6 -4 Z" fill="#c47a43" />
      <circle cx="0" cy="-11" r="8.5" fill="#c47a43" />
      <path d="M -13 2 l 2 -2 l 2 2 M 9 2 l 2 -2 l 2 2 M -7 15 l 2 -2 l 2 2 M 3 15 l 2 -2 l 2 2" fill="none" stroke={CREAM} strokeWidth="1.2" />
      <circle cx="0" cy="1" r="1.6" fill={PINK} strokeWidth="0.8" />
      <circle cx="0" cy="7" r="1.6" fill="#8a5cb8" strokeWidth="0.8" />
      <circle cx="-3" cy="-12" r="1" fill={INK} stroke="none" />
      <circle cx="3" cy="-12" r="1" fill={INK} stroke="none" />
      <path d="M -3 -8 Q 0 -6 3 -8" fill="none" strokeWidth="1.1" />
      {/* Cowboy hat */}
      <path d="M -14 -17 Q 0 -11 14 -17 Q 9 -13 0 -13.5 Q -9 -13 -14 -17 Z" fill={PINK} />
      <path d="M -7 -15 Q -7 -27 0 -25 Q 7 -27 7 -15 Z" fill={PINK} />
      <path d="M -7 -17 H 7" stroke={CREAM} strokeWidth="1.5" />
    </g>
  );
}

function Castle() {
  const { x, y } = POSITIONS[FINISH];
  return (
    <g transform={`translate(${x} ${y}) scale(0.85)`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" filter="url(#c-print)">
      {/* Flags */}
      <path d="M -40 -6 V -26 L -28 -22 L -40 -18" fill={TILES[2]} />
      <path d="M 40 -6 V -26 L 52 -22 L 40 -18" fill={TILES[3]} />
      <rect x="-50" y="22" width="100" height="12" rx="3" fill={CREAM} />
      <rect x="-44" y="-6" width="88" height="29" rx="3" fill={TILES[0]} />
      {[-36, -24, -12, 6, 18, 30].map((cx) => (
        <rect key={cx} x={cx} y="-1" width="6" height="20" rx="3" fill={CREAM} strokeWidth="1.2" />
      ))}
      <path d="M -50 -6 L 0 -24 L 50 -6 Z" fill={CREAM} />
      <rect x="-22" y="-36" width="44" height="14" fill={TILES[1]} />
      <path d="M -24 -36 Q -24 -70 0 -72 Q 24 -70 24 -36 Z" fill={PINK} />
      <path d="M -24 -36 Q -24 -70 0 -72 Q 24 -70 24 -36 Z" fill="url(#c-stripe)" stroke="none" opacity="0.75" />
      <path d="M -24 -36 Q -24 -70 0 -72 Q 24 -70 24 -36 Z" fill="none" />
      <rect x="-4" y="-82" width="8" height="11" fill={CREAM} />
      <Star x={0} y={-90} r={9} />
      {/* Ribbon */}
      <path d="M -48 40 H 48 L 42 49 L 48 58 H -48 L -42 49 Z" fill={PINK} />
      <text x="0" y="54" textAnchor="middle" fontSize="12" fill={CREAM} stroke="none" fontFamily="Shrikhand, serif" letterSpacing="1">
        The Capitol
      </text>
    </g>
  );
}

function Lollipop({ x, y, fill, r = 14 }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="1.5">
      <rect x="-2" y="0" width="4" height={r * 2.2} rx="2" fill={CREAM} />
      <circle r={r} fill={fill} />
      <path d={`M 0 0 m ${-r * 0.6} 0 a ${r * 0.6} ${r * 0.6} 0 1 1 ${r * 0.6} ${r * 0.6} a ${r * 0.38} ${r * 0.38} 0 1 1 ${-r * 0.38} ${-r * 0.38}`} fill="none" stroke={CREAM} strokeWidth="2.4" />
    </g>
  );
}

function Peppermint({ x, y, r = 11 }) {
  const wedges = [0, 1, 2, 3, 4, 5].map((k) => {
    const a1 = (k * Math.PI) / 3;
    const a2 = a1 + Math.PI / 6;
    return `M 0 0 L ${r * Math.cos(a1)} ${r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${r * Math.cos(a2)} ${r * Math.sin(a2)} Z`;
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <path d={wedges.join(' ')} fill="#e4573d" />
      <circle r={r} fill="none" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function Gumdrop({ x, y, fill }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -11 0 Q -11 -16 0 -17 Q 11 -16 11 0 Z" fill={fill} stroke={INK} strokeWidth="1.5" />
      <circle cx="-4" cy="-9" r="1.2" fill={CREAM} />
      <circle cx="3" cy="-5" r="1.2" fill={CREAM} />
      <circle cx="4" cy="-12" r="1.2" fill={CREAM} />
    </g>
  );
}

function CandyCane({ x, y }) {
  const d = 'M 0 28 V 4 A 7 7 0 0 1 14 4 V 9';
  return (
    <g transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round">
      <path d={d} stroke={INK} strokeWidth="8" />
      <path d={d} stroke={CREAM} strokeWidth="5" />
      <path d={d} stroke="#e4573d" strokeWidth="5" strokeDasharray="3 4" strokeLinecap="butt" />
    </g>
  );
}

function Cloud({ x, y, s = 1 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M -24 8 Q -30 -2 -18 -4 Q -16 -16 -3 -12 Q 4 -22 15 -12 Q 28 -12 24 0 Q 32 8 20 10 Z"
      fill={CREAM}
      stroke={INK}
      strokeWidth="1.5"
    />
  );
}

function Scenery() {
  return (
    <g pointerEvents="none">
      {/* Gumdrop mountains */}
      <path d="M 10 132 Q 40 50 72 118 Q 100 40 140 122 Q 160 92 186 130 Z" fill="#d3bde8" stroke={INK} strokeWidth="1.5" />
      <path d="M 58 92 Q 72 72 86 92 M 114 76 Q 100 64 92 82" fill="none" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
      <Cloud x={60} y={36} />
      <Cloud x={176} y={56} s={0.8} />
      {[
        [120, 26],
        [136, 18],
        [150, 30],
      ].map(([bx, by]) => (
        <path key={bx} d={`M ${bx - 6} ${by} q 3 -4 6 0 q 3 -4 6 0`} fill="none" stroke={INK} strokeWidth="1.6" />
      ))}

      {/* Between the rows */}
      <Lollipop x={112} y={514} fill={TILES[0]} />
      <Gumdrop x={196} y={538} fill={TILES[4]} />
      <Peppermint x={250} y={418} />
      <CandyCane x={150} y={402} />
      <Gumdrop x={326} y={425} fill={TILES[1]} />
      <Lollipop x={104} y={300} fill={TILES[2]} r={12} />
      <Gumdrop x={196} y={322} fill={TILES[3]} />
      <Peppermint x={34} y={322} r={9} />
      <Lollipop x={236} y={196} fill={TILES[1]} r={12} />
      <Gumdrop x={318} y={214} fill={TILES[0]} />

      {/* Rolling hills */}
      <path d="M 0 612 Q 70 586 150 606 T 360 598 V 640 H 0 Z" fill="#bfe3c6" stroke={INK} strokeWidth="1.5" />
      <path d="M 0 630 Q 110 610 230 628 T 360 622 V 640 H 0 Z" fill="#9fd1ad" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function Card({ index, stop, colors: c, disabled, onPick }) {
  const Icon = stop.icon;
  return (
    <button
      type="button"
      onClick={() => onPick(index)}
      disabled={disabled}
      className="flex flex-col items-stretch gap-2 rounded-2xl p-1.5 text-center transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 md:flex-row md:items-center md:gap-3 md:p-2 md:text-left"
      style={{ background: '#fffaf0', border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}
    >
      <span className="relative grid h-12 place-items-center rounded-xl md:size-16 md:shrink-0" style={{ background: c.fill, border: `1.5px solid ${INK}` }}>
        <Icon className="size-6 md:size-7" color={CREAM} />
        {stop.shortcut && <span className="absolute -top-1.5 -right-1.5 text-base leading-none text-[#f2c14e] [text-shadow:0_0_1px_#4a2c2a,0_0_1px_#4a2c2a]">★</span>}
      </span>
      <span className="min-w-0 px-0.5 pb-1 md:p-0">
        <span className="block text-[10px] font-extrabold tracking-[0.15em] uppercase" style={{ color: c.dark }}>
          {THEMES[stop.theme].label}
        </span>
        <span className="block text-[13px] leading-tight font-extrabold md:text-base">{stop.name}</span>
        <span className="mt-0.5 hidden text-xs md:block" style={{ color: '#7a5d55' }}>
          {stop.blurb}
        </span>
      </span>
    </button>
  );
}

export const candy = {
  id: 'candy',
  name: 'Austin Candy Trail',
  kicker: 'A sweet game of Austin · 1955',
  era: '1950s candy board game',
  description: 'Soft pastels, brown printer’s ink and a winding path of candy tiles up to a candy-castle Capitol. Your piece is a gingerbread cowpoke.',
  colors,
  fonts: { display: 'Shrikhand, Georgia, serif', body: 'Nunito, system-ui, sans-serif' },
  page: '#f1e2c4',
  panel: '#fbf3df',
  ink: INK,
  muted: '#7a5d55',
  accent: PINK,
  accentInk: CREAM,
  titleShadow: `2px 2px 0 ${INK}`,
  divider: `repeating-linear-gradient(45deg, ${PINK} 0 8px, #fbf3df 8px 16px)`,
  scrim: 'rgba(74, 44, 42, 0.4)',
  frame: `3px solid ${INK}`,
  radius: '18px',
  dotRadius: '50%',
  shadow: `6px 6px 0 ${INK}`,
  Board,
  Card,
};
