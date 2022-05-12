import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { filterToFuture, getScheduleRecordsFromAllPages, ScheduleRecordObj, sortAscByDate } from '../../helpers/airtable';
import sendEmailNow from '../../helpers/email';
import { chooseProgramPath } from '../../helpers/paths';
import { STATUS_CODE_ERROR, STATUS_CODE_SUCCESS, STATUS_CODE_UNAUTH } from './update-profile';

function getScheduleRecord(scheduleId: string, scheduleRecords: ScheduleRecordObj[]): ScheduleRecordObj {
  const scheduleRecord = scheduleRecords.find((record) => record.id === scheduleId);
  if (!scheduleRecord) {
    throw new Error('This scheduleId could not be found in the array of upcoming events.'); // This should never happen.
  }
  return scheduleRecord;
}

function getEmailDetails(scheduleRecord: ScheduleRecordObj) {
  // TODO: Design nice email subject and HTML body. Accept the user's preferred time zone as a parameter so that the program time can be displayed in their preferred time zone.
  const subject = `Enrollment confirmation for ${scheduleRecord.programName}`;
  const body = `You have been enrolled in a class that starts ${scheduleRecord.start}.`;
  return { subject, body };
}

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
  const scheduleRecords = await getScheduleRecordsFromAllPages(filterToFuture, sortAscByDate); // These come from Airtable.
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
      const result = await prisma.registration.create({ data });
      const scheduleRecord = getScheduleRecord(scheduleId, scheduleRecords);
      const { subject, body } = getEmailDetails(scheduleRecord);
      sendEmailNow(userEmail, subject, body);
      console.log('saved', { result });
    });

    res.status(STATUS_CODE_SUCCESS).redirect(307, chooseProgramPath); // We might want to add a session flash variable toast message here. https://stackoverflow.com/q/72206121/470749 // Add a message about which (if any) were *just* enrolled during this request.
  } catch (error) {
    console.error('Enrollment did not save. Error: ', error);
    res.status(STATUS_CODE_ERROR).json({
      message: `Something went wrong.`,
    });
  }
}
