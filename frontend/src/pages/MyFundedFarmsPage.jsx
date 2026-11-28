// Ayn: "My farms funded", every farm the company paid for (use case 3)
// The same tabs as My farms; the total sits big on a photo, the farms below as photo cards
import { useState } from "react";
import { Link } from "react-router";
import Header from "../components/Header.jsx";
import FarmTile from "../components/FarmTile.jsx";
import { egp } from "../money.js";
import { feddansSwitched } from "../reviewQueue.js";

// The filter tabs, and the farm status each one shows
const tabs = [
  { label: "All", status: "all" },
  { label: "Funded", status: "funded" },
  { label: "Installed", status: "installed" },
  { label: "Confirmed", status: "confirmed" },
];

function MyFundedFarmsPage({ user, fundings, reviewCount, loading, error, onLogOut }) {
  const [tab, setTab] = useState("all");

  // What the company committed (each kit + its reward) and the feddans it funded
  let committed = 0;
  let totalFeddans = 0;
  fundings.forEach((f) => {
    committed += f.kitCost + f.reward;
    totalFeddans += f.farm.feddans;
  });

  // Only the fundings whose farm has the chosen status (f.farm: the farm inside the funding)
  const shown = fundings.filter((f) => tab === "all" || f.farm.status === tab);

  return (
    <div className="screen home-screen co-screen">
      <Header user={user} onLogOut={onLogOut} reviewCount={reviewCount} />

      {/* The total on a photo of the Nile valley */}
      <section className="co-hero co-hero-short" style={{ backgroundImage: "url(/images/company/nile-valley.jpg)" }}>
        <div className="co-hero-text">
          <span className="hero-eyebrow">My farms funded</span>
          <h1>{egp(committed)}</h1>
          {/* e.g. "committed to 4.3 feddans across 2 farms" */}
          <p>
            committed to {Math.round(totalFeddans * 10) / 10} feddans across {fundings.length} {fundings.length === 1 ? "farm" : "farms"}
            {/* Use case 5: how much of it is proven on drip, for the sustainability report */}
            {" · "}{feddansSwitched(fundings)} switched to drip
          </p>
          <div className="hero-actions">
            <Link to="/browse" className="main-button">Fund another farm</Link>
          </div>
        </div>
      </section>

      {/* The tabs, over the bottom edge of the photo (the same switch as My farms) */}
      <div className="switch co-tabs" role="group" aria-label="Filter farms by status">
        {tabs.map((t) => (
          <button key={t.status} type="button" className={tab === t.status ? "on" : ""} onClick={() => setTab(t.status)}>
            {t.label}
          </button>
        ))}
      </div>

      <section className="co-section">
        {loading && <p className="empty">Loading your farms...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && fundings.length === 0 && (
          <p className="empty">No farms funded yet. Fund your first drip kit.</p>
        )}
        {!loading && fundings.length > 0 && shown.length === 0 && (
          <p className="empty">No farms with this status.</p>
        )}
        {/* One photo card per funding: it shows the farm and the reward, and leads to the funding's page */}
        <div className="co-grid">
          {shown.map((f) => (
            <FarmTile key={f._id} farm={f.farm} to={`/funded/${f._id}`} price={`${egp(f.kitCost + f.reward)}`} action="Details" showStatus />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyFundedFarmsPage;
