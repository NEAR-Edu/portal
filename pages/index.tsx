import { getCsrfToken, getSession } from 'next-auth/react';
import Auth from '../components/Auth';
import Layout from '../components/layout';
import { profilePath } from '../helpers/paths';
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
  return {
    props: { flash, csrfToken }, // will be passed to the page component as props
  };
});

export default function IndexPage({ flash, csrfToken }: { flash: Flash; csrfToken: string }) {
  return (
    <Layout flash={flash}>
      <div className="row">
        <div className="col-6">
          <h1>The best place to learn NEAR</h1>

          <p>Use the NEAR University Student Portal to enroll in courses, collect certificates, and track your progress!</p>
        </div>
        <div className="col-6" style={{ backgroundColor: 'hsl(0deg 0% 95%)', padding: '2rem' }}>
          <h3>Create your account to start learning (Free!)</h3>
          <Auth csrfToken={csrfToken} />
        </div>
      </div>
      <h2 className="text-center mt-5">Upcoming Schedule</h2>
    </Layout>
  );
}
