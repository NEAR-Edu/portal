// eslint-disable-next-line import/no-extraneous-dependencies
import { ScheduledEmail, User } from '.prisma/client';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N; // https://stackoverflow.com/a/53936938/470749

export type SerializableUser = Merge<
  User,
  {
    createdAt: string;
    emailVerified: string;
  }
>;

export type ServerSidePropsRequest = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

export type PropsWithOptionalName = {
  // This is a modified version of GetInputPropsPayload from node_modules/@mantine/form/lib/types.d.ts
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange(event: any): void; // Why did Mantine not use React.ChangeEvent<HTMLInputElement>?
  error?: React.ReactNode;
  name?: string;
};

export type ScheduledPopulatedEmail = ScheduledEmail & {
  user: User;
  sessionUrl?: string;
  slidoId?: string;
};

export type KeyValueStringPairs = { [key: string]: string };
