export default function Auth({ csrfToken }: { csrfToken: string }) {
  const inputId = 'email';
  return (
    <form method="post" action="/api/auth/signin/email" className="mt-5">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

      <input
        type="email"
        id={inputId}
        name="email"
        placeholder="Enter your email"
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
      <button type="submit" className="btn rounded-3" style={{ color: 'white', backgroundColor: 'black', borderRadius: '2rem!important', padding: '0.7rem 1.2rem' }}>
        Send me a link
      </button>
    </form>
  );
}
