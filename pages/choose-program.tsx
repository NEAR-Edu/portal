import { getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import ProgramOption from '../components/ProgramOption';
import { ScheduleRecordObj } from '../helpers/airtable';
import { indexPath, profilePath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { getUpcomingSchedule } from '../helpers/registrations';
import { pluckFlash, setFlashVariable, withSessionSsr } from '../helpers/session';

import { Flash } from '../helpers/types';

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
  const userEmail = session.user?.email as string; // Weirdly, next-auth exposes 'email' instead of 'id'.
  const { scheduleRecords, futureScheduleIdsEnrolledAlready } = await getUpcomingSchedule(userEmail);
  const props = { scheduleRecords, futureScheduleIdsEnrolledAlready, flash };
  return { props };
});

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
