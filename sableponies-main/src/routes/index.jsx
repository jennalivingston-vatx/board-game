import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

// The home page is Bat Bridge Bound, which lives on its own in public/bat-bridge.html.
// The Austin Candy Trail game is at /candy-trail.
function Home() {
  useEffect(() => {
    document.title = 'Bat Bridge Bound: An Austin Adventure';
  }, []);
  return <iframe src="/bat-bridge.html" title="Bat Bridge Bound: an Austin board game" className="block h-dvh w-full border-0" />;
}
