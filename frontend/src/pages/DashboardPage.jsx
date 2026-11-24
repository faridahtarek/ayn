// Ayn: the officer's home after signing in. Everything comes from their real farms
import { Link } from "react-router";
import Header from "../components/Header.jsx";
import FarmCard from "../components/FarmCard.jsx";

// Each status: its name on screen and its class (the colour is in index.css)
const statuses = [
  { key: "open", label: "Waiting for a company" },
  { key: "funded", label: "Funded" },
  { key: "installed", label: "Awaiting review" },
  { key: "confirmed", label: "Confirmed" },
];

// "Good morning" before 12, "Good afternoon" before 6pm, then "Good evening"
function greeting() {
  // new Date() is the current date and time; getHours() its hour, 0 to 23
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardPage({ user, farms, loading, error, onLogOut }) {
  // Add up the feddans, and count the farms in each status
  // forEach runs the arrow function once per farm; += adds its feddans to the total
  let totalFeddans = 0;
  farms.forEach((f) => {
    totalFeddans += f.feddans;
  });
  // A small function in a const: count("open") = how many farms are "open"
  const count = (status) => farms.filter((f) => f.status === status).length;

  // The 4 most recently registered farms (MongoDB adds new ones at the end)
  // slice(-4): a copy of the last 4; reverse(): newest first
  const latest = farms.slice(-4).reverse();

  // First name only, for a friendlier greeting
  // split(" ") cuts "Mahmoud Salah" into ["Mahmoud", "Salah"]; [0] is the first
  const firstName = user.name.split(" ")[0];

  return (
    <div className="screen home-screen dashboard-screen">
      <Header user={user} onLogOut={onLogOut} />

      {/* The headline, with the two main actions under it */}
      <div className="hero">
        <span className="hero-eyebrow">{user.organisation}</span>
        <h1>{greeting()}, {firstName}.</h1>
        {/* No farms: an invitation. Otherwise e.g. "4.6 feddans across 3 farms".
            Math.round(x * 10) / 10 rounds to one decimal; the inner ? : picks "farm" or "farms" */}
        <p>
          {farms.length === 0
            ? "Register your first farm to get its drip kit funded."
            : `${Math.round(totalFeddans * 10) / 10} feddans across ${farms.length} ${farms.length === 1 ? "farm" : "farms"}.`}
        </p>
        <div className="hero-actions">
          <Link to="/farms/new" className="main-button">+ Register a farm</Link>
          <Link to="/farms" className="ghost-button">View all farms ›</Link>
        </div>
      </div>

      {/* Your farms at a glance: 4 numbers and a bar split by status */}
      <section className="overview glass">
        <div className="overview-head">
          <span className="overview-title">Your farms at a glance</span>
          <span className="overview-total">{farms.length} total</span>
        </div>

        <div className="overview-numbers">
          {statuses.map((s) => (
            <div key={s.key} className="overview-number">
              {/* A template string builds the class, e.g. "dot dot-open" (its colour is in index.css) */}
              <span className={`dot dot-${s.key}`}></span>
              <span className="overview-count">{count(s.key)}</span>
              <span className="overview-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Each part of the bar is as wide as its share of the farms.
            style={{ width: "50%" }}: a CSS value set from JavaScript (outer braces = JS,
            inner braces = the object of styles). 2 open farms out of 4 = 50% wide.
            ? ... : null draws nothing for a status with no farms.
            aria-hidden: screen readers skip the bar, the numbers above already say it */}
        {farms.length > 0 && (
          <div className="overview-bar" aria-hidden="true">
            {statuses.map((s) =>
              count(s.key) > 0 ? (
                <span key={s.key} className={`bar-${s.key}`} style={{ width: `${(count(s.key) / farms.length) * 100}%` }}></span>
              ) : null
            )}
          </div>
        )}
      </section>

      {/* The latest farms */}
      <section className="farm-list soft-glass">
        <div className="list-head">
          <span className="list-title">Latest farms</span>
          <Link to="/farms" className="list-link">See all ›</Link>
        </div>
        {loading && <p className="empty">Loading your farms...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && farms.length === 0 && (
          <p className="empty">No farms yet. Register your first farm.</p>
        )}
        {latest.map((farm) => (
          <FarmCard key={farm._id} farm={farm} />
        ))}
      </section>
    </div>
  );
}

export default DashboardPage;
