import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../components/layout';
import { profilePath } from '../helpers/paths';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: profilePath,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function IndexPage() {
  return (
    <Layout>
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
