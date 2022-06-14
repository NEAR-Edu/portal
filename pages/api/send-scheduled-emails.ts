import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmailsNow } from '../../helpers/email';
import { STATUS_CODE_ERROR, STATUS_CODE_SUCCESS } from '../../helpers/statusCodes';
import { getNowUtc } from '../../helpers/time';
import { ScheduledEmailWithRecipient } from '../../helpers/types';

async function getScheduledEmails(dateTimeUtc: string): Promise<ScheduledEmailWithRecipient[]> {
  const prisma = new PrismaClient();
  const scheduledEmails = await prisma.scheduledEmail.findMany({
    where: {
      scheduledSendTimeUtc: { lte: dateTimeUtc },
      actualSendTimeUtc: { equals: null },
    },
    include: {
      // https://www.prisma.io/docs/concepts/components/prisma-client/crud#advanced-query-examples
      user: true,
    },
  });

  return scheduledEmails;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ONEDAY Add security
  const now = getNowUtc();
  const scheduledEmails = await getScheduledEmails(now);
  console.log({ scheduledEmails });
  const result = sendEmailsNow(scheduledEmails);

  if (result) {
    res.status(STATUS_CODE_ERROR).json({
      message: result,
    });
  } else {
    res.status(STATUS_CODE_SUCCESS).json({
      message: 'Finished.',
    });
  }

  // ONEDAY Prune table of emails that have been sent long ago (otherwise the DB size will get enormous).
}
