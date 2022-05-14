import { getSession } from 'next-auth/react';
import Layout from '../components/layout';
import { profilePath } from '../helpers/paths';
import { pluckFlash, withSessionSsr } from '../helpers/session';

export const getServerSideProps = withSessionSsr(async ({ req }) => {
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
  return {
    props: { flash }, // will be passed to the page component as props
  };
});

export default function IndexPage({ flash }: { flash: string }) {
  return (
    <Layout flash={flash}>
      <h1>NEAR University Certified Programs</h1>

      <p>Enroll in a program for free in just 3 steps:</p>
      <ol>
        <li>Confirm your email address.</li>
        <li>Tell us more about yourself.</li>
        <li>Choose a program.</li>
      </ol>
      <a href="/auth/signin" className="btn btn-lg btn-success">
        Get Started ➔
      </a>
    </Layout>
  );
}
