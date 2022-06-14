import { PrismaClient, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { filterToFuture, getScheduleRecordsFromAllPages, ScheduleRecordObj, sortAscByDate } from '../../helpers/airtable';
import { defaultSender, scheduleEmail, sendEmailNow, SESSION_URL_PLACEHOLDER } from '../../helpers/email';
import { chooseProgramPath } from '../../helpers/paths';
import { setFlashVariable, withSessionRoute } from '../../helpers/session';
import { STATUS_CODE_ERROR, STATUS_CODE_TEMP_REDIRECT, STATUS_CODE_UNAUTH } from '../../helpers/statusCodes';
import { getFormattedDateTime, getMomentBefore } from '../../helpers/time';
import { getLoggedInUser } from '../../helpers/user';

const REMINDER_EMAIL_MINS = 10;

function getScheduleRecord(scheduleId: string, scheduleRecords: ScheduleRecordObj[]): ScheduleRecordObj {
  const scheduleRecord = scheduleRecords.find((record) => record.id === scheduleId);
  if (!scheduleRecord) {
    throw new Error('This scheduleId could not be found in the array of upcoming events.'); // This should never happen.
  }
  return scheduleRecord;
}

function getEmailDetails(scheduleRecord: ScheduleRecordObj, timeZone: string) {
  // TODO: Design nice email subject and HTML body. Accept the user's preferred time zone as a parameter so that the program time can be displayed in their preferred time zone.
  const subject = `Enrollment confirmation for ${scheduleRecord.programName}`;
  const body = `You have been enrolled in a class that starts ${getFormattedDateTime(scheduleRecord.start, timeZone)}.`;
  console.log({ body });
  return { subject, body };
}

async function scheduleReminderEmail(scheduleRecord: ScheduleRecordObj, user: User) {
  const scheduledSendTimeUtc = getMomentBefore(scheduleRecord.start, REMINDER_EMAIL_MINS, 'minutes');
  // TODO: Fix these params. The message should probably be similar to getEmailDetails.
  const html = `Click here to enter the session at ${scheduleRecord.start} UTC: ${SESSION_URL_PLACEHOLDER}`;
  scheduleEmail(scheduledSendTimeUtc, user.id, `Starting in ${REMINDER_EMAIL_MINS} minutes: ${scheduleRecord.programName}`, html, defaultSender, scheduleRecord.id);
}

// eslint-disable-next-line max-lines-per-function
const handler = withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(STATUS_CODE_UNAUTH).json('Please log in first.');
    return;
  }

  const enrollment = req.body;
  console.log({ session });
  const scheduleIds = Array.isArray(enrollment.scheduleId) ? enrollment.scheduleId : [enrollment.scheduleId];
  console.log('Saving enrollment', enrollment, scheduleIds);
  const scheduleRecords = await getScheduleRecordsFromAllPages(filterToFuture, sortAscByDate); // These come from Airtable.
  const prisma = new PrismaClient();

  try {
    // Maybe it would be possible to use just one query instead of two here. Explore: https://www.prisma.io/docs/concepts/components/prisma-client/crud#advanced-query-examples
    const user = await getLoggedInUser(session);
    scheduleIds.forEach(async (scheduleId: string) => {
      const data = {
        scheduleId,
        userId: user.id,
      };
      console.log('saving data', data);
      const result = await prisma.registration.create({ data });
      const scheduleRecord = getScheduleRecord(scheduleId, scheduleRecords);
      const { subject, body } = getEmailDetails(scheduleRecord, user.timeZone as string);
      sendEmailNow(user.email as string, subject, body);
      scheduleReminderEmail(scheduleRecord, user);
      console.log('saved', { result });
    });
    const flashMessage = `You will receive ${scheduleIds.length} confirmation email(s) since you just enrolled in: ${JSON.stringify({ scheduleIds })}.`;
    await setFlashVariable(req, flashMessage, 'success'); // ONEDAY Add a message about which (if any) were *just* enrolled during this request. Should await all promises to complete and should pass along only the scheduleIds that were confirmed to be saved.
    res.redirect(STATUS_CODE_TEMP_REDIRECT, chooseProgramPath);
  } catch (error) {
    console.error('Enrollment did not save. Error: ', error);
    res.status(STATUS_CODE_ERROR).json({
      message: `Something went wrong.`,
    });
  }
});

export default handler;
