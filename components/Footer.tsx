import HeaderLogo from './HeaderLogo';

export default function Footer() {
  return (
    <footer className="container-lg pt-5 pb-2">
      <div className="row">
        <div className="col-md-9">
          <HeaderLogo />
        </div>
        <div className="col-md-3" />
      </div>
    </footer>
  );
}
