/* eslint-disable jsx-a11y/label-has-associated-control */
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Registration } from '.prisma/client';
import Layout from '../components/layout';
import { filterToFuture, getScheduleRecordsFromAllPages, ScheduleRecordObj, sortAscByDate } from '../helpers/airtable';
import { getShortLocalizedDate } from '../helpers/string';

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    // TODO: Add a toast notification explaining the redirect. Ideally, the desired destination should be remembered and should be redirected to after login. https://stackoverflow.com/questions/72190692/how-can-i-show-a-toast-notification-when-redirecting-due-to-lack-of-session-usin
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: '/',
        permanent: false,
      },
    };
  }
  const scheduleRecords = await getScheduleRecordsFromAllPages(filterToFuture, sortAscByDate); // These come from Airtable.
  const userEmail = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
  const prisma = new PrismaClient();
  const allRegistrationsForThisUser = await prisma.registration.findMany({
    // Ideally we would fetch only registrations for future events. But the dates are stored in Airtable. So we must fetch *all* registrations for this user (no limit) and then check against which events we found from Airtable (which are all in the future).
    where: {
      user: {
        email: userEmail,
      },
    },
  });
  const futureScheduleIdsEnrolledAlready = getFutureScheduleIdsEnrolledAlready(scheduleRecords, allRegistrationsForThisUser);
  // TODO: Redirect to /profile if the person's DB record does not yet contain all of the required fields of the profile yet.
  const props = { scheduleRecords, futureScheduleIdsEnrolledAlready };
  return { props };
};

// eslint-disable-next-line max-lines-per-function
function ProgramOption({ scheduleRecord, checked }: { scheduleRecord: ScheduleRecordObj; checked: boolean }) {
  const startLocalDateTime = new Date(scheduleRecord.start);
  const startLocal = getShortLocalizedDate(startLocalDateTime);
  const boldBorder = checked ? 'border-2' : '';
  return (
    <div>
      <label className={`border border-secondary ${boldBorder} rounded-3 mb-2 d-flex align-items-center align-content-center`} role={checked ? '' : 'button'}>
        <input
          type="checkbox"
          name="scheduleId"
          value={scheduleRecord.id}
          className="ms-2 me-2"
          data-json={JSON.stringify(scheduleRecord)}
          defaultChecked={checked}
          disabled={checked}
        />
        <div className="d-inline-block">
          <div className={checked ? 'fw-bold' : ''}>
            {scheduleRecord.programName}
            <span className="text-muted ms-2">({scheduleRecord.duration})</span>
          </div>
          <div className="text-muted" data-utc={startLocalDateTime.toUTCString()} data-iso={startLocalDateTime.toISOString()}>
            <small>{startLocal}</small>
          </div>
          <div className="text-muted">
            <small>{scheduleRecord.description}</small>
          </div>
        </div>
      </label>
    </div>
  );
}

export default function ChooseProgramPage({ scheduleRecords, futureScheduleIdsEnrolledAlready }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const hasFutureEnrollments = futureScheduleIdsEnrolledAlready.length > 0;

  const title = hasFutureEnrollments ? 'My Enrollments' : 'Enroll in a Program';
  const instructions = hasFutureEnrollments
    ? 'Shown in bold are your current enrollments. You may enroll in additional programs, too.'
    : 'Choose one or more programs to enroll in.';
  const enrollBtnLabel = hasFutureEnrollments ? 'Save changes' : 'Enroll';

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{instructions}</p>
      <form method="POST" action="/api/enroll">
        <fieldset>
          {/* <legend>Programs</legend> */}
          {scheduleRecords.map((scheduleRecord: ScheduleRecordObj) => {
            const checked = futureScheduleIdsEnrolledAlready.includes(scheduleRecord.id);
            return <ProgramOption scheduleRecord={scheduleRecord} key={scheduleRecord.id} checked={checked} />;
          })}
        </fieldset>
        <button type="submit" className="btn btn-primary">
          {enrollBtnLabel}
        </button>
        <div className="hint">You will receive a confirmation email for each new enrollment.</div>
      </form>
    </Layout>
  );
}
