export default function HeaderLogo() {
  const size = 25;
  return (
    <div className="header-logo">
      <a href="https://near.university/" className="d-flex align-items-center">
        <img alt="NEAR logo" src="/img/logos/icon_nm.svg" width={size} height={size} />
        <span>
          <strong>NEAR University |</strong> Student Portal
        </span>
      </a>
    </div>
  );
}
