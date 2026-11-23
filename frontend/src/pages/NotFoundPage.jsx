// Ayn: shown for any address we have no page for (Lab 7)
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="screen home-screen">
      <div className="welcome glass">
        <h1>Page not found</h1>
        <p>There is nothing at this address.</p>
        <Link to="/">Back home</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
