import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export async function getUser(emailAddress: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      email: emailAddress,
    },
  });
  if (!user) {
    throw new Error('There is no user record for this email address.'); // This should never happen.
  }
  return user;
}

export async function getLoggedInUser(session: Session): Promise<User> {
  const emailAddress = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
  if (!emailAddress) {
    throw new Error('The session lacks the email address of the user.'); // This should never happen.
  }
  return getUser(emailAddress);
}

export function getSerializableUser(user: User) {
  const serializableUser: any = { ...user };
  // https://stackoverflow.com/a/71697699/470749
  // TODO Double-check how time zone works for these fields:
  serializableUser.createdAt = user.createdAt.toUTCString();
  serializableUser.emailVerified = user.emailVerified ? user.emailVerified.toUTCString() : '';
  return user;
}
