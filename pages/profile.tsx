/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';
import Layout from '../components/layout';
import RadioButtons from '../components/RadioButtons';

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
  // TODO: If the person's DB record already contains all of the required fields of the profile, redirect to /choose-program. (Maybe someday we'll support editing a profile, but not yet.)
  const props = {};
  return { props };
};

// eslint-disable-next-line max-lines-per-function
export default function ProfilePage() {
  const [user, setUser] = useState<User>();

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    console.log({ event });
    const thisField = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    console.log(thisField, value);
    setUser({
      ...user,
      [thisField]: value,
    });
  }

  return (
    <Layout>
      <form method="POST" action="/api/update-profile">
        <div>
          <label>First and Last Name</label>
          <input type="text" name="name" value={user?.name ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label>In which country do you live?</label>
          <input type="text" name="country" value={user?.country ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label>Software Development Experience</label>
          <div className="hint">Please share your experience writing software even if you are still a student.</div>
          <fieldset>
            <RadioButtons
              name="softwareDevelopmentExperience"
              options={{ X: 'X', Y: 'Y', Z: 'Z' }}
              currentValue={user?.softwareDevelopmentExperience}
              onChange={(event: any) => handleChange(event)}
            />
          </fieldset>
        </div>
        <div>
          <label>Technical Strengths</label>
          <div className="hint">Please share a list of the software languages and frameworks you are most comfortable with.</div>
          <textarea name="technicalStrengths" className="form-control form-control-lg" onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">
          Continue ➔
        </button>
        <div className="hint">The next page is where you&rsquo;ll choose the program(s) to enroll in.</div>
      </form>
    </Layout>
  );
}
