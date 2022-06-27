export default function HeaderLogo() {
  const height = 35;
  return (
    <div className="header-logo">
      <a href="https://near.university/" className="d-flex align-items-center">
        <img
          alt="NEAR University logo"
          src="https://assets-global.website-files.com/617fd6a2d7dd9a6b1c4c4dc6/618466f043553984d596b38d_nu_logo.svg"
          height={height}
          className="img-fluid"
        />
        <span>Student Portal</span>
      </a>
    </div>
  );
}
