import { FINISH, SPACES, THEMES } from './data';
import { BellaBat, Butterfly, CharacterDefs, DukeDillo, Prickles, RosieRoadrunner, SalSalamander, Sign } from './Characters';

// Board coordinates live in a 360 × 640 drawing that scales to fit any screen.
const COLUMNS = [60, 140, 220, 300];
const ROWS = [585, 478, 371, 264, 157];

// Stops snake back and forth in rows of four, from the bottom up, ending at the Capitol.
export const POSITIONS = SPACES.map((_, i) => {
  if (i === FINISH) return { x: 286, y: 66 };
  const row = Math.floor(i / 4);
  const step = i % 4;
  const col = row % 2 === 0 ? step : 3 - step;
  return { x: COLUMNS[col], y: ROWS[row] + (step % 2 ? -12 : 8) };
});

// A smooth curve through the points, for the candy road.
function smoothPath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const ROAD = smoothPath(POSITIONS);

// Road squares repeat red, purple, yellow, blue, orange, green.
const ROAD_COLORS = ['#e31e26', '#8e3a9d', '#ffe200', '#1e9ad6', '#f7941d', '#3bb54a'];
const SQUARE = 22;

function shortcutPath(from, to) {
  const a = POSITIONS[from];
  const b = POSITIONS[to];
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  // Bow the arc toward the middle of the board so it reads as a separate path.
  const bow = mid.x < 180 ? 40 : -40;
  return `M ${a.x} ${a.y} Q ${mid.x + bow} ${mid.y - 30} ${b.x} ${b.y}`;
}

