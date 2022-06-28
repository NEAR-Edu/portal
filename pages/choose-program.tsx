import { getCsrfToken, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import ProgramOption from '../components/ProgramOption';
import { ScheduleRecordObj } from '../helpers/airtable';
import { indexPath, profilePath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { getUpcomingSchedule } from '../helpers/registrations';
import { pluckFlash, setFlashVariable, withSessionSsr } from '../helpers/session';

import { Flash } from '../helpers/types';

export const getServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;
  const csrfToken = await getCsrfToken(context);
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
  const props = { scheduleRecords, futureScheduleIdsEnrolledAlready, flash, csrfToken };
  return { props };
});

export default function ChooseProgramPage({
  scheduleRecords,
  futureScheduleIdsEnrolledAlready,
  flash,
  csrfToken,
}: {
  scheduleRecords: ScheduleRecordObj[];
  futureScheduleIdsEnrolledAlready: string[];
  flash: Flash;
  csrfToken: string;
}) {
  return (
    <Layout flash={flash}>
      <h1>Enroll in a Program</h1>

      <div className="hint mb-5">You will receive a confirmation email for each new enrollment.</div>
      <fieldset>
        {/* <legend>Programs</legend> */}
        {scheduleRecords.map((scheduleRecord: ScheduleRecordObj) => {
          const isAlreadyEnrolled = futureScheduleIdsEnrolledAlready.includes(scheduleRecord.id);
          return <ProgramOption scheduleRecord={scheduleRecord} key={scheduleRecord.id} isAlreadyEnrolled={isAlreadyEnrolled} csrfToken={csrfToken} />;
        })}
      </fieldset>
    </Layout>
  );
}
