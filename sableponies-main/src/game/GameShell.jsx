import { Link } from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { ITINERARIES, ROUNDS, SPACES, THEMES, roundOf, winningTheme } from './data';
import { useGame } from './useGame';

// The game screen. A `skin` (see src/game/skins/) supplies the board, the stop cards,
// the colors and the fonts; everything else is shared.
export function GameShell({ skin }) {
  const g = useGame();
  const finishing = g.round === ROUNDS;

  return (
    <div
      className="relative flex h-dvh min-h-[520px] w-full flex-col overflow-hidden md:flex-row"
      style={{ background: skin.page, color: skin.ink, fontFamily: skin.fonts.body }}
    >
      <div className="relative min-h-0 flex-1 p-2 md:p-6">
        <skin.Board shown={g.shown} visits={g.visits} options={g.options} onPick={g.pick} busy={g.busy} />
      </div>

      <div className="h-2.5 shrink-0 md:h-auto md:w-2.5" style={{ background: skin.divider }} />

      <aside
        className="shrink-0 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:flex md:w-[360px] md:flex-col md:p-7"
        style={{ background: skin.panel }}
      >
        <div className="flex items-center justify-between gap-2">
          <Title skin={skin} className="text-[22px] md:text-[34px]" />
          <Progress skin={skin} visits={g.visits} />
        </div>

        <Message skin={skin} message={g.message} round={g.round} />

        {finishing ? (
          <p className="mt-3 py-4 text-center text-lg md:text-xl" style={{ fontFamily: skin.fonts.display, color: skin.accent }}>
            On to the Capitol!
          </p>
        ) : (
          <>
            <p className="mt-1 text-[11px] font-bold tracking-[0.18em] uppercase md:mt-5" style={{ color: skin.muted }}>
              Pick your next stop
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-2 md:mt-3 md:grid-cols-1 md:gap-3">
              {g.options.map((i) => (
                <skin.Card
                  key={i}
                  index={i}
                  stop={SPACES[i]}
                  colors={skin.colors[SPACES[i].theme]}
                  disabled={g.busy}
                  onPick={g.pick}
                />
              ))}
            </div>
          </>
        )}
      </aside>

      {g.phase === 'intro' && <Intro skin={skin} onStart={g.start} />}
      {g.phase === 'done' && <Results skin={skin} visits={g.visits} onRestart={g.restart} />}
    </div>
  );
}

function Title({ skin, className = '' }) {
  return (
    <h1 className={`leading-[0.95] ${className}`} style={{ fontFamily: skin.fonts.display, color: skin.accent, textShadow: skin.titleShadow }}>
      {skin.name}
    </h1>
  );
}

function Message({ skin, message, round }) {
  const current = message && SPACES[message.index];
  return (
    <div className="mt-2 min-h-[2.6rem] text-sm leading-snug md:mt-5 md:min-h-[4.5rem] md:text-[15px]" aria-live="polite">
      {current ? (
        <p>
          {message.shortcut && (
            <span className="mr-1 font-bold" style={{ color: skin.accent }}>
              ★ {message.shortcut}
            </span>
          )}
          <span className="font-bold" style={{ color: skin.colors[current.theme].dark }}>
            {message.shortcut ? 'Zoom to ' : 'You landed on '}
            {current.name}.
          </span>{' '}
          <span style={{ color: skin.muted }}>{current.blurb}</span>
        </p>
      ) : (
        <p style={{ color: skin.muted }}>
          {round === 0 ? 'Choose your first stop. Spaces marked ★ are shortcuts!' : 'On your way…'}
        </p>
      )}
    </div>
  );
}

function Progress({ skin, visits }) {
  return (
    <div className="flex shrink-0 gap-1" aria-label="Your stops so far">
      {Array.from({ length: ROUNDS }, (_, r) => {
        const stop = visits.find((i) => roundOf(i) === r + 1);
        return (
          <span
            key={r}
            className="size-3.5 md:size-4"
            style={{
              borderRadius: skin.dotRadius,
              border: `1.5px solid ${skin.ink}`,
              background: stop ? skin.colors[SPACES[stop].theme].fill : 'transparent',
            }}
          />
        );
      })}
    </div>
  );
}

