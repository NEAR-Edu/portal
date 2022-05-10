/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from '../components/layout';
import { getScheduleRecordsFromAllPages, ScheduleRecordObj } from '../helpers/airtable';
import { getShortLocalizedDate } from '../helpers/string';

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
  const enrolledAlready = ['rec4f0FZIG8z4RYXr']; // TODO: We should also check our database to see which future programs the user has already registered for. Each option should be marked if it is already registered.
  // TODO: Redirect to /profile if the person's DB record does not yet contain all of the required fields of the profile yet.
  const props = { scheduleRecords, enrolledAlready };
  return { props };
};

function ProgramOption({ scheduleRecord, checked }: { scheduleRecord: ScheduleRecordObj; checked: boolean }) {
  const startLocalDateTime = new Date(scheduleRecord.start);
  const startLocal = getShortLocalizedDate(startLocalDateTime);
  return (
    <div>
      <label className="border border-secondary rounded-3 mb-2 d-flex align-items-center align-content-center" role="button">
        <input
          type="checkbox"
          name="program"
          value={scheduleRecord.id}
          className="ms-2 me-2"
          data-json={JSON.stringify(scheduleRecord)}
          defaultChecked={checked}
          // onChange={() => {
          //   return null; // TODO
          // }}
        />
        <div className="d-inline-block">
          <div>
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

export default function ChooseProgramPage({ scheduleRecords, enrolledAlready }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const enrollBtnLabel = enrolledAlready.length > 0 ? 'Save changes' : 'Enroll';
  // TODO: Save to 'registrations' table.
  return (
    <Layout>
      <h1>Enroll</h1>
      <form>
        <fieldset>
          <legend>Programs</legend>
          {scheduleRecords.map((scheduleRecord: ScheduleRecordObj) => {
            const checked = enrolledAlready.includes(scheduleRecord.id);
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
