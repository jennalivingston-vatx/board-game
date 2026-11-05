import { createFileRoute, Link } from '@tanstack/react-router';
import { candy } from '@/game/skins/candy';
import { estates } from '@/game/skins/estates';
import { spiral } from '@/game/skins/spiral';

export const Route = createFileRoute('/designs')({ component: Designs });

const OPTIONS = [
  { letter: 'A', to: '/option-a', skin: candy },
  { letter: 'B', to: '/option-b', skin: estates },
  { letter: 'C', to: '/option-c', skin: spiral },
];

// Side-by-side previews of the three board designs.
function Designs() {
  return (
    <div className="min-h-dvh bg-[#f3ead8] px-4 py-10 text-[#2a2420]">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-bold tracking-[0.3em] text-[#8a7a66] uppercase">Austin board game</p>
        <h1 className="mt-2 text-center font-[Georgia,serif] text-4xl md:text-5xl">Three vintage looks</h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#5d5348]">
          Same game, same Austin stops, same three itineraries. Open each one and play a round to compare.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {OPTIONS.map(({ letter, to, skin }) => (
            <Link
              key={letter}
              to={to}
              className="group flex flex-col overflow-hidden rounded-md border-2 border-[#2a2420] bg-white shadow-[5px_5px_0_#2a2420] transition hover:-translate-y-1"
            >
              <div className="pointer-events-none h-80 p-3" style={{ background: skin.page }}>
                <skin.Board shown={0} visits={[]} options={[]} onPick={() => {}} busy />
              </div>
              <div className="flex flex-1 flex-col border-t-2 border-[#2a2420] p-5">
                <p className="text-xs font-bold tracking-[0.2em] text-[#8a7a66] uppercase">
                  Option {letter} · {skin.era}
                </p>
                <h2 className="mt-1 text-2xl" style={{ fontFamily: skin.fonts.display, color: skin.accent }}>
                  {skin.name}
                </h2>
                <p className="mt-2 flex-1 text-sm text-[#5d5348]">{skin.description}</p>
                <span className="mt-4 text-sm font-bold underline-offset-4 group-hover:underline">Play Option {letter} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
