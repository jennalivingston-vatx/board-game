import { useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Landmark, MapPin, RotateCcw, Sparkles } from 'lucide-react';
import { Board } from '@/game/Board';
import { HOSTS, Portrait } from '@/game/Characters';
import { FINISH, ITINERARIES, ROUNDS, SPACES, THEMES, roundOf, stopsInRound, winningTheme } from '@/game/data';

export const Route = createFileRoute('/candy-trail')({ component: Game });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Game() {
  const [phase, setPhase] = useState('intro'); // intro → play → done
  const [shown, setShown] = useState(0); // where the piece is drawn
  const [visits, setVisits] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const run = useRef(0); // bumps on restart so an unfinished move stops animating

  const pos = visits.at(-1) ?? 0;
  const round = roundOf(pos);
  const options = phase === 'play' && round < ROUNDS ? stopsInRound(round + 1) : [];

  async function pick(target) {
    if (busy) return;
    const id = run.current;
    const alive = () => run.current === id;
    setBusy(true);
    setMessage(null);

    // Hop one space at a time, like moving a real game piece.
    for (let i = pos + 1; i <= target; i++) {
      setShown(i);
      await sleep(230);
      if (!alive()) return;
    }
    let path = [...visits, target];
    setVisits(path);
    setMessage({ index: target });

    const shortcut = SPACES[target].shortcut;
    if (shortcut) {
      await sleep(900);
      if (!alive()) return;
      setMessage({ index: shortcut.to, shortcut: shortcut.label });
      setShown(shortcut.to);
      path = [...path, shortcut.to];
      setVisits(path);
    }

    if (roundOf(path.at(-1)) === ROUNDS) {
      await sleep(900);
      for (let i = path.at(-1) + 1; i <= FINISH; i++) {
        if (!alive()) return;
        setShown(i);
        await sleep(260);
      }
      await sleep(700);
      if (!alive()) return;
      setPhase('done');
    }
    setBusy(false);
  }

  function restart() {
    run.current++;
    setVisits([]);
    setShown(0);
    setMessage(null);
    setBusy(false);
    setPhase('play');
  }

  return (
    <div className="relative flex h-dvh min-h-[520px] w-full flex-col overflow-hidden bg-[#bfe8ff] md:flex-row">
      <div className="relative min-h-0 flex-1 bg-gradient-to-b from-[#bfe8ff] via-[#fffbd1] to-[#9fe07a] p-2 md:p-4">
        <div className="pointer-events-none absolute inset-0 hidden min-[1200px]:block" aria-hidden="true">
          <Portrait theme="music" className="absolute top-[8%] left-[2%] w-[16%] max-w-56 drop-shadow-lg" />
          <Portrait theme="food" className="absolute bottom-[4%] left-[3%] w-[15%] max-w-52 drop-shadow-lg" />
          <Portrait theme="outdoors" className="absolute right-[3%] bottom-[18%] w-[14%] max-w-48 drop-shadow-lg" />
        </div>
        <Board shown={shown} visits={visits} options={options} onPick={pick} busy={busy} />
      </div>

      <Panel
        visits={visits}
        round={round}
        options={options}
        busy={busy}
        message={message}
        onPick={pick}
        finishing={round === ROUNDS}
      />

      {phase === 'intro' && <Intro onStart={() => setPhase('play')} />}
      {phase === 'done' && <Results visits={visits} onRestart={restart} />}
    </div>
  );
}

