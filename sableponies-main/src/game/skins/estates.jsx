import { FINISH, SPACES, THEMES } from '../data';
import { wrap } from '../geometry';

// Option B: a 1930s property-trading game. A square board with the stops around the edge,
// title-deed cards, streetcar shortcuts and the Capitol in the middle.

const INK = '#1d1d1b';
const CELL = '#f7f1df';
const MINT = '#cfe3c8';
const RED = '#c8312b';

const colors = {
  food: { fill: '#e47b25', dark: '#a5500e', light: '#fbe3cd', on: '#fff' },
  music: { fill: '#24489a', dark: '#1a3470', light: '#dbe3f4', on: '#fff' },
  outdoors: { fill: '#2f8f46', dark: '#1f6631', light: '#d6ecda', on: '#fff' },
};

const CORNER = 72;
const SIDE = 64;
const FAR = 400 - CORNER;

// Cell boxes around the edge: start at the bottom-right corner and run clockwise.
// `turn` rotates each cell so its color bar faces the middle of the board.
function cell(i) {
  if (i === 0) return { x: FAR, y: FAR, w: CORNER, h: CORNER, turn: 0, corner: true };
  if (i < 5) return { x: FAR - SIDE * i, y: FAR, w: SIDE, h: CORNER, turn: 0 };
  if (i === 5) return { x: 0, y: FAR, w: CORNER, h: CORNER, turn: 45, corner: true };
  if (i < 10) return { x: 0, y: FAR - SIDE * (i - 5), w: CORNER, h: SIDE, turn: 90 };
  if (i === 10) return { x: 0, y: 0, w: CORNER, h: CORNER, turn: 135, corner: true };
  if (i < 15) return { x: CORNER + SIDE * (i - 11), y: 0, w: SIDE, h: CORNER, turn: 180 };
  if (i === 15) return { x: FAR, y: 0, w: CORNER, h: CORNER, turn: 225, corner: true };
  return { x: FAR, y: CORNER + SIDE * (i - 16), w: CORNER, h: SIDE, turn: 270 };
}

const center = (c) => ({ x: c.x + c.w / 2, y: c.y + c.h / 2 });
const POSITIONS = SPACES.map((_, i) => (i === FINISH ? { x: 200, y: 262 } : center(cell(i))));

const TRACKS = {
  1: 'M 296 328 V 314 H 86 L 72 328',
  7: 'M 72 232 H 86 V 86 H 168 V 72',
  10: 'M 72 72 L 98 98 H 302 L 328 72',
};

