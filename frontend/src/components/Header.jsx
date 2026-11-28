// Ayn: the header: one slim glass bar with the logo, the navigation,
// who is logged in and log out (Labs 7 and 9)
import { NavLink } from "react-router";
import Logo from "./Logo.jsx";

// reviewCount (use case 5): how many proofs wait for the company, shown as a small number
function Header({ user, onLogOut, reviewCount }) {
  const isOfficer = user.role === "officer";

  return (
    <header className="header glass">
      <Logo />

      {/* Not in the lab: NavLink is Link plus the "active" class on the page you are on.
          end: only active on exactly that address (without it, "/" would be active everywhere).
          aria-label names the menu for screen readers */}
      <nav className="nav" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        {isOfficer && <NavLink to="/farms" end>My farms</NavLink>}
        {isOfficer && <NavLink to="/farms/new">Register a farm</NavLink>}
        {/* Use case 3: a company's pages */}
        {!isOfficer && <NavLink to="/browse">Fund a farm</NavLink>}
        {!isOfficer && <NavLink to="/funded">My farms funded</NavLink>}
        {/* Use case 5: the number appears only when proof is waiting */}
        {!isOfficer && (
          <NavLink to="/review">
            Review proof
            {reviewCount > 0 && <span className="nav-count">{reviewCount}</span>}
          </NavLink>
        )}
      </nav>

      {/* Use case 5: opens Quick jump (QuickJump.jsx listens for this signal) */}
      {!isOfficer && (
        <button className="jump-button" type="button" onClick={() => window.dispatchEvent(new Event("ayn:quickjump"))}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span>Jump to</span>
          <kbd>Ctrl K</kbd>
        </button>
      )}

      <div className="who">
        <span className="who-name">{user.name}</span>
        <span className="who-org">{user.organisation}</span>
      </div>
      {/* The log-out icon is drawn with <svg>: each path d is a line to draw,
          stroke="currentColor" uses the text's colour. aria-label: the button's name */}
      <button className="icon-button" onClick={onLogOut} aria-label="Log out">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
          <path d="M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