function Panel({ visits, round, options, busy, message, onPick, finishing }) {
  const current = message && SPACES[message.index];
  return (
    <aside className="shrink-0 border-t-4 border-[#e8358f] bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:flex md:w-[340px] md:flex-col md:border-t-0 md:border-l-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="candy-title font-display text-xl leading-none font-bold md:text-3xl">Austin Candy Trail</h1>
        <Progress visits={visits} />
      </div>

      <div className="mt-2 flex min-h-[2.75rem] items-start gap-2 text-sm leading-snug md:mt-6 md:min-h-[5rem] md:gap-3 md:text-base" aria-live="polite">
        <Portrait theme={current ? current.theme : 'food'} className="size-12 shrink-0 md:size-20" />
        <div className="relative flex-1 rounded-2xl border-2 border-[#e8358f]/40 bg-[#fff7fb] px-3 py-2">
        {current && <p className="text-[11px] font-bold tracking-wide text-[#c81d73] uppercase">{HOSTS[current.theme].name} says:</p>}
        {current ? (
          <p>
            {message.shortcut && (
              <span className="mr-1 inline-flex items-center gap-1 font-bold text-[#c81d73]">
                <Sparkles className="size-4" />
                {message.shortcut}
              </span>
            )}
            <span className="font-semibold" style={{ color: THEMES[current.theme].dark }}>
              {message.shortcut ? 'Zoom to ' : "You're at "}
              {current.name}.
            </span>{' '}
            <span className="text-muted-foreground">{current.blurb}</span>
          </p>
        ) : (
          <p className="text-muted-foreground">
            {round === 0 ? 'Howdy! Pick your first stop. Land on ⚡ spaces for a shortcut!' : 'On your way…'}
          </p>
        )}
        </div>
      </div>

      {finishing ? (
        <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#fde3ef] p-4 font-display text-lg font-bold text-[#c81d73] md:mt-4">
          <Landmark className="size-5" /> Heading to the Capitol!
        </div>
      ) : (
        <>
          <p className="mt-1 text-xs font-semibold tracking-wide text-[#7a2350] uppercase md:mt-4">Pick your next stop</p>
          <div className="mt-1.5 grid grid-cols-3 gap-2 md:mt-3 md:grid-cols-1 md:gap-3">
            {options.map((i) => (
              <StopCard key={i} index={i} disabled={busy} onPick={onPick} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

function StopCard({ index, disabled, onPick }) {
  const stop = SPACES[index];
  const theme = THEMES[stop.theme];
  const Icon = stop.icon;
  return (
    <button
      type="button"
      onClick={() => onPick(index)}
      disabled={disabled}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border-[3px] bg-white p-2 pt-4 text-center shadow-[0_4px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-1 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 md:flex-row md:gap-3 md:p-3 md:pt-3 md:pl-5 md:text-left"
      style={{ borderColor: theme.color }}
    >
      {/* Candy stripe */}
      <span
        className="absolute inset-x-0 top-0 h-2 md:inset-y-0 md:right-auto md:h-auto md:w-2"
        style={{ background: `repeating-linear-gradient(45deg, ${theme.color} 0 6px, #fff 6px 10px)` }}
      />
      <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: theme.color }}>
        <Icon className="size-5" />
      </span>
      <span className="mt-1.5 min-w-0 md:mt-0">
        <span className="block text-[10px] font-bold tracking-wide uppercase" style={{ color: theme.dark }}>
          {theme.label}
          {stop.shortcut && ' ⚡'}
        </span>
        <span className="block font-display text-sm leading-tight font-bold text-[#3b1530] md:text-base">{stop.name}</span>
        <span className="mt-0.5 hidden text-xs text-muted-foreground md:block">{stop.blurb}</span>
      </span>
    </button>
  );
}

function Progress({ visits }) {
  return (
    <div className="flex gap-1" aria-label="Your stops so far">
      {Array.from({ length: ROUNDS }, (_, r) => {
        const stop = visits.find((i) => roundOf(i) === r + 1);
        return (
          <span
            key={r}
            className="size-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_#ffb3d4] md:size-4"
            style={{ background: stop ? THEMES[SPACES[stop].theme].color : '#fde3ef' }}
          />
        );
      })}
    </div>
  );
}

function Intro({ onStart }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-[#e31e26]/25 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border-4 border-[#e8358f] bg-white p-6 text-center shadow-2xl">
        <p className="text-sm font-bold tracking-widest text-[#e31e26] uppercase">Austin, Texas</p>
        <h1 className="candy-title mt-1 font-display text-5xl leading-none font-bold">Austin Candy Trail</h1>
        <p className="mt-3 text-[#3b1530]">
          Meet your guides! Pick your favorite stops across Austin and race to the Capitol. Where you land decides your perfect Austin day.
        </p>
        <div className="mt-4 grid grid-cols-3 items-end gap-2">
          {Object.entries(THEMES).map(([key, t]) => (
            <div key={key} className="flex flex-col items-center">
              <Portrait theme={key} className="h-20 w-full" />
              <span className="mt-1 text-[11px] leading-tight font-semibold text-[#3b1530]">{HOSTS[key].name}</span>
              <span className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold text-white" style={{ background: t.color }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="mt-6 w-full rounded-full bg-[#e31e26] px-6 py-3 font-display text-xl font-bold text-white shadow-[0_5px_0_#9e1015] transition active:translate-y-1 active:shadow-none"
        >
          Let's go!
        </button>
        <p className="mt-3 text-xs text-muted-foreground">6 picks or fewer · about a minute</p>
      </div>
    </div>
  );
}

function Results({ visits, onRestart }) {
  const { theme, counts } = winningTheme(visits);
  const plan = ITINERARIES[theme];
  const colors = THEMES[theme];
  return (
    <div className="absolute inset-0 z-10 overflow-y-auto bg-[#e31e26]/25 p-3 backdrop-blur-sm md:grid md:place-items-center md:p-6">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 bg-white shadow-2xl" style={{ borderColor: colors.color }}>
        <div className="p-5 text-center text-white md:p-6" style={{ background: `linear-gradient(135deg, ${colors.color}, ${colors.dark})` }}>
          <p className="flex items-center justify-center gap-1 text-xs font-bold tracking-widest uppercase opacity-90">
            <Landmark className="size-4" /> You made it to the Capitol!
          </p>
          <Portrait theme={theme} className="mx-auto mt-3 h-28 drop-shadow-[0_3px_0_rgba(255,255,255,0.6)]" />
          <p className="mt-1 text-xs font-bold tracking-wide uppercase opacity-90">{HOSTS[theme].name}'s pick for you</p>
          <h2 className="mt-1 font-display text-3xl leading-tight font-bold md:text-4xl">{plan.title}</h2>
          <p className="mt-1 text-sm opacity-95">{plan.tagline}</p>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
            {Object.entries(counts).map(([t, n]) => (
              <span key={t} className="rounded-full px-3 py-1" style={{ background: THEMES[t].light, color: THEMES[t].dark }}>
                {n} {THEMES[t].label}
              </span>
            ))}
          </div>

          <ol className="mt-5 space-y-3">
            {plan.stops.map((s) => (
              <li key={s.time} className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-white" style={{ background: colors.color }}>
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-wide uppercase" style={{ color: colors.dark }}>
                    {s.time}
                  </p>
                  <p className="font-semibold text-[#3b1530]">{s.what}</p>
                  <p className="text-sm text-muted-foreground">{s.tip}</p>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={onRestart}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#e31e26] px-6 py-3 font-display text-lg font-bold text-white shadow-[0_5px_0_#9e1015] transition active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="size-5" /> Play again
          </button>
        </div>
      </div>
    </div>
  );
}
