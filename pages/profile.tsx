/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Countries from '../components/Countries';
import Layout from '../components/layout';
import LeadSource from '../components/LeadSource';
import RadioButtons from '../components/RadioButtons';
import TechnicalStrengths from '../components/TechnicalStrengths';
import TimeZones, { defaultTimeZone } from '../components/TimeZones';
import WhyJoin from '../components/WhyJoin';
import { chooseProgramPath, indexPath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { setFlashVariable, withSessionSsr } from '../helpers/session';
import { getLoggedInUser, getSerializableUser } from '../helpers/user';

const softwareDevelopmentExperienceOptions = ['I am not a software developer', 'less than 1 year', '1 - 2 years', '2 - 5 years', '5 - 10 years', 'more than 10 years'];

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
  const [userState, setUserState] = useState<User>(user);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    // https://stackoverflow.com/questions/72192566/how-fix-typescript-errors-in-react-function-that-handles-input-changes-of-multip
    console.log({ event });
    const thisField = event.target.name;
    const value = event.target.type === 'checkbox' ? (event as React.ChangeEvent<HTMLInputElement>).target.checked : event.target.value;
    console.log(thisField, value);
    setUserState({
      ...user,
      [thisField]: value,
    });
  }

  // TODO: Add the rest of the fields from https://airtable.com/shrr8CbYRDHflkgI9 to this form. (see https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh/viwqjBfqTd3W3nBXg?blocks=hide)
  // TODO: Add validation, including enforcing required fields.
  return (
    <Layout>
      <form method="POST" action="/api/update-profile" id="update-profile-form">
        <div>
          <label className="mt-5">First and Last Name</label>
          <input type="text" name="name" defaultValue={userState?.name ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label className="mt-5">In which country do you live?</label>
          <Countries defaultValue={userState?.country ?? ''} />
        </div>
        <div>
          <label className="mt-5">What is your time zone?</label>
          {/* // TODO autodetect the visitor's time zone. */}
          <TimeZones defaultValue={userState?.timeZone ?? defaultTimeZone} />
        </div>
        <div>
          <label className="mt-5">Software Development Experience</label>
          <div className="hint">Please share your experience writing software even if you are still a student.</div>
          <fieldset>
            <RadioButtons
              name="softwareDevelopmentExperience"
              options={softwareDevelopmentExperienceOptions}
              currentValue={userState?.softwareDevelopmentExperience}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            />
          </fieldset>
        </div>
        <div>
          <label className="mt-5">Technical Strengths</label>
          <div className="hint">Please share a list of the software languages and frameworks you are most comfortable with.</div>
          <TechnicalStrengths defaultValue={userState?.technicalStrengths ?? ''} />
        </div>
        <div>
          <label className="mt-5">Why are you joining us for this course?</label>
          <div className="hint">Please choose as many of the following options as you like.</div>
          <WhyJoin defaultValue={userState?.whyJoin ?? ''} />
        </div>
        <div>
          <label className="mt-5">How did you hear about this course?</label>
          <LeadSource defaultValue={userState?.leadSource ?? ''} />
        </div>
        <div>
          <label className="mt-5">NEAR TestNet Account</label>
          <div className="hint">
            Please provide your NEAR TestNet account to help us understand your experience with NEAR. (REQUIRED) (Don&rsquo;t have one? Create at{' '}
            <a href="https://wallet.testnet.near.org" target="_blank" rel="noreferrer">
              wallet.testnet.near.org
            </a>
            )
          </div>
          <input type="text" name="testnetAccount" defaultValue={userState?.testnetAccount ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label className="mt-5">NEAR MainNet Account</label>
          <div className="hint">
            Please provide your NEAR MainNet account to allow us to distribute rewards for your participation and performance as well as proof of certification. (Optional)
            (Don&rsquo;t have one? Create at{' '}
            <a href="https://wallet.near.org" target="_blank" rel="noreferrer">
              wallet.near.org
            </a>
            )
          </div>
          <input type="text" name="mainnetAccount" defaultValue={userState?.mainnetAccount ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <div>
          <label className="mt-5">Discord Account</label>
          <div className="hint">
            Please include you full username (e.g. ben#4452) (Optional) (Don&rsquo;t have one? create at{' '}
            <a href="https://discord.gg/k4pxafjMWA" target="_blank" rel="noreferrer">
              discord.gg/k4pxafjMWA
            </a>
            )
          </div>
          <input type="text" name="discordAccount" defaultValue={userState?.discordAccount ?? undefined} className="form-control form-control-lg" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary mt-5">
          Continue ➔
        </button>
        <div className="hint">(On the next page, you&rsquo;ll choose the program(s) to enroll in.)</div>
      </form>
    </Layout>
  );
}
