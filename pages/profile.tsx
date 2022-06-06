/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';
import { Radio, RadioGroup, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { getSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import Countries from '../components/Countries';
import FrameworksAndPlatforms from '../components/FrameworksAndPlatforms';
import Layout from '../components/layout';
import LeadSource, { referralOptions, referralProgram } from '../components/LeadSource';
import ProgrammingLanguages from '../components/ProgrammingLanguages';
import TimeZones from '../components/TimeZones';
import WhyJoin from '../components/WhyJoin';
import { chooseProgramPath, indexPath } from '../helpers/paths';
import { isProfileComplete } from '../helpers/profile';
import { pluckFlash, setFlashVariable, withSessionSsr } from '../helpers/session';
import { browserTimeZoneGuess } from '../helpers/time';
import { getLoggedInUser, getSerializableUser } from '../helpers/user';

const schema = z.object({
  // https://mantine.dev/form/schema/
  name: z.string().min(2, { message: 'Your name must have at least 2 letters.' }),
  testnetAccount: z.string().regex(/.testnet$/, { message: 'Your testnet account must end with `.testnet`.' }),
  mainnetAccount: z.string().regex(/.near$/, { message: 'Your mainnet account must end with `.near`.' }),
});

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
  const flash = await pluckFlash(req);
  const serializableUser = getSerializableUser(user);
  console.log({ serializableUser });
  const props = { user: serializableUser, flash };
  return { props };
});

// eslint-disable-next-line max-lines-per-function
export default function ProfilePage({ user, flash }: { user: User; flash: string }) {
  const [userState, setUserState] = useState<User>(user);

  const updateValue = useCallback(
    (key, value) => {
      console.log(key, value);
      setUserState({
        ...user,
        [key]: value,
      });
    },
    [user],
  );

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    // https://stackoverflow.com/questions/72192566/how-fix-typescript-errors-in-react-function-that-handles-input-changes-of-multip
    console.log({ event });
    const thisField = event.target.name;
    const value = event.target.type === 'checkbox' ? (event as React.ChangeEvent<HTMLInputElement>).target.checked : event.target.value;
    updateValue(thisField, value);
  }

  console.log({ userState });

  // Replaces https://airtable.com/shrr8CbYRDHflkgI9 (see https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh/viwqjBfqTd3W3nBXg?blocks=hide)
  // TODO: Add validation, including enforcing required fields. https://mantine.dev/form/use-form/#validation https://jasonwatmore.com/post/2021/09/03/next-js-form-validation-example-with-react-hook-form
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: userState.name ?? '',
      testnetAccount: userState.testnetAccount ?? '',
      mainnetAccount: userState.mainnetAccount ?? '',
      softwareDevelopmentExperience: userState.softwareDevelopmentExperience ?? '',
    },
  });

  return (
    <Layout flash={flash}>
      <form method="POST" action="/api/update-profile" id="update-profile-form" onSubmit={form.onSubmit((values) => console.log({ values }))}>
        <TextInput type="text" required label="First and Last Name" {...form.getInputProps('name')} />

        <Countries defaultValue={userState.country ?? ''} />

        <TimeZones defaultValue={userState.timeZone ?? browserTimeZoneGuess()} />

        <RadioGroup
          label="Software Development Experience"
          description="Please share your experience writing software even if you are still a student."
          required
          {...form.getInputProps('softwareDevelopmentExperience')}
          orientation="vertical"
        >
          {softwareDevelopmentExperienceOptions.map((label: string) => {
            return <Radio value={label} label={label} key={label} />;
          })}
        </RadioGroup>

        <div>
          <label className="question mt-5">Programming Languages</label>
          <div className="hint">Please share a list of the programming languages you are most comfortable with.</div>
          <ProgrammingLanguages defaultValue={userState.programmingLanguages ?? ''} />
        </div>
        <div>
          <label className="question mt-5">Frameworks and Platforms</label>
          <div className="hint">Please share a list of the frameworks and platforms you are most comfortable with.</div>
          <FrameworksAndPlatforms defaultValue={userState.frameworksAndPlatforms ?? ''} />
        </div>
        <div>
          <label className="question mt-5">Why are you joining us for this course?</label>
          <div className="hint">Please choose as many of the following options as you like.</div>
          <WhyJoin defaultValue={userState.whyJoin ?? ''} />
        </div>

        <LeadSource defaultValue={userState.leadSource ?? ''} />
        <div className="hint">(Choose an answer or write your own.)</div>

        {referralOptions.includes(userState.leadSource || '') && (
          <div>
            <label className="question mt-5">Who referred you?</label>
            <input type="text" name="referrer" defaultValue={userState.referrer ?? ''} className="form-control" onChange={handleChange} />
          </div>
        )}
        {userState.leadSource === referralProgram && (
          <div>
            <label className="question mt-5">Referral Account</label>
            <div className="hint">
              Please provide the NEAR MainNet account of the person or organization who referred you (and the account name must end in &ldquo;.near&rdquo;).
            </div>
            <input type="text" name="referrerMainnetAccount" defaultValue={userState.referrerMainnetAccount ?? ''} className="form-control" onChange={handleChange} />
          </div>
        )}

        <TextInput label="NEAR TestNet Account" placeholder="example.testnet" required {...form.getInputProps('testnetAccount')} />
        <div className="hint">
          Please provide your NEAR TestNet account to help us understand your experience with NEAR. (Don&rsquo;t have one? Create at{' '}
          <a href="https://wallet.testnet.near.org" target="_blank" rel="noreferrer">
            wallet.testnet.near.org
          </a>
          .)
        </div>

        <TextInput label="NEAR MainNet Account" placeholder="example.near" {...form.getInputProps('mainnetAccount')} />
        <div className="hint">
          Please provide your NEAR MainNet account to allow us to distribute rewards for your participation and performance as well as proof of certification. (Optional)
          (Don&rsquo;t have one? Create at{' '}
          <a href="https://wallet.near.org" target="_blank" rel="noreferrer">
            wallet.near.org
          </a>
          .)
        </div>
        <div>
          <label className="question mt-5">Discord Account</label>
          <div className="hint">
            Please include you full username (e.g. ben#4452) (Optional) (Don&rsquo;t have one? Register at{' '}
            <a href="https://discord.gg/k4pxafjMWA" target="_blank" rel="noreferrer">
              discord.gg/k4pxafjMWA
            </a>
            )
          </div>
          <input type="text" name="discordAccount" placeholder="ben#4452" defaultValue={userState.discordAccount ?? ''} className="form-control" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary mt-5">
          Continue ➔
        </button>
        <div className="hint">(On the next page, you&rsquo;ll choose the program(s) to enroll in.)</div>
      </form>
    </Layout>
  );
}
