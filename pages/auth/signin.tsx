/* eslint-disable jsx-a11y/label-has-associated-control */
import { getCsrfToken } from 'next-auth/react';

export default function SignIn({ csrfToken }: any) {
  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div>First, we need you to verify your email address.</div>

      <label>
        Email address
        <input type="email" id="email" name="email" placeholder="susan@example.com" />
      </label>
      <button type="submit">Send verification link</button>
    </form>
  );
}

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
