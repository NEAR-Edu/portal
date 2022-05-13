import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../components/layout';
import { getFlashSession } from '../helpers/getFlashSession';
import { profilePath } from '../helpers/paths';
import { pluckFlash } from '../helpers/pluckFlash';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

  const flashSession = await getFlashSession(req, res);
  const flash = pluckFlash(flashSession); // TODO: Should wrap getFlashSession into pluckFlash.
  console.log('index props', { flashSession, flash });
  return {
    props: { flash }, // will be passed to the page component as props
  };
};

export default function IndexPage({ flash }: { flash: string }) {
  if (flash) toast.error(flash, { toastId: 'access-denied' });
  return (
    <Layout>
      <ToastContainer />
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
