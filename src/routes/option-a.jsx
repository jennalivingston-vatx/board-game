import { createFileRoute } from '@tanstack/react-router';
import { GameShell } from '@/game/GameShell';
import { candy } from '@/game/skins/candy';

export const Route = createFileRoute('/option-a')({ component: () => <GameShell skin={candy} /> });
