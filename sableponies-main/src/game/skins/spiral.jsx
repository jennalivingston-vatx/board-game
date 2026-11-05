import { FINISH, SPACES, THEMES } from '../data';

// Option C: an antique spiral race game, printed in three letterpress inks on cream paper.
// The numbered path spirals inward to the Capitol at the center.

const INK = '#1f2a44';
const PAPER = '#efe3c6';
const CREAM = '#f7eed8';
const RED = '#b5412f';
const MUSTARD = '#d9a038';

const colors = {
  food: { fill: RED, dark: '#8a2c1f', light: '#f1d6cc', on: CREAM },
  music: { fill: '#2f4f8a', dark: '#1f2a44', light: '#d8dfee', on: CREAM },
  outdoors: { fill: '#5d7d3c', dark: '#3f5a25', light: '#dfe8cf', on: CREAM },
};

// The spiral band: it starts at the bottom, runs clockwise and narrows toward the middle.
const C = 200;
const OUTER = 184;
const WIDTH = 48;
const TURNS = 1.5;
const START = Math.PI / 2;
const END = TURNS * 2 * Math.PI;
const outerR = (t) => OUTER - (WIDTH * t) / (2 * Math.PI);
const at = (t, r) => ({ x: C + r * Math.cos(START + t), y: C + r * Math.sin(START + t) });

// Split the band into 19 cells of equal length along its middle line.
const CELLS = (() => {
  const steps = 1200;
  const lengths = [0];
  for (let s = 1; s <= steps; s++) {
    const t = (END * s) / steps;
    lengths.push(lengths[s - 1] + (outerR(t) - WIDTH / 2) * (END / steps));
  }
  const total = lengths[steps];
  const count = FINISH;
  const bounds = Array.from({ length: count + 1 }, (_, k) => {
    const s = lengths.findIndex((l) => l >= (total * k) / count);
    return (END * s) / steps;
  });
  return Array.from({ length: count }, (_, k) => {
    const [a, b] = [bounds[k], bounds[k + 1]];
    const n = 10;
    const outer = Array.from({ length: n + 1 }, (_, j) => at(a + ((b - a) * j) / n, outerR(a + ((b - a) * j) / n)));
    const inner = Array.from({ length: n + 1 }, (_, j) => at(b - ((b - a) * j) / n, outerR(b - ((b - a) * j) / n) - WIDTH));
    const pts = [...outer, ...inner];
    const mid = (a + b) / 2;
    return {
      d: `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} Z`,
      center: at(mid, outerR(mid) - WIDTH / 2),
      numberAt: at(mid, outerR(mid) - 9),
      tagAt: at(mid, outerR(mid) - WIDTH + 8),
    };
  });
})();

const POSITIONS = [...CELLS.map((c) => c.center), { x: C, y: C + 8 }];


function Board({ shown, visits, options, onPick, busy }) {
  const piece = POSITIONS[shown];
  return (
    <svg viewBox="0 0 400 400" className="size-full" role="img" aria-label="Spiral race style Austin board">
      <defs>
        <filter id="s-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0.8 0 0 0 -0.3" />
        </filter>
        <pattern id="s-halftone" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="2.5" cy="2.5" r="1" fill={CREAM} opacity="0.22" />
        </pattern>
        <clipPath id="s-sun">
          <circle cx={C} cy={C} r="66" />
        </clipPath>
      </defs>

      <rect width="400" height="400" fill={PAPER} />
      <rect x="5" y="5" width="390" height="390" fill="none" stroke={INK} strokeWidth="3" />
      <rect x="10" y="10" width="380" height="380" fill="none" stroke={INK} strokeWidth="0.8" />
      <Corners />

      {/* Sunburst behind the Capitol */}
      <g clipPath="url(#s-sun)">
        {Array.from({ length: 24 }, (_, k) => {
          const a1 = (k * Math.PI) / 12;
          const a2 = a1 + Math.PI / 24;
          return <path key={k} d={`M ${C} ${C} L ${C + 90 * Math.cos(a1)} ${C + 90 * Math.sin(a1)} L ${C + 90 * Math.cos(a2)} ${C + 90 * Math.sin(a2)} Z`} fill={MUSTARD} opacity="0.55" />;
        })}
      </g>
      <Capitol />

      {CELLS.map((cell, i) => {
        const s = SPACES[i];
        const isOption = !busy && options.includes(i);
        const fill = s.theme ? colors[s.theme].fill : CREAM;
        const Icon = s.icon;
        return (
          <g key={i} onClick={isOption ? () => onPick(i) : undefined} className={isOption ? 'cursor-pointer' : undefined}>
            <title>{s.name}</title>
            <path d={cell.d} fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            {s.theme && <path d={cell.d} fill="url(#s-halftone)" />}
            {visits.includes(i) && <path d={cell.d} fill="none" stroke={MUSTARD} strokeWidth="4" strokeLinejoin="round" />}
            {isOption && <path d={cell.d} fill={CREAM} opacity="0.35" className="animate-pulse" />}
            {s.theme ? (
              <>
                <Icon x={cell.center.x - 10} y={cell.center.y - 8} size={20} color={CREAM} strokeWidth={2} />
                <text x={cell.numberAt.x} y={cell.numberAt.y + 3} textAnchor="middle" fontSize="9" fontFamily="Rye, serif" fill={CREAM}>
                  {i}
                </text>
              </>
            ) : (
              <text x={cell.center.x} y={cell.center.y + 4} textAnchor="middle" fontSize="11" fontFamily="Rye, serif" fill={RED}>
                START
              </text>
            )}
            {s.shortcut && (
              <text x={cell.tagAt.x} y={cell.tagAt.y + 3} textAnchor="middle" fontSize="8" fontFamily="Rye, serif" fill={MUSTARD}>
                ★→{s.shortcut.to}
              </text>
            )}
          </g>
        );
      })}


      <rect width="400" height="400" filter="url(#s-grain)" pointerEvents="none" />

      <g
        style={{ transform: `translate(${piece.x}px, ${piece.y - 4}px)`, transition: 'transform 260ms cubic-bezier(.3,1.5,.6,1)' }}
        pointerEvents="none"
      >
        <Pawn />
      </g>
    </svg>
  );
}

