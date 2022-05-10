/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from '../components/layout';
import { getScheduleRecordsFromAllPages, ScheduleRecordObj } from '../helpers/airtable';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    // TODO: Add a toast notification explaining the redirect. Ideally, the desired destination should be remembered and should be redirected to after login.
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: '/',
        permanent: false,
      },
    };
  }
  const scheduleRecords = await getScheduleRecordsFromAllPages();
  // TODO: We should also check our database to see which programs the user has already registered for. Each option should be marked if it is already registered.
  const props = { scheduleRecords };
  return { props };
};

function ProgramOption({ scheduleRecord }: { scheduleRecord: ScheduleRecordObj }) {
  const startLocal = new Date(scheduleRecord.start);
  return (
    <div>
      <label className="border border-secondary rounded-3 mb-1 d-flex align-items-center align-content-center" role="button">
        <input type="radio" name="program" value={scheduleRecord.id} className="ms-2 me-2" data-json={JSON.stringify(scheduleRecord)} />
        <div className="d-inline-block">
          <div className="">{scheduleRecord.programName}</div>
          <div className="text-muted ">
            <small>{scheduleRecord.timeSummary}</small>
          </div>
          <div className="text-muted ">
            <small>{startLocal.toString()}</small>
          </div>
        </div>
      </label>
    </div>
  );
}

export default function ChooseProgramPage({ scheduleRecords }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <h1>Enroll</h1>
      <fieldset>
        <legend>Programs</legend>
        {scheduleRecords.map((scheduleRecord: ScheduleRecordObj) => (
          <ProgramOption scheduleRecord={scheduleRecord} key={scheduleRecord.id} />
        ))}
      </fieldset>
    </Layout>
  );
}