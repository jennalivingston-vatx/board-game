import { createFileRoute } from '@tanstack/react-router';
import { GameShell } from '@/game/GameShell';
import { estates } from '@/game/skins/estates';

export const Route = createFileRoute('/option-b')({ component: () => <GameShell skin={estates} /> });
