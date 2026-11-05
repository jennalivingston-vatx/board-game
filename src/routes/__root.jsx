import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-32 text-center">
      <h1 className="font-display text-5xl font-bold">Off the trail</h1>
      <p className="mt-4 text-muted-foreground">We couldn't find that page.</p>
      <Button className="mt-8" asChild>
        <Link to="/">Back to the game</Link>
      </Button>
    </section>
  );
}
