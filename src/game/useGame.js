import { useRef, useState } from 'react';
import { FINISH, ROUNDS, SPACES, roundOf, stopsInRound } from './data';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The game's rules and piece movement, shared by every board design.
export function useGame() {
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

  return { phase, start: () => setPhase('play'), shown, visits, busy, message, round, options, pick, restart };
}
