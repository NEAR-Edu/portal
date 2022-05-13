/* eslint-disable import/prefer-default-export */
// https://stackoverflow.com/a/72210574/470749

import { IncomingMessage, ServerResponse } from 'http';
import { Session } from 'next-session/lib/types';
import { getFlashSession } from './getFlashSession';

export async function pluckFlash(
  req: IncomingMessage & {
    session?: Session;
  },
  res: ServerResponse,
) {
  const flashSession = await getFlashSession(req, res);
  console.log('pluckFlash', { flashSession });
  // If there's a flash message, transfer it to a context, then clear it.
  const { flash = null } = flashSession;
  console.log({ flash });

  delete flashSession.flash;
  return flash;
}
