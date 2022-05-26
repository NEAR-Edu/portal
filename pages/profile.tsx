/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';
import { getSession } from 'next-auth/react';
import Countries from '../components/Countries';
import Layout from '../components/layout';
import RadioButtons from '../components/RadioButtons';
import TechnicalStrengths from '../components/TechnicalStrengths';
import TimeZones, { defaultTimeZone } from '../components/TimeZones';
import { chooseProgramPath, indexPath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { setFlashVariable, withSessionSsr } from '../helpers/session';
import { getLoggedInUser, getSerializableUser } from '../helpers/user';

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    await setFlashVariable(req, 'You must be logged in to access this page.');
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: indexPath,
        permanent: false,
      },
    };
  }

  if (await isProfileComplete(session)) {
    // (Maybe someday we'll support editing a profile, but not yet.)
    await setFlashVariable(req, 'You were redirected to this page since your profile is already complete.');
    return {
      redirect: {
        // https://stackoverflow.com/a/58182678/470749
        destination: chooseProgramPath,
        permanent: false,
      },
    };
  }
  const user = await getLoggedInUser(session);
  const serializableUser = getSerializableUser(user);
  console.log({ serializableUser });
  const props = { user: serializableUser };
  return { props };
});

// eslint-disable-next-line max-lines-per-function
export default function ProfilePage({ user }: { user: User }) {
  // const [user, setUser] = useState<User>({} as User);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    // https://stackoverflow.com/questions/72192566/how-fix-typescript-errors-in-react-function-that-handles-input-changes-of-multip
    console.log({ event });
    const thisField = event.target.name;
    const value = event.target.type === 'checkbox' ? (event as React.ChangeEvent<HTMLInputElement>).target.checked : event.target.value;
    console.log(thisField, value);
    // setUser({
    //   ...user,
    //   [thisField]: value,
    // });
  }

  // TODO: Add the rest of the fields from https://airtable.com/shrr8CbYRDHflkgI9 to this form.
  // TODO: Add validation, including enforcing required fields.
  return (
    <Layout>
      <form method="POST" action="/api/update-profile" id="update-profile-form">
        <div>
          <label>First and Last Name</label>
          <input type="text" name="name" value={user?.name ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label>In which country do you live?</label>
          <Countries defaultValue={user?.country ?? ''} />
        </div>
        <div>
          <label>What is your time zone?</label>
          {/* // TODO autodetect the visitor's time zone. */}
          <TimeZones defaultValue={user?.timeZone ?? defaultTimeZone} />
        </div>
        <div>
          <label>Software Development Experience</label>
          <div className="hint">Please share your experience writing software even if you are still a student.</div>
          <fieldset>
            <RadioButtons
              name="softwareDevelopmentExperience"
              options={{ X: 'X', Y: 'Y', Z: 'Z' }}
              currentValue={user?.softwareDevelopmentExperience}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            />
          </fieldset>
        </div>
        <div>
          <label>Technical Strengths</label>
          <div className="hint">Please share a list of the software languages and frameworks you are most comfortable with.</div>
          <TechnicalStrengths defaultValue={user?.technicalStrengths ?? ''} />
        </div>

        <button type="submit" className="btn btn-primary">
          Continue ➔
        </button>
        <div className="hint">(On the next page, you&rsquo;ll choose the program(s) to enroll in.)</div>
      </form>
    </Layout>
  );
}