export function Board({ shown, visits, options, onPick, busy }) {
  const token = POSITIONS[shown];

  return (
    <svg viewBox="0 0 360 640" className="size-full" role="img" aria-label="Austin Candy Trail game board">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8ff" />
          <stop offset="0.18" stopColor="#fffbd1" />
          <stop offset="0.5" stopColor="#e9f9a8" />
          <stop offset="1" stopColor="#9fe07a" />
        </linearGradient>
        <radialGradient id="gloss" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <CharacterDefs />
        <filter id="lift" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#7a2350" floodOpacity="0.25" />
        </filter>
      </defs>

      <rect x="4" y="4" width="352" height="632" rx="28" fill="url(#sky)" stroke="#e8358f" strokeWidth="5" />

      {/* Rolling Hill Country meadows */}
      <path d="M4 330 Q 70 300 150 326 T 356 312 V 420 H 4 Z" fill="#c6ef8f" opacity="0.7" />
      <path d="M4 560 Q 90 520 180 556 T 356 540 V 608 Q 356 636 328 636 H 32 Q 4 636 4 608 Z" fill="#7fd65a" />
      <path d="M4 600 Q 120 570 220 600 T 356 590 V 608 Q 356 636 328 636 H 32 Q 4 636 4 608 Z" fill="#4fc23f" />

      {/* Sun */}
      <circle cx="38" cy="40" r="20" fill="#ffe200" />
      <circle cx="38" cy="40" r="27" fill="none" stroke="#ffe200" strokeWidth="3" strokeDasharray="4 7" />

      <Decorations />

      {/* The candy road: a white edge with rainbow squares on top, like a classic board game */}
      <path d={ROAD} fill="none" stroke="#fff" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" filter="url(#lift)" />
      {ROAD_COLORS.map((color, i) => (
        <path
          key={color}
          d={ROAD}
          fill="none"
          stroke={color}
          strokeWidth="26"
          strokeDasharray={`${SQUARE - 3} ${SQUARE * ROAD_COLORS.length - SQUARE + 3}`}
          strokeDashoffset={-i * SQUARE}
        />
      ))}

      {/* Shortcuts */}
      {SPACES.map((s, i) =>
        s.shortcut ? (
          <path
            key={`sc-${i}`}
            d={shortcutPath(i, s.shortcut.to)}
            fill="none"
            stroke={THEMES[s.theme].color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 9"
          />
        ) : null,
      )}

      <Cast />

      <Capitol />

      {/* Start */}
      <g transform={`translate(${POSITIONS[0].x} ${POSITIONS[0].y})`} filter="url(#lift)">
        <circle r="25" fill="#e31e26" stroke="#fff" strokeWidth="4" />
        <text textAnchor="middle" y="6" fontSize="16" fontWeight="700" fill="#fff" className="font-display">
          GO!
        </text>
      </g>

      {/* Stops */}
      {SPACES.map((s, i) => {
        if (!s.theme) return null;
        const { x, y } = POSITIONS[i];
        const theme = THEMES[s.theme];
        const Icon = s.icon;
        const isOption = !busy && options.includes(i);
        const visited = visits.includes(i);
        return (
          <g
            key={i}
            transform={`translate(${x} ${y})`}
            onClick={isOption ? () => onPick(i) : undefined}
            className={isOption ? 'cursor-pointer' : undefined}
          >
            <title>{s.name}</title>
            {isOption && (
              <rect x="-29" y="-29" width="58" height="58" rx="16" fill={theme.color} opacity="0.35" className="animate-pulse" />
            )}
            <rect
              x="-22"
              y="-22"
              width="44"
              height="44"
              rx="12"
              fill={theme.color}
              stroke={visited ? '#ffe200' : '#fff'}
              strokeWidth={visited ? 5 : 3.5}
              filter="url(#lift)"
            />
            <rect x="-22" y="-22" width="44" height="44" rx="12" fill="url(#gloss)" />
            <Icon x="-12" y="-12" size={24} color="#fff" strokeWidth={2.2} />
            {s.shortcut && (
              <g transform="translate(18 -18)">
                <circle r="8" fill="#ffe200" stroke="#fff" strokeWidth="2" />
                <text textAnchor="middle" y="4" fontSize="11" fontWeight="700" fill="#7a2350">
                  ⚡
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Player piece */}
      <g
        style={{ transform: `translate(${token.x}px, ${token.y - 30}px)`, transition: 'transform 260ms cubic-bezier(.3,1.6,.6,1)' }}
        filter="url(#lift)"
        pointerEvents="none"
      >
        <Piece />
      </g>
    </svg>
  );
}

function Piece() {
  return (
    <g>
      <ellipse cx="0" cy="22" rx="12" ry="4" fill="#7a2350" opacity="0.2" />
      <path d="M -11 20 Q -11 2 0 0 Q 11 2 11 20 Z" fill="#e31e26" stroke="#fff" strokeWidth="2.5" />
      <circle cx="0" cy="-6" r="9" fill="#e31e26" stroke="#fff" strokeWidth="2.5" />
      {/* Cowboy hat */}
      <path d="M -15 -12 Q 0 -6 15 -12 Q 10 -9 0 -9 Q -10 -9 -15 -12 Z" fill="#8a4b20" stroke="#fff" strokeWidth="1.5" />
      <path d="M -7 -11 Q -7 -22 0 -21 Q 7 -22 7 -11 Z" fill="#8a4b20" stroke="#fff" strokeWidth="1.5" />
    </g>
  );
}

function Capitol() {
  const { x, y } = POSITIONS[FINISH];
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#lift)">
      <rect x="-44" y="12" width="88" height="22" rx="4" fill="#ffc6dd" stroke="#fff" strokeWidth="3" />
      {[-34, -20, -6, 8, 22].map((cx) => (
        <rect key={cx} x={cx} y="14" width="5" height="18" rx="2" fill="#fff" opacity="0.8" />
      ))}
      <rect x="-24" y="-2" width="48" height="16" rx="3" fill="#ffd9e8" stroke="#fff" strokeWidth="3" />
      <path d="M -22 -2 Q -22 -34 0 -36 Q 22 -34 22 -2 Z" fill="#ff8fc1" stroke="#fff" strokeWidth="3" />
      {/* Frosting drips on the dome */}
      <path
        d="M -18 -20 Q -10 -36 0 -36 Q 10 -36 18 -20 Q 16 -12 14 -18 Q 11 -10 8 -18 Q 5 -8 2 -17 Q -1 -11 -4 -18 Q -7 -9 -10 -18 Q -13 -12 -18 -20 Z"
        fill="#fff"
      />
      <circle cx="-6" cy="-28" r="1.3" fill="#1e9ad6" />
      <circle cx="5" cy="-30" r="1.3" fill="#e31e26" />
      <circle cx="10" cy="-24" r="1.3" fill="#3bb54a" />
      <path d="M -10 -4 Q -10 -30 0 -34 M 10 -4 Q 10 -30 0 -34" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" />
      <rect x="-3" y="-46" width="6" height="11" fill="#ffc6dd" stroke="#fff" strokeWidth="2" />
      <path d="M 0 -60 L 3 -52 L 11 -52 L 5 -47 L 7 -40 L 0 -44 L -7 -40 L -5 -47 L -11 -52 L -3 -52 Z" fill="#ffe200" stroke="#fff" strokeWidth="1.5" />
      <rect x="-40" y="36" width="80" height="18" rx="9" fill="#e31e26" />
      <text textAnchor="middle" y="49" fontSize="11" fontWeight="700" fill="#fff" className="font-display">
        FINISH
      </text>
    </g>
  );
}

function Lollipop({ x, y, color, size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <rect x="-1.5" y="0" width="3" height="26" rx="1.5" fill="#fff" stroke="#e7c7d6" />
      <circle r="13" fill={color} stroke="#fff" strokeWidth="3" />
      <path d="M 0 0 m -8 0 a 8 8 0 1 1 8 8 a 5 5 0 1 1 -5 -5 a 2 2 0 1 1 2 2" fill="none" stroke="#fff" strokeWidth="2.5" />
    </g>
  );
}

function Gumdrop({ x, y, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -11 0 Q -11 -16 0 -17 Q 11 -16 11 0 Z" fill={color} stroke="#fff" strokeWidth="2" />
      <path d="M -11 0 Q -11 -16 0 -17 Q 11 -16 11 0 Z" fill="url(#gloss)" />
      {/* Sugar sparkles */}
      {[
        [-5, -11],
        [3, -7],
        [-2, -4],
        [6, -12],
        [-7, -5],
      ].map(([sx, sy]) => (
        <circle key={`${sx}${sy}`} cx={sx} cy={sy} r="1.2" fill="#fff" opacity="0.9" />
      ))}
    </g>
  );
}

function CandyCane({ x, y, size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} fill="none" strokeLinecap="round">
      <path d="M 0 0 V -26 Q 0 -34 7 -34 Q 14 -34 14 -27" stroke="#fff" strokeWidth="6" />
      <path d="M 0 0 V -26 Q 0 -34 7 -34 Q 14 -34 14 -27" stroke="#e31e26" strokeWidth="6" strokeDasharray="4 4" />
    </g>
  );
}

function Cactus({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#3bb54a" stroke="#fff" strokeWidth="2">
      <rect x="-5" y="-30" width="10" height="30" rx="5" />
      <path d="M -5 -14 H -12 Q -15 -14 -15 -18 V -24" strokeLinecap="round" fill="none" stroke="#3bb54a" strokeWidth="6" />
      <path d="M 5 -18 H 11 Q 14 -18 14 -22 V -26" strokeLinecap="round" fill="none" stroke="#3bb54a" strokeWidth="6" />
    </g>
  );
}

function Sparkle({ x, y, r = 5, color = '#fff' }) {
  return (
    <path
      d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`}
      fill={color}
    />
  );
}

function Decorations() {
  return (
    <g pointerEvents="none">
      {/* Lollipop grove */}
      <Lollipop x={20} y={92} color="#8e3a9d" size={0.75} />
      <Lollipop x={44} y={104} color="#3bb54a" size={0.6} />
      <Lollipop x={22} y={520} color="#8e3a9d" size={0.8} />
      <Lollipop x={340} y={418} color="#f7941d" size={0.8} />
      <Lollipop x={20} y={312} color="#1e9ad6" size={0.8} />
      <Lollipop x={340} y={196} color="#e31e26" size={0.8} />
      {/* Gumdrop springs */}
      <Gumdrop x={316} y={444} color="#1e9ad6" />
      <Gumdrop x={336} y={452} color="#f49ac1" />
      <Gumdrop x={326} y={460} color="#ffe200" />
      <Gumdrop x={262} y={552} color="#ffe200" />
      <Gumdrop x={100} y={432} color="#f49ac1" />
      <Gumdrop x={258} y={326} color="#8e3a9d" />
      <Gumdrop x={104} y={222} color="#3bb54a" />
      <Gumdrop x={30} y={630} color="#1e9ad6" />
      <CandyCane x={300} y={630} size={0.9} />
      <CandyCane x={20} y={420} size={0.7} />
      <CandyCane x={340} y={300} size={0.7} />
      <Cactus x={340} y={620} />
      <Cactus x={108} y={122} />
      {/* Little bats leaving the Congress Avenue Bridge */}
      {[
        [108, 30],
        [196, 26],
        [206, 44],
        [96, 52],
      ].map(([bx, by]) => (
        <path key={bx} d={`M ${bx - 6} ${by} Q ${bx - 3} ${by - 4} ${bx} ${by} Q ${bx + 3} ${by - 4} ${bx + 6} ${by}`} fill="none" stroke="#5b3a6b" strokeWidth="1.8" />
      ))}
      {[
        [78, 20, 4],
        [230, 92, 5],
        [330, 140, 4],
        [18, 200, 5],
        [200, 420, 3.5],
        [52, 552, 4],
        [176, 616, 5],
        [330, 512, 4],
        [150, 326, 3.5],
      ].map(([sx, sy, r]) => (
        <Sparkle key={`${sx}${sy}`} x={sx} y={sy} r={r} />
      ))}
    </g>
  );
}

// The characters, each in the open meadow between two rows of the trail.
function Cast() {
  return (
    <g pointerEvents="none">
      <g transform="translate(95 553) scale(0.55)">
        <DukeDillo />
      </g>
      <Sign x={180} y={528} lines={['DUKE', 'DILLO']} width={44} />

      <g transform="translate(258 450) scale(0.6)">
        <SalSalamander />
      </g>
      <Sign x={178} y={418} lines={['SAL OF THE', 'SPRINGS']} width={58} />

      <g transform="translate(100 345) scale(0.56)">
        <RosieRoadrunner />
      </g>
      <Sign x={182} y={308} lines={['ROSIE', 'ROADRUNNER']} width={60} />

      <g transform="translate(270 238) scale(0.72)">
        <Prickles />
      </g>
      <Sign x={180} y={200} lines={['PRICKLES']} width={52} />

      <g transform="translate(152 56) scale(0.85)">
        <BellaBat />
      </g>
      <Sign x={198} y={100} lines={['BAT BRIDGE']} width={56} />

      <g transform="translate(30 470) scale(0.8)">
        <Butterfly />
      </g>
      <g transform="translate(322 390) scale(0.7) rotate(-20)">
        <Butterfly />
      </g>
      <g transform="translate(36 236) scale(0.75) rotate(15)">
        <Butterfly />
      </g>
    </g>
  );
}
