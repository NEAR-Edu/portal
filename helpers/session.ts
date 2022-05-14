import type { IronSessionOptions } from 'iron-session';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

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

type SpecialSessionReq = any; // TODO. See https://github.com/vvo/iron-session#session-wrappers

export const withSessionRoute = (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = <P extends Record<string, unknown> = Record<string, unknown>>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => withIronSessionSsr(handler, sessionOptions);

export async function setFlashVariable(req: SpecialSessionReq, value: string): Promise<void> {
  const flashSession = req.session;
  flashSession.flash = value;
  await flashSession.save();
  console.log('setFlashVariable', { flashSession });
}

export async function pluckFlash(req: SpecialSessionReq) {
  const flashSession = req.session;
  console.log('pluckFlash', { flashSession });
  // If there's a flash message, transfer it to a context, then clear it.
  const { flash = null } = flashSession;
  console.log({ flash });
  delete flashSession.flash;
  await flashSession.save();
  return flash;
}
