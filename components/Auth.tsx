import { Dispatch, SetStateAction, useState } from 'react';

function Sent({
  emailAddress,
  setEmailAddress,
  setHasSubmitted,
}: {
  emailAddress: string;
  setEmailAddress: Dispatch<SetStateAction<string>>;
  setHasSubmitted: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  return (
    <form
      onSubmit={() => {
        setEmailAddress('');
        setHasSubmitted(false);
      }}
      className="container mt-5"
    >
      <div className="row">
        <div className="col-8 success-left-border">
          A login link has been sent to <strong>{emailAddress}</strong>. <strong>Check your inbox. 😃</strong>
        </div>
        <div className="col-4">
          <button type="submit" className="btn authBtn">
            ◀ Go back
          </button>
        </div>
      </div>
    </form>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function Auth({ csrfToken }: { csrfToken: string }) {
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  async function submitEmailAddress(event: React.FormEvent) {
    event.preventDefault();

    await fetch('/api/auth/signin/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailAddress, csrfToken }),
    });
    setHasSubmitted(true);
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
    // https://stackoverflow.com/questions/72192566/how-fix-typescript-errors-in-react-function-that-handles-input-changes-of-multip
    const { value } = event.target;
    setEmailAddress(value);
  }

  if (hasSubmitted) {
    return <Sent emailAddress={emailAddress} setEmailAddress={setEmailAddress} setHasSubmitted={setHasSubmitted} />;
  } else {
    return (
      <form className="authForm mt-5" onSubmit={submitEmailAddress}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          onChange={handleChange}
          className="form-control"
          style={{
            color: 'black',
            fontSize: '0.9rem',
            border: 0,
            borderBottom: '1px solid black',
            borderRadius: 0,
            display: 'inline',
            background: 'transparent',
            width: 'auto',
            minWidth: '20rem',
            marginRight: '2rem',
          }}
        />
        <button type="submit" className="btn authBtn">
          Sign up / Log in
        </button>
        <div className="hint">No password needed</div>
      </form>
    );
  }
}
