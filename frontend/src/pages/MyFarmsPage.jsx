// Ayn: "My farms", the officer's home page (use case 2)
import { useState } from "react";
import { Link } from "react-router";
import Header from "../components/Header.jsx";
import FarmCard from "../components/FarmCard.jsx";

// The filter tabs, and the status each one shows
const tabs = [
  { label: "All", status: "all" },
  { label: "Open", status: "open" },
  { label: "Funded", status: "funded" },
  { label: "Installed", status: "installed" },
  { label: "Confirmed", status: "confirmed" },
];

function MyFarmsPage({ user, farms, loading, error, onLogOut }) {
  // Which tab is chosen (Lab 7: state)
  const [tab, setTab] = useState("all");

  // Add up the feddans of all the officer's farms
  // (forEach: once per farm; += adds to the total)
  let totalFeddans = 0;
  farms.forEach((f) => {
    totalFeddans += f.feddans;
  });

  // Only the farms with the chosen status
  // ||: keep the farm if "All" is chosen OR its status is the chosen one
  const shown = farms.filter((f) => tab === "all" || f.status === tab);

  // One card per farm
  const cards = shown.map((farm) => <FarmCard key={farm._id} farm={farm} />);

  return (
    <div className="screen home-screen farms-screen">
      <Header user={user} onLogOut={onLogOut} />

      {/* On a laptop: the summary and filters on the left, the farms on the right */}
      <div className="page-layout">
        <aside className="page-side">
          <div className="summary glass">
            <span className="small">My farms</span>
            {/* Math.round(x * 10) / 10: rounds to one decimal, e.g. 4.6 */}
            <span className="summary-number">
              {Math.round(totalFeddans * 10) / 10} <span>feddans · {farms.length} {farms.length === 1 ? "farm" : "farms"}</span>
            </span>
            <Link to="/farms/new" className="main-button">
              + Register a farm
            </Link>
          </div>

          {/* One button per tab; the chosen one gets the class "on".
              role and aria-label: tell screen readers these buttons belong together */}
          <div className="switch tabs soft-glass" role="group" aria-label="Filter farms by status">
            {tabs.map((t) => (
              <button key={t.status} type="button" className={tab === t.status ? "on" : ""} onClick={() => setTab(t.status)}>
                {t.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="farm-list soft-glass">
          {loading && <p className="empty">Loading your farms...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && farms.length === 0 && (
            <p className="empty">No farms yet. Register your first farm.</p>
          )}
          {!loading && farms.length > 0 && shown.length === 0 && (
            <p className="empty">No farms with this status.</p>
          )}
          {cards}
        </div>
      </div>
    </div>
  );
}

export default MyFarmsPage;
