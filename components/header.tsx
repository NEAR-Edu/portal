import { signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';
import HeaderLogo from './HeaderLogo';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

// eslint-disable-next-line max-lines-per-function
export default function Header() {
  const { data: session } = useSession();

  if (session) {
    return (
      <header className="container-lg">
        <div className="row">
          <div className="col-9">
            <HeaderLogo />
          </div>
          <div className={`col-3 text-end ${styles.signedInStatus}`}>
            {session?.user && (
              <>
                {session.user.image && <span style={{ backgroundImage: `url('${session.user.image}')` }} className={styles.avatar} />}
                <div className={styles.signedInText}>
                  <strong>{session.user.email ?? session.user.name}</strong>
                </div>
                <a
                  href="/api/auth/signout"
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    );
  } else {
    return <HeaderLogo />;
  }
}
