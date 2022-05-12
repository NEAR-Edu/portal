/* eslint-disable import/prefer-default-export */

import { PrismaClient } from '@prisma/client';
import { DefaultSession } from 'next-auth';

export async function isProfileComplete(session: DefaultSession): Promise<boolean> {
  const userEmail = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
  if (!userEmail) {
    throw new Error('The session lacks the email address of the user.'); // This should never happen.
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  if (!user) {
    throw new Error('There is no user record for this email address.'); // This should never happen.
  }
  return Boolean(user.country) && Boolean(user.name); // TODO: Check all of the required fields.
}
