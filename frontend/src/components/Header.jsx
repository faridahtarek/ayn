// Ayn: the header, with who is logged in (Lab 9)
import Logo from "./Logo.jsx";

function Header({ user, onLogOut }) {
  return (
    <header className="header">
      <Logo />
      <div className="who glass">
        <span className="who-name">{user.name}</span>
        <span className="who-org">{user.organisation}</span>
      </div>
      <button className="icon-button glass" onClick={onLogOut} aria-label="Log out">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
          <path d="M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
