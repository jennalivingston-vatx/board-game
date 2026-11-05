import { createFileRoute } from '@tanstack/react-router';
import { GameShell } from '@/game/GameShell';
import { spiral } from '@/game/skins/spiral';

export const Route = createFileRoute('/option-c')({ component: () => <GameShell skin={spiral} /> });
