import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { STATUS_CODE_ERROR, STATUS_CODE_SUCCESS, STATUS_CODE_UNAUTH } from './update-profile';

// eslint-disable-next-line max-lines-per-function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(STATUS_CODE_UNAUTH).json('Please log in first.');
    return;
  }
  const userEmail = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
  const enrollment = req.body;
  console.log({ userEmail, session });
  const scheduleIds = Array.isArray(enrollment.scheduleId) ? enrollment.scheduleId : [enrollment.scheduleId];
  console.log('Saving enrollment', enrollment, scheduleIds);
  const prisma = new PrismaClient();

  try {
    if (!userEmail) {
      throw new Error('The session lacks the email address of the user.'); // This should never happen.
    }
    // Maybe it would be possible to use just one query instead of two here. Explore: https://www.prisma.io/docs/concepts/components/prisma-client/crud#advanced-query-examples
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    if (!user) {
      throw new Error('There is no user record for this email address.'); // This should never happen.
    }
    scheduleIds.forEach(async (scheduleId: string) => {
      const data = {
        scheduleId,
        userId: user.id,
      };
      console.log('saving data', data);
      const result = await prisma.registration.create({ data }); // TODO: Suppress error from uniqueness constraint.
      console.log('saved', { result });
    });

    res.status(STATUS_CODE_SUCCESS).redirect(307, '/enrolled');
  } catch (error) {
    console.error('Enrollment did not save. Error: ', error);
    res.status(STATUS_CODE_ERROR).json({
      message: `Something went wrong.`,
    });
  }
}
