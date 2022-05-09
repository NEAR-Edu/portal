/* eslint-disable jsx-a11y/label-has-associated-control */
import { GetServerSideProps } from 'next';
import { getCsrfToken } from 'next-auth/react';
import Layout from '../../components/layout';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
};

export default function SignIn({ csrfToken }: any) {
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
