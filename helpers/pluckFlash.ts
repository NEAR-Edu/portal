/* eslint-disable import/prefer-default-export */
// https://stackoverflow.com/a/72210574/470749

import type { FlashSession } from './getFlashSession';

export function pluckFlash(flashSession: FlashSession) {
  // If there's a flash message, transfer it to a context, then clear it.
  const { flash = null } = flashSession;
  console.log({ flash });
  // eslint-disable-next-line no-param-reassign
  delete flashSession.flash;
  return flash;
}
