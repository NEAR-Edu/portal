import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { STATUS_CODE_ERROR, STATUS_CODE_SUCCESS, STATUS_CODE_TEMP_REDIRECT, STATUS_CODE_UNAUTH } from '../../helpers/statusCodes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(STATUS_CODE_UNAUTH).json('Please log in first.');
    return;
  }
  const userEmail = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
  const user = req.body;
  console.log({ req, userEmail, session });
  console.log('Saving user', user);
  const prisma = new PrismaClient();

  try {
    if (!userEmail) {
      throw new Error('The session lacks the email address of the user.'); // This should never happen.
    }
    const result = await prisma.user.update({
      // https://www.prisma.io/docs/concepts/components/prisma-client/crud#update
      where: {
        email: userEmail,
      },
      data: user,
    });
    console.log('saved', { result });
    res.status(STATUS_CODE_SUCCESS).redirect(STATUS_CODE_TEMP_REDIRECT, '/choose-program');
  } catch (error) {
    console.error('Profile did not save. Error: ', error);
    res.status(STATUS_CODE_ERROR).json({
      message: `Something went wrong.`,
    });
  }
}