function Frame({ skin, children, className = '' }) {
  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ background: skin.panel, border: skin.frame, borderRadius: skin.radius, boxShadow: skin.shadow }}
    >
      {children}
    </div>
  );
}

function BigButton({ skin, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 px-6 py-3 text-xl transition active:translate-y-1 active:shadow-none"
      style={{
        background: skin.accent,
        color: skin.accentInk,
        fontFamily: skin.fonts.display,
        borderRadius: skin.radius,
        border: `2px solid ${skin.ink}`,
        boxShadow: `0 4px 0 ${skin.ink}`,
      }}
    >
      {children}
    </button>
  );
}

function Intro({ skin, onStart }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center p-4" style={{ background: skin.scrim }}>
      <Frame skin={skin} className="max-w-sm p-6 text-center">
        <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: skin.muted }}>
          {skin.kicker}
        </p>
        <Title skin={skin} className="mt-2 text-[40px]" />
        <p className="mt-3">
          Pick your favorite stops across Austin and race to the Capitol. Where you land decides your perfect Austin day.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {Object.entries(THEMES).map(([t, { label }]) => (
            <span
              key={t}
              className="px-3 py-1 text-xs font-bold"
              style={{ background: skin.colors[t].fill, color: skin.colors[t].on, borderRadius: skin.radius, border: `1.5px solid ${skin.ink}` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <BigButton skin={skin} onClick={onStart}>
            Let's go!
          </BigButton>
        </div>
        <p className="mt-3 text-xs" style={{ color: skin.muted }}>
          6 picks or fewer · about a minute
        </p>
      </Frame>
    </div>
  );
}

function Results({ skin, visits, onRestart }) {
  const { theme, counts } = winningTheme(visits);
  const plan = ITINERARIES[theme];
  const c = skin.colors[theme];
  return (
    <div className="absolute inset-0 z-10 overflow-y-auto p-3 md:grid md:place-items-center md:p-6" style={{ background: skin.scrim }}>
      <Frame skin={skin} className="mx-auto max-w-lg">
        <div className="p-5 text-center md:p-6" style={{ background: c.fill, color: c.on, borderBottom: `2px solid ${skin.ink}` }}>
          <p className="text-xs font-bold tracking-[0.25em] uppercase opacity-90">You made it to the Capitol!</p>
          <h2 className="mt-2 text-3xl leading-tight md:text-4xl" style={{ fontFamily: skin.fonts.display }}>
            {plan.title}
          </h2>
          <p className="mt-1 text-sm opacity-95">{plan.tagline}</p>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
            {Object.entries(counts).map(([t, n]) => (
              <span key={t} className="px-3 py-1" style={{ background: skin.colors[t].light, color: skin.colors[t].dark, borderRadius: skin.radius }}>
                {n} {THEMES[t].label}
              </span>
            ))}
          </div>

          <ol className="mt-5 space-y-4">
            {plan.stops.map((s, n) => (
              <li key={s.time} className="flex gap-3">
                <span
                  className="mt-0.5 grid size-7 shrink-0 place-items-center text-sm"
                  style={{ background: c.fill, color: c.on, borderRadius: skin.dotRadius, border: `1.5px solid ${skin.ink}`, fontFamily: skin.fonts.display }}
                >
                  {n + 1}
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: c.dark }}>
                    {s.time}
                  </p>
                  <p className="font-bold">{s.what}</p>
                  <p className="text-sm" style={{ color: skin.muted }}>
                    {s.tip}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6">
            <BigButton skin={skin} onClick={onRestart}>
              <RotateCcw className="size-5" /> Play again
            </BigButton>
          </div>
          <p className="mt-4 text-center text-sm">
            <Link to="/designs" className="underline" style={{ color: skin.muted }}>
              Compare the three designs
            </Link>
          </p>
        </div>
      </Frame>
    </div>
  );
}
