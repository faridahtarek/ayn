// Ayn: the company's home after signing in (use case 3). Built like DashboardPage.jsx,
// the officer's home: everything comes from the farms it funded and the ones still waiting.
// Its own look: the headline and the numbers sit on a photo of the fields
import { Link } from "react-router";
import Header from "../components/Header.jsx";
import FarmTile from "../components/FarmTile.jsx";
import { egp } from "../money.js";
import { feddansSwitched } from "../reviewQueue.js";

// The 3 stages of a funded farm: its name on screen and its class (colour in index.css)
const statuses = [
  { key: "funded", label: "Waiting for the kit" },
  { key: "installed", label: "Proof to review" },
  { key: "confirmed", label: "Switched to drip" },
];

// "Good morning" before 12, "Good afternoon" before 6pm, then "Good evening"
// (the same as on the officer's home)
function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function CompanyDashboardPage({ user, fundings, openFarms, reviewCount, loading, error, onLogOut }) {
  // Add up what the company has committed (kit + reward) and the feddans it funded
  // forEach: once per funding; += adds to the total
  let committed = 0;
  let totalFeddans = 0;
  fundings.forEach((f) => {
    committed += f.kitCost + f.reward;
    totalFeddans += f.farm.feddans;
  });
  // count("funded") = how many of its farms are "funded"
  const count = (status) => fundings.filter((f) => f.farm.status === status).length;

  // The 4 farms waiting longest come first (MongoDB keeps them in the order they were added)
  const waiting = openFarms.slice(0, 4);

  // First name only, for a friendlier greeting
  const firstName = user.name.split(" ")[0];

  return (
    <div className="screen home-screen co-screen">
      <Header user={user} onLogOut={onLogOut} reviewCount={reviewCount} />

      {/* The headline on a photo of the fields, with the company's numbers along the bottom */}
      <section className="co-hero" style={{ backgroundImage: "url(/images/company/delta-aerial.jpg)" }}>
        <div className="co-hero-text">
          <span className="hero-eyebrow">{user.organisation}</span>
          <h1>{greeting()}, {firstName}.</h1>
          <p>
            {fundings.length === 0
              ? "Fund your first drip kit and reward the farmer who switches."
              : `${feddansSwitched(fundings)} of your ${Math.round(totalFeddans * 10) / 10} feddans funded are now on drip.`}
          </p>
          <div className="hero-actions">
            <Link to="/browse" className="main-button">Fund a farm</Link>
            <Link to="/funded" className="co-light-link">My farms funded ›</Link>
          </div>
        </div>

        {/* The 3 big numbers, each with a thin line above it */}
        <div className="co-hero-stats">
          <div className="co-stat">
            <span className="co-stat-number">{egp(committed)}</span>
            <span className="co-stat-label">committed</span>
          </div>
          {/* Use case 5: only the confirmed farms count, the kits proven in the ground */}
          <div className="co-stat">
            <span className="co-stat-number">{feddansSwitched(fundings)}</span>
            <span className="co-stat-label">feddans switched to drip</span>
          </div>
          <div className="co-stat">
            <span className="co-stat-number">{openFarms.length}</span>
            <span className="co-stat-label">{openFarms.length === 1 ? "farm" : "farms"} waiting for a company</span>
          </div>
        </div>
      </section>

      {/* The farms it funded at a glance: the same panel as on the officer's home */}
      <section className="overview glass">
        <div className="overview-head">
          <span className="overview-title">Your farms at a glance</span>
          <span className="overview-total">{fundings.length} funded</span>
        </div>

        <div className="overview-numbers co-overview-numbers">
          {statuses.map((s) => {
            const inside = (
              <>
                <span className={`dot dot-${s.key}`}></span>
                <span className="overview-count">{count(s.key)}</span>
                <span className="overview-label">{s.label}</span>
              </>
            );
            // Use case 5: "Proof to review" opens the review page
            return s.key === "installed" ? (
              <Link key={s.key} to="/review" className="overview-number overview-link">{inside}</Link>
            ) : (
              <div key={s.key} className="overview-number">{inside}</div>
            );
          })}
        </div>

        {/* Each part of the bar is as wide as its share of the farms it funded */}
        {fundings.length > 0 && (
          <div className="overview-bar" aria-hidden="true">
            {statuses.map((s) =>
              count(s.key) > 0 ? (
                <span key={s.key} className={`bar-${s.key}`} style={{ width: `${(count(s.key) / fundings.length) * 100}%` }}></span>
              ) : null
            )}
          </div>
        )}
      </section>

      {/* A few farms waiting, as photo cards */}
      <section className="co-section">
        <div className="co-section-head">
          <h2>Waiting for a kit</h2>
          <Link to="/browse" className="list-link">See all ›</Link>
        </div>
        {loading && <p className="empty">Loading farms...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && openFarms.length === 0 && (
          <p className="empty">Every farm has a company for now. Check back soon.</p>
        )}
        <div className="co-grid">
          {waiting.map((farm) => (
            <FarmTile key={farm._id} farm={farm} to={`/browse/${farm._id}`} action="Fund" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default CompanyDashboardPage;
