// https://stackoverflow.com/a/72210574/470749

import type { Session } from 'next-session/lib/types';
import nextSession from 'next-session';
import { IncomingMessage, ServerResponse } from 'http';

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

export type FlashSession = Session & { flash?: string | null };

type GetFlashSession = ReplaceReturnType<ReturnType<typeof nextSession>, Promise<FlashSession>>;

export const getFlashSession: GetFlashSession = nextSession();

export async function setFlashVariable(
  req: IncomingMessage & {
    session?: Session;
  },
  res: ServerResponse,
  value: string,
): Promise<void> {
  const flashSession = await getFlashSession(req, res);
  flashSession.flash = value;
  console.log('setFlashVariable', { flashSession });
}