function Board({ shown, visits, options, onPick, busy }) {
  const piece = POSITIONS[shown];
  return (
    <svg viewBox="-10 -10 420 420" className="size-full" role="img" aria-label="Property-game style Austin board">
      <defs>
        <filter id="e-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.11  0 0 0 0 0.11  0 0 0 0 0.1  0.6 0 0 0 -0.22" />
        </filter>
        <linearGradient id="e-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="0.5" stopColor="#b9bdc4" />
          <stop offset="1" stopColor="#868b93" />
        </linearGradient>
      </defs>

      <rect x="-10" y="-10" width="420" height="420" fill={INK} />
      <rect x="0" y="0" width="400" height="400" fill={MINT} />

      {/* Streetcar shortcuts */}
      {Object.entries(TRACKS).map(([from, d]) => (
        <g key={from} fill="none" strokeLinejoin="round">
          <path d={d} stroke={INK} strokeWidth="11" strokeDasharray="1.6 4.5" />
          <path d={d} stroke={INK} strokeWidth="6" />
          <path d={d} stroke={MINT} strokeWidth="3.4" />
        </g>
      ))}
      <text x="200" y="300" textAnchor="middle" fontSize="6.5" fontFamily="Oswald, sans-serif" letterSpacing="1.5" fill={INK}>
        ★ STREETCAR LINES ARE SHORTCUTS ★
      </text>

      <Middle />

      {SPACES.map((s, i) => {
        if (i === FINISH) return <Weird key="weird" />;
        const c = cell(i);
        const p = center(c);
        const isOption = !busy && options.includes(i);
        return (
          <g key={i} onClick={isOption ? () => onPick(i) : undefined} className={isOption ? 'cursor-pointer' : undefined}>
            <title>{s.name}</title>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={visits.includes(i) ? '#f3dd94' : CELL} stroke={INK} strokeWidth="1.2" />
            <g transform={`translate(${p.x} ${p.y}) rotate(${c.turn})`}>
              {i === 0 ? <Go /> : c.corner ? <CornerStop stop={s} /> : <SideStop stop={s} />}
            </g>
            {isOption && (
              <rect
                x={c.x + 2.5}
                y={c.y + 2.5}
                width={c.w - 5}
                height={c.h - 5}
                fill={colors[s.theme].fill}
                fillOpacity="0.18"
                stroke={colors[s.theme].fill}
                strokeWidth="3"
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}

      <rect x="0" y="0" width="400" height="400" fill="none" stroke={INK} strokeWidth="2" />
      <rect x={CORNER} y={CORNER} width={400 - CORNER * 2} height={400 - CORNER * 2} fill="none" stroke={INK} strokeWidth="2" />
      <rect x="0" y="0" width="400" height="400" filter="url(#e-grain)" pointerEvents="none" />

      <g
        style={{ transform: `translate(${piece.x}px, ${piece.y + 4}px)`, transition: 'transform 260ms cubic-bezier(.3,1.5,.6,1)' }}
        pointerEvents="none"
      >
        <Boot />
      </g>
    </svg>
  );
}

function Label({ text, y, size = 7.2, max = 11 }) {
  return (
    <text y={y} textAnchor="middle" fontSize={size} fontFamily="Oswald, sans-serif" fontWeight="500" letterSpacing="0.4" fill={INK}>
      {wrap(text.toUpperCase(), max).map((line, n) => (
        <tspan key={n} x="0" dy={n ? size * 1.15 : 0}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function SideStop({ stop }) {
  const c = colors[stop.theme];
  const Icon = stop.icon;
  return (
    <g>
      <rect x="-32" y="-36" width="64" height="16" fill={c.fill} stroke={INK} strokeWidth="1.2" />
      {stop.shortcut && (
        <text y="-24.5" textAnchor="middle" fontSize="9" fill="#fff">
          ★
        </text>
      )}
      <Label text={stop.name} y={-9} />
      <Icon x="-9" y="13" size={18} color={c.dark} strokeWidth={1.8} />
    </g>
  );
}

function CornerStop({ stop }) {
  const c = colors[stop.theme];
  const Icon = stop.icon;
  return (
    <g>
      <circle cy="-8" r="16" fill={c.fill} stroke={INK} strokeWidth="1.5" />
      <Icon x="-10" y="-18" size={20} color="#fff" strokeWidth={2} />
      {stop.shortcut && (
        <text x="13" y="-18" textAnchor="middle" fontSize="11" fill={INK}>
          ★
        </text>
      )}
      <Label text={stop.name} y={18} size={7.5} max={12} />
    </g>
  );
}

function Go() {
  return (
    <g>
      <text y="-20" textAnchor="middle" fontSize="7" fontFamily="Oswald, sans-serif" letterSpacing="1.5" fill={INK}>
        START HERE
      </text>
      <text y="10" textAnchor="middle" fontSize="28" fontFamily="Limelight, serif" fill={RED}>
        GO
      </text>
      <path d="M 20 22 H -18 M -12 17 L -19 22 L -12 27" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// The board's last edge space. The piece skips it and heads to the Capitol in the middle.
function Weird() {
  const c = cell(FINISH);
  const p = center(c);
  return (
    <g>
      <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={CELL} stroke={INK} strokeWidth="1.2" />
      <g transform={`translate(${p.x} ${p.y}) rotate(270)`}>
        <Label text="Keep Austin Weird" y={-14} size={7.5} max={8} />
        <text y="22" textAnchor="middle" fontSize="18" fill={RED}>
          ★
        </text>
      </g>
    </g>
  );
}

function Middle() {
  return (
    <g>
      <g transform="translate(200 132)">
        <rect x="-108" y="-21" width="216" height="42" fill={RED} stroke={INK} strokeWidth="2" />
        <rect x="-103" y="-16" width="206" height="32" fill="none" stroke="#fff" strokeWidth="1" />
        <text y="8" textAnchor="middle" fontSize="23" fontFamily="Limelight, serif" fill="#fff" letterSpacing="1">
          CAPITOL SQUARE
        </text>
      </g>
      <text x="200" y="172" textAnchor="middle" fontSize="7.5" fontFamily="Oswald, sans-serif" letterSpacing="2.5" fill={INK}>
        THE GAME OF AUSTIN, TEXAS
      </text>
      <Capitol />
    </g>
  );
}

function Capitol() {
  return (
    <g transform="translate(200 262)" fill={CELL} stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="-62" y="10" width="124" height="22" />
      <rect x="-70" y="30" width="140" height="7" />
      {[-54, -42, -30, 26, 38, 50].map((x) => (
        <rect key={x} x={x} y="15" width="4" height="13" fill={MINT} strokeWidth="1" />
      ))}
      <path d="M -20 10 V 0 L 0 -8 L 20 0 V 10" />
      <rect x="-24" y="-22" width="48" height="14" />
      {[-18, -9, 0, 9, 18].map((x) => (
        <line key={x} x1={x} y1="-20" x2={x} y2="-10" strokeWidth="1" />
      ))}
      <path d="M -26 -22 Q -26 -56 0 -58 Q 26 -56 26 -22 Z" />
      <path d="M -13 -22 Q -13 -50 0 -57 M 13 -22 Q 13 -50 0 -57" fill="none" strokeWidth="1" />
      <rect x="-5" y="-70" width="10" height="12" />
      <path d="M 0 -84 L 2.6 -76.5 H 10 L 4 -72 L 6.3 -65 L 0 -69 L -6.3 -65 L -4 -72 L -10 -76.5 H -2.6 Z" fill={RED} strokeWidth="1" />
    </g>
  );
}

function Boot() {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <ellipse cx="2" cy="12" rx="15" ry="3.5" fill={INK} opacity="0.25" stroke="none" />
      <path d="M -6 -16 H 6 L 5 2 Q 12 3 16 6 Q 19 8 17 11 H -8 Q -9 6 -7 2 Z" fill="url(#e-metal)" />
      <path d="M -6 -16 Q 0 -13 6 -16" fill="none" />
      <path d="M -4 -10 Q 0 -6 3 -10 M -4 -4 Q 0 0 3 -4" fill="none" strokeWidth="0.9" />
      <path d="M -8 11 V 13 H 0 V 11" fill="url(#e-metal)" />
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
      className="flex flex-col overflow-hidden text-center transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 md:text-left"
      style={{ background: '#fffdf6', border: `2px solid ${INK}`, borderRadius: 3, boxShadow: `3px 3px 0 ${INK}` }}
    >
      <span className="m-1 flex flex-1 flex-col self-stretch justify-center px-1 py-1.5 md:m-1.5 md:flex-none md:px-3 md:py-2" style={{ background: c.fill, color: c.on, border: `1.5px solid ${INK}` }}>
        <span className="block text-[8px] tracking-[0.2em] uppercase opacity-90 md:text-[9px]" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {stop.shortcut ? '★ Streetcar stop' : 'Title deed'}
        </span>
        <span className="block text-[13px] leading-tight uppercase md:text-lg" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}>
          {stop.name}
        </span>
      </span>
      <span className="flex items-center justify-center gap-2 px-2 pb-1.5 md:justify-start md:px-3 md:pb-2.5">
        <Icon className="size-5 shrink-0" color={c.dark} />
        <span className="text-[10px] font-semibold tracking-wider uppercase md:hidden" style={{ color: c.dark }}>
          {THEMES[stop.theme].label}
        </span>
        <span className="hidden text-xs md:block" style={{ color: '#5d5a50' }}>
          {stop.blurb}
        </span>
      </span>
    </button>
  );
}

export const estates = {
  id: 'estates',
  name: 'Capitol Square',
  kicker: 'The game of Austin · 1935',
  era: '1930s property-trading game',
  description: 'A square board with every stop around the edge, title-deed cards, streetcar shortcuts and a silver boot token racing to the Capitol in the middle.',
  colors,
  fonts: { display: 'Limelight, Georgia, serif', body: '"Libre Franklin", system-ui, sans-serif' },
  page: '#bcd3b5',
  panel: '#f7f1df',
  ink: INK,
  muted: '#5d5a50',
  accent: RED,
  accentInk: '#fff',
  titleShadow: 'none',
  divider: INK,
  scrim: 'rgba(29, 29, 27, 0.5)',
  frame: `3px solid ${INK}`,
  radius: '4px',
  dotRadius: '2px',
  shadow: `6px 6px 0 ${INK}`,
  Board,
  Card,
};
