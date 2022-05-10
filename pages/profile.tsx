/* eslint-disable jsx-a11y/label-has-associated-control */
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';

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
  // TODO: Upon form submission, save fields to the 'users' table.
  return (
    <Layout>
      <form>
        <div>
          <label>First and Last Name</label>
          <input type="text" name="fullName" className="form-control form-control-lg" />
        </div>
        <div>
          <label>In which country do you live?</label>
          <input type="text" name="country" className="form-control form-control-lg" />
        </div>
        <div>
          <label>Software Development Experience</label>
          <div className="hint">Please share your experience writing software even if you are still a student.</div>
          <fieldset>
            <div>
              <label>
                <input type="radio" name="dev_experience" value="" /> X
              </label>
            </div>
            <div>
              <label>
                <input type="radio" name="dev_experience" value="" /> Y
              </label>
            </div>
            <div>
              <label>
                <input type="radio" name="dev_experience" value="" /> Z
              </label>
            </div>
          </fieldset>
        </div>
        <div>
          <label>Technical Strengths</label>
          <div className="hint">Please share a list of the software languages and frameworks you are most comfortable with.</div>
          <textarea name="dev_experience" className="form-control form-control-lg" />
        </div>

        <button type="submit" className="btn btn-primary">
          Continue ➔
        </button>
        <div className="hint">The next page is where you&rsquo;ll choose the program(s) to enroll in.</div>
      </form>
    </Layout>
  );
}
