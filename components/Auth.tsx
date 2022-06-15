export default function Auth({ csrfToken }: { csrfToken: string }) {
  const inputId = 'email';
  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

      <label className="fw-bold me-1" htmlFor={inputId}>
        Email address:
      </label>
      <input type="email" id={inputId} name="email" placeholder="near.student@example.com" className="form-control form-control-lg" />
      <button type="submit" className="btn rounded-3" style={{ color: 'white', backgroundColor: 'black', borderRadius: '1rem' }}>
        Send verification link
      </button>
      <p className="hint mt-3">(You don&rsquo;t even need to create a password.)</p>
    </form>
  );
}
