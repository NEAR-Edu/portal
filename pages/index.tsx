import { getCsrfToken, getSession } from 'next-auth/react';
import Head from 'next/head';
import Auth from '../components/Auth';
import Layout from '../components/layout';
import ProgramOption from '../components/ProgramOption';
import { ScheduleRecordObj } from '../helpers/airtable';
import { profilePath } from '../helpers/paths';
import { getUpcomingSchedule } from '../helpers/registrations';
import { pluckFlash, withSessionSsr } from '../helpers/session';
import { Flash } from '../helpers/types';

export const getServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: profilePath,
        permanent: false,
      },
    };
  }

  const flash = await pluckFlash(req);
  console.log('index props', { flash });
  const csrfToken = await getCsrfToken(context);
  const { scheduleRecords, futureScheduleIdsEnrolledAlready } = await getUpcomingSchedule();
  console.log({ scheduleRecords, futureScheduleIdsEnrolledAlready });
  return {
    props: { flash, csrfToken, scheduleRecords, futureScheduleIdsEnrolledAlready }, // will be passed to the page component as props
  };
});

// eslint-disable-next-line max-lines-per-function
export default function IndexPage({
  flash,
  csrfToken,
  scheduleRecords,
  futureScheduleIdsEnrolledAlready,
}: {
  flash: Flash;
  csrfToken: string;
  scheduleRecords: ScheduleRecordObj[];
  futureScheduleIdsEnrolledAlready: string[];
}) {
  console.log({ scheduleRecords, futureScheduleIdsEnrolledAlready });
  return (
    <Layout flash={flash}>
      <Head>
        <title>NEAR University Student Portal</title>
      </Head>
      <div className="blur">
        <div className="row loggedOutHero p-5 position-relative">
          <div className="col-6">
            <h1 className="mb-5">The best place to learn NEAR</h1>

            <p>Use the NEAR University Student Portal to enroll in courses, collect certificates, and track your progress!</p>

            <Auth csrfToken={csrfToken} />
          </div>
          <div className="col-6 text-center" style={{ padding: '2rem' }}>
            <img src="/img/triangularSphere.svg" alt="triangular sphere" />
          </div>
        </div>
        <div className="row steps">
          <div className="col-3">
            <div className="step">
              <span className="stepNumber">01</span>
              <img src="/img/line-arrow-right.svg" alt="right arrow" />
            </div>
            <h4>Verify your email address</h4>
            <p className="hint">Easy. No password needed.</p>
          </div>
          <div className="col-3">
            <div className="step">
              <span className="stepNumber">02</span>
              <img src="/img/line-arrow-right.svg" alt="right arrow" />
            </div>
            <h4>Tell us about yourself</h4>
            <p className="hint">Provide your name, interests, etc.</p>
          </div>
          <div className="col-3">
            <div className="step">
              <span className="stepNumber">03</span>
              <img src="/img/line-arrow-right.svg" alt="right arrow" />
            </div>
            <h4>Enroll in programs</h4>
            <p className="hint">Choose what you want to learn.</p>
          </div>
          <div className="col-3">
            <div className="step">
              <span className="stepNumber">04</span>
              <img src="/img/line-arrow-right.svg" alt="right arrow" />
            </div>
            <h4>Start learning!</h4>
            <p className="hint">Grow your skills.</p>
          </div>
        </div>
        <h2 className="text-center mt-5 mb-5">Upcoming sessions</h2>
        <div>
          {scheduleRecords.map((scheduleRecord: ScheduleRecordObj) => {
            return <ProgramOption scheduleRecord={scheduleRecord} key={scheduleRecord.id} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