function Capitol() {
  return (
    <g transform={`translate(${C} ${C + 6})`} fill={CREAM} stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <rect x="-40" y="8" width="80" height="16" />
      <rect x="-46" y="24" width="92" height="5" />
      {[-34, -26, -18, 14, 22, 30].map((x) => (
        <line key={x} x1={x + 2} y1="11" x2={x + 2} y2="21" strokeWidth="1.6" />
      ))}
      <path d="M -14 8 V 0 L 0 -6 L 14 0 V 8" />
      <rect x="-17" y="-16" width="34" height="10" />
      <path d="M -19 -16 Q -19 -40 0 -42 Q 19 -40 19 -16 Z" fill={RED} />
      <path d="M -9 -16 Q -9 -36 0 -41 M 9 -16 Q 9 -36 0 -41" fill="none" stroke={CREAM} strokeWidth="1" />
      <rect x="-3.5" y="-51" width="7" height="9" />
      <path d="M 0 -62 L 2 -56.5 H 7.5 L 3 -53 L 4.8 -47.5 L 0 -50.8 L -4.8 -47.5 L -3 -53 L -7.5 -56.5 H -2 Z" fill={MUSTARD} strokeWidth="1" />
      <text y="44" textAnchor="middle" fontSize="10" fontFamily="Rye, serif" fill={INK} stroke="none" letterSpacing="1">
        FINISH
      </text>
    </g>
  );
}

function Corners() {
  const spots = [
    [34, 34, 'GOOD EATS'],
    [366, 34, 'LIVE MUSIC'],
    [34, 366, 'OUTDOORS'],
    [366, 366, 'EST. 1839'],
  ];
  return spots.map(([x, y, label]) => {
    const pts = Array.from({ length: 10 }, (_, k) => {
      const r = k % 2 ? 5 : 12;
      const a = (Math.PI / 5) * k - Math.PI / 2;
      return `${x + r * Math.cos(a)},${y - 4 + r * Math.sin(a)}`;
    }).join(' ');
    return (
      <g key={label}>
        <circle cx={x} cy={y - 4} r="17" fill="none" stroke={INK} strokeWidth="1" />
        <polygon points={pts} fill={RED} stroke={INK} strokeWidth="1" />
        <text x={x} y={y + 24} textAnchor="middle" fontSize="6.5" fontFamily="Rye, serif" fill={INK} letterSpacing="0.5">
          {label}
        </text>
      </g>
    );
  });
}

function Pawn() {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <ellipse cy="11" rx="10" ry="3" fill={INK} opacity="0.3" stroke="none" />
      <path d="M -9 10 Q -9 5 -4 4 Q -7 -3 -3 -7 H 3 Q 7 -3 4 4 Q 9 5 9 10 Z" fill={MUSTARD} />
      <circle cy="-11" r="6" fill={MUSTARD} />
      <circle cx="-2" cy="-13" r="1.6" fill={CREAM} stroke="none" opacity="0.8" />
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
      className="flex flex-col items-center gap-1 p-1.5 text-center transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 md:flex-row md:gap-3 md:p-2.5 md:text-left"
      style={{ background: CREAM, border: `4px double ${INK}`, borderRadius: 2, boxShadow: `3px 3px 0 ${c.fill}` }}
    >
      <span className="relative grid size-11 shrink-0 place-items-center rounded-full md:size-14" style={{ background: c.fill, border: `1.5px solid ${INK}` }}>
        <Icon className="size-5 md:size-6" color={CREAM} />
        <span
          className="absolute -top-1 -left-1 grid size-5 place-items-center rounded-full text-[10px]"
          style={{ background: CREAM, border: `1.5px solid ${INK}`, fontFamily: 'Rye, serif', color: INK }}
        >
          {index}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] italic md:text-xs" style={{ color: c.dark }}>
          {THEMES[stop.theme].label}
          {stop.shortcut && ' · ★ shortcut'}
        </span>
        <span className="block text-[13px] leading-tight md:text-base" style={{ fontFamily: 'Rye, serif' }}>
          {stop.name}
        </span>
        <span className="mt-0.5 hidden text-[13px] leading-snug md:block" style={{ color: '#5a5040' }}>
          {stop.blurb}
        </span>
      </span>
    </button>
  );
}

export const spiral = {
  id: 'spiral',
  name: 'The Grand Austin Tour',
  kicker: 'A spiral race game · 1890',
  era: 'Antique spiral race game',
  description: 'A numbered spiral printed in three letterpress inks, Western wood-type lettering and a wooden pawn that winds inward to the Capitol.',
  colors,
  fonts: { display: 'Rye, Georgia, serif', body: '"IM Fell English", Georgia, serif' },
  page: '#e4d5b2',
  panel: PAPER,
  ink: INK,
  muted: '#5a5040',
  accent: RED,
  accentInk: CREAM,
  titleShadow: 'none',
  divider: `repeating-linear-gradient(45deg, ${INK} 0 5px, ${PAPER} 5px 9px)`,
  scrim: 'rgba(31, 42, 68, 0.45)',
  frame: `6px double ${INK}`,
  radius: '3px',
  dotRadius: '50%',
  shadow: `5px 5px 0 ${RED}`,
  Board,
  Card,
};
