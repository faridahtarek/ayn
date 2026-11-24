// Ayn: the logo pill. Milestones check id="project-name"
// Clicking it takes you home
import { Link } from "react-router";

function Logo() {
  return (
    <Link to="/" className="logo glass">
      {/* The Ayn eye, the eye from the favicon, drawn in white */}
      <img className="logo-mark" src="/logo-mark.svg" alt="" />
      <span id="project-name">Ayn</span>
    </Link>
  );
}

export default Logo;
