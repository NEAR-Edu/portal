/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Registration } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import Layout from '../components/layout';
import { getFutureScheduleRecords, ScheduleRecordObj } from '../helpers/airtable';
import { indexPath, profilePath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { pluckFlash, setFlashVariable, withSessionSsr } from '../helpers/session';
import { getShortLocalizedDate } from '../helpers/string';
import { timeFromNowIfSoon } from '../helpers/time';
import { Flash } from '../helpers/types';

const cutoffValueForHighlightingRelativeTime = 24;
const cutoffUnitForHighlightingRelativeTime = 'hour'; // https://day.js.org/docs/en/display/difference

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

// eslint-disable-next-line max-lines-per-function
export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const flash = await pluckFlash(req);
  const session = await getSession({ req });
  if (!session) {
    // https://github.com/nextauthjs/next-auth/issues/4552
    await setFlashVariable(req, 'You must be logged in to access this page.', 'warning');
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: indexPath,
        permanent: false,
      },
    };
  }
  const hasCompletedProfile = await isProfileComplete(session);
  if (!hasCompletedProfile) {
    await setFlashVariable(req, 'Please complete your profile first.', 'warning');
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: profilePath,
        permanent: false,
      },
    };
  }
  const scheduleRecords = await getFutureScheduleRecords(); // These come from Airtable.
  const userEmail = session.user?.email; // Weirdly, next-auth exposes 'email' instead of 'id'.
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
  const futureScheduleIdsEnrolledAlready = getFutureScheduleIdsEnrolledAlready(scheduleRecords, allRegistrationsForThisUser);
  const props = { scheduleRecords, futureScheduleIdsEnrolledAlready, flash };
  return { props };
});

function RelativeTime({ startDateTime }: { startDateTime: string }): JSX.Element {
  const relativeTime = timeFromNowIfSoon(startDateTime, cutoffValueForHighlightingRelativeTime, cutoffUnitForHighlightingRelativeTime);
  const result = relativeTime ? (
    <>
      {' '}
      <span style={{ background: 'yellow' }}>({relativeTime})</span>
    </>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
  return result;
}

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
            <small>
              {startLocal}
              <RelativeTime startDateTime={scheduleRecord.start} />
            </small>
          </div>
          <div className="text-muted">
            <small>{scheduleRecord.description}</small>
          </div>
        </div>
      </label>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function ChooseProgramPage({
  scheduleRecords,
  futureScheduleIdsEnrolledAlready,
  flash,
}: {
  scheduleRecords: ScheduleRecordObj[];
  futureScheduleIdsEnrolledAlready: string[];
  flash: Flash;
}) {
  const hasFutureEnrollments = futureScheduleIdsEnrolledAlready.length > 0;

  const title = hasFutureEnrollments ? 'My Enrollments' : 'Enroll in a Program';
  const instructions = hasFutureEnrollments
    ? 'Shown in bold are your current enrollments. You may enroll in additional programs, too.'
    : 'Choose one or more programs to enroll in.';
  const enrollBtnLabel = hasFutureEnrollments ? 'Save changes' : 'Enroll';

  return (
    <Layout flash={flash}>
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
