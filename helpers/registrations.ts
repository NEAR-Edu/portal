/* eslint-disable import/prefer-default-export */
import { PrismaClient, Registration } from '@prisma/client';
import { getFutureScheduleRecords, ScheduleRecordObj } from './airtable';

function getFutureScheduleIdsEnrolledAlready(scheduleRecords: ScheduleRecordObj[], allRegistrationsForThisUser: Registration[]): string[] {
  const futureScheduleIdsEnrolledAlready: string[] = [];
  const allRegisteredScheduleIdsForThisUser = allRegistrationsForThisUser.map((registration) => registration.scheduleId);
  scheduleRecords.forEach((scheduleRecord) => {
    if (allRegisteredScheduleIdsForThisUser.includes(scheduleRecord.id)) {
      futureScheduleIdsEnrolledAlready.push(scheduleRecord.id);
    }
  });
  return futureScheduleIdsEnrolledAlready;
}

export async function getUpcomingSchedule(userEmail?: string) {
  const scheduleRecords = await getFutureScheduleRecords(); // These come from Airtable.
  let futureScheduleIdsEnrolledAlready: string[] = [];
  if (userEmail) {
    const prisma = new PrismaClient();
    const allRegistrationsForThisUser = await prisma.registration.findMany({
      /* Ideally we would fetch only registrations for future events. But the dates are stored in Airtable. So we must fetch *all* registrations for this 
     user(no limit) and then check against which events we found from Airtable(which are all in the future). */
      where: {
        user: {
          email: userEmail,
        },
      },
    });
    futureScheduleIdsEnrolledAlready = getFutureScheduleIdsEnrolledAlready(scheduleRecords, allRegistrationsForThisUser);
  }
  return { scheduleRecords, futureScheduleIdsEnrolledAlready };
}
