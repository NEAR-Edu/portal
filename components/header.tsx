import { signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';
import HeaderLogo from './HeaderLogo';

function RightSide() {
  const { data: session } = useSession();
  if (session?.user) {
    return (
      <>
        {session.user.image && <span style={{ backgroundImage: `url('${session.user.image}')` }} className={styles.avatar} />}
        <span className={styles.signedInText}>
          <strong>{session.user.email ?? session.user.name}</strong>
        </span>
        <a
          href="/api/auth/signout"
          className={styles.signOutButton}
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </a>
      </>
    );
  } else {
    return (
      <label htmlFor="email" className="btn btn-link btnLogin">
        Log in
      </label>
    );
  }
}

export default function Header() {
  return (
    <header className="container-lg pt-3">
      <div className="row">
        <div className="col-6">
          <HeaderLogo />
        </div>
        <div className={`col-6 text-end ${styles.signedInStatus}`}>
          <RightSide />
        </div>
      </div>
    </header>
  );
}
