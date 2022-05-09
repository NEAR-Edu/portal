import { InferGetServerSidePropsType } from 'next';
import Layout from '../components/layout';
import { getScheduleRecordsFromAllPages } from '../helpers/airtable';

export const getServerSideProps = async () => {
  const scheduleRecords = await getScheduleRecordsFromAllPages();
  const props = { scheduleRecords };
  return { props };
};

export default function IndexPage({ scheduleRecords }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log({ scheduleRecords });
  return (
    <Layout>
      <h1>NEAR University Certified Programs</h1>
      <p>{`Found ${scheduleRecords.length} records: ${JSON.stringify(scheduleRecords, null, 2)}`}</p>
      <p>Enroll in a program for free in just 3 steps:</p>
      <ol>
        <li>Confirm your email address.</li>
        <li>Choose a program.</li>
        <li>Tell us more about yourself.</li>
      </ol>
    </Layout>
  );
}
