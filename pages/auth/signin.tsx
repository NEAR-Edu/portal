/* eslint-disable jsx-a11y/label-has-associated-control */
import { GetServerSideProps } from 'next';
import { getSession, getCsrfToken } from 'next-auth/react';
import Layout from '../../components/layout';
import { profilePath } from '../../helpers/paths';

// TODO: Improve the design of the destination of the signin page and the body of the email.

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
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
};

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  return (
    <Layout>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div>First, we need you to verify your email address.</div>

        <label className="fw-bold me-1">Email address:</label>
        <input type="email" id="email" name="email" placeholder="susan@example.com" className="form-control form-control-lg" />
        <button type="submit" className="btn btn-success">
          Send verification link
        </button>
      </form>
    </Layout>
  );
}
