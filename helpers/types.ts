// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';

export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N; // https://stackoverflow.com/a/53936938/470749

export type SerializableUser = Merge<
  User,
  {
    createdAt: string;
    emailVerified: string;
  }
>;
