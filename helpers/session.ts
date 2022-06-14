// See https://github.com/vvo/iron-session#session-wrappers and https://stackoverflow.com/a/72210574/470749

import type { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
import { TypeOptions } from 'react-toastify';
import { Flash, ServerSidePropsRequest } from './types';

const secretCookiePassword = process.env.SECRET_COOKIE_PASSWORD as string;
const secure = process.env.NODE_ENV === 'production';

export const sessionOptions: IronSessionOptions = {
  password: secretCookiePassword,
  cookieName: 'sid',
  cookieOptions: { secure },
};

declare module 'iron-session' {
  interface IronSessionData {
    flash?: string | undefined;
  }
}

export const withSessionRoute = (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = <P extends Record<string, unknown> = Record<string, unknown>>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => withIronSessionSsr(handler, sessionOptions);

async function setFlashJson(req: ServerSidePropsRequest, flash: Flash): Promise<void> {
  const flashSession = req.session;
  flashSession.flash = JSON.stringify(flash);
  await flashSession.save();
  console.log('setFlashVariable', { flashSession });
}

export async function setFlashVariable(req: ServerSidePropsRequest, message: string, type: TypeOptions): Promise<void> {
  const flash: Flash = { message, toastifyOptions: { type } };
  return setFlashJson(req, flash);
}

export async function pluckFlash(req: ServerSidePropsRequest): Promise<Flash | null> {
  const flashSession = req.session;
  console.log('pluckFlash', { flashSession });
  // If there's a flash message, transfer it to a context, then clear it.
  const { flash = null } = flashSession;
  console.log({ flash });
  delete flashSession.flash;
  await flashSession.save();
  return flash ? (JSON.parse(flash) as Flash) : null;
}
