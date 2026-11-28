// Ayn: "Review proof", every proof the officers sent for the farms the company funded
// (use case 5). Laid out like My farms funded: the count on a photo, tabs over its
// edge, and each proof as a photo card (the proof's own photo)
import { useState } from "react";
import { Link, useLocation } from "react-router";
import Header from "../components/Header.jsx";
import FarmTile from "../components/FarmTile.jsx";
import Toast from "../components/Toast.jsx";
import { egp } from "../money.js";
import { pairProofs, feddansSwitched } from "../reviewQueue.js";

// The tabs, and the proof status each one shows
const tabs = [
  { label: "To review", status: "pending" },
  { label: "Confirmed", status: "confirmed" },
  { label: "Rejected", status: "rejected" },
];

// What the badge on each card says
const badges = { pending: "To review", confirmed: "Confirmed", rejected: "Rejected" };

function ReviewsPage({ user, fundings, reviews, loading, error, onLogOut }) {
  const [tab, setTab] = useState("pending");
  // After a decision, the review page sends a message here (see Toast.jsx)
  const location = useLocation();

  const pairs = pairProofs(reviews, fundings);
  // count("pending") = how many proofs are waiting
  const count = (status) => pairs.filter((p) => p.proof.status === status).length;
  const shown = pairs.filter((p) => p.proof.status === tab);
  const waiting = count("pending");

  return (
    <div className="screen home-screen co-screen">
      <Header user={user} onLogOut={onLogOut} reviewCount={waiting} />

      {/* Its own photo: water drops on a drip line, the thing the company is checking */}
      <section className="co-hero co-hero-short co-hero-drops" style={{ backgroundImage: "url(/images/company/drip-drops.jpg)" }}>
        <div className="co-hero-text">
          <span className="hero-eyebrow">Review proof</span>
          {/* Nothing waiting: say so, instead of "0 to review" */}
          <h1>{waiting === 0 ? "All caught up." : `${waiting} to review.`}</h1>
          <p>
            {feddansSwitched(fundings)} feddans switched to drip so far · confirm a kit to release the farmer's reward
          </p>
          {/* Straight into the first proof of the queue */}
          {waiting > 0 && (
            <div className="hero-actions">
              <Link to={`/review/${pairs.find((p) => p.proof.status === "pending").proof._id}`} className="main-button">
                Start reviewing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* The tabs, with how many proofs each one holds */}
      <div className="switch co-tabs" role="group" aria-label="Filter proof by status">
        {tabs.map((t) => (
          <button key={t.status} type="button" className={tab === t.status ? "on" : ""} onClick={() => setTab(t.status)}>
            {t.label} <span className="tab-count">{count(t.status)}</span>
          </button>
        ))}
      </div>

      <section className="co-section">
        {loading && <p className="empty">Loading proof...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && shown.length === 0 && (
          <p className="empty">
            {tab === "pending" ? "No proof is waiting. Officers send it once a kit is installed." : "Nothing here yet."}
          </p>
        )}
        <div className="co-grid">
          {shown.map(({ proof, funding }) => (
            <FarmTile
              key={proof._id}
              farm={funding.farm}
              to={`/review/${proof._id}`}
              photo={proof.photoUrl}
              price={`Reward ${egp(funding.reward)}`}
              action={proof.status === "pending" ? "Review" : "View"}
              showStatus
              badge={badges[proof.status]}
              badgeStatus={proof.status}
            />
          ))}
        </div>
      </section>

      {/* key: each visit is a new message, even if the words are the same */}
      <Toast key={location.key} message={location.state && location.state.toast} />
    </div>
  );
}

export default ReviewsPage;
