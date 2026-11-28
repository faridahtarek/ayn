// Ayn: "Fund a farm", every farm waiting for a company (use case 3)
// The same filters as My farms' tabs, but laid out like a travel site:
// a photo at the top, the filter bar over its edge, and the farms as photo cards
import { useState } from "react";
import Header from "../components/Header.jsx";
import FarmTile from "../components/FarmTile.jsx";
import { governorates, crops } from "../farmOptions.js";

// The size choices: each keeps the farms between min and max feddans
const sizes = [
  { label: "Any size", key: "all", min: 0, max: Infinity },
  { label: "Under 1 feddan", key: "small", min: 0, max: 1 },
  { label: "1 to 3 feddans", key: "medium", min: 1, max: 3 },
  { label: "Over 3 feddans", key: "large", min: 3, max: Infinity },
];

function BrowseFarmsPage({ user, openFarms, reviewCount, loading, error, onLogOut }) {
  // The 3 filters (Lab 7: state). "all" means no filter
  const [governorate, setGovernorate] = useState("all");
  const [crop, setCrop] = useState("all");
  const [size, setSize] = useState("all");

  // sizes.find gives the chosen size's object, with its min and max
  const range = sizes.find((s) => s.key === size);

  // Only the farms that pass all 3 filters (&&: every condition must be true)
  // A farm of exactly 1 feddan is in "1 to 3", not "Under 1": >= min and < max
  const shown = openFarms.filter(
    (f) =>
      (governorate === "all" || f.governorate === governorate) &&
      (crop === "all" || f.crop === crop) &&
      f.feddans >= range.min &&
      f.feddans < range.max
  );

  // Add up the feddans of the farms shown
  let shownFeddans = 0;
  shown.forEach((f) => {
    shownFeddans += f.feddans;
  });

  return (
    <div className="screen home-screen co-screen">
      <Header user={user} onLogOut={onLogOut} reviewCount={reviewCount} />

      {/* The photo band (a tractor working a field, from above), with the count of what the filters show */}
      <section className="co-hero co-hero-short" style={{ backgroundImage: "url(/images/company/tractor-aerial.jpg)" }}>
        <div className="co-hero-text">
          <span className="hero-eyebrow">Fund a farm</span>
          <h1>Waiting for a kit.</h1>
          {/* Math.round(x * 10) / 10: one decimal; the inner ? : picks "farm" or "farms" */}
          <p>
            {shown.length} {shown.length === 1 ? "farm" : "farms"} · {Math.round(shownFeddans * 10) / 10} feddans ready to switch to drip
          </p>
        </div>
      </section>

      {/* The filter bar over the bottom edge of the photo: one dropdown per filter.
          The first option, "All", turns that filter off */}
      <div className="co-filter-bar">
        <label>
          <span>Governorate</span>
          <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
            <option value="all">All governorates</option>
            {governorates.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Crop</span>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="all">All crops</option>
            {crops.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Land size</span>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {sizes.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <section className="co-section">
        {loading && <p className="empty">Loading farms...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && openFarms.length === 0 && (
          <p className="empty">Every farm has a company for now. Check back soon.</p>
        )}
        {!loading && openFarms.length > 0 && shown.length === 0 && (
          <p className="empty">No farms match these filters.</p>
        )}
        {/* One photo card per farm; each leads to its own page, where the company funds it */}
        <div className="co-grid">
          {shown.map((farm) => (
            <FarmTile key={farm._id} farm={farm} to={`/browse/${farm._id}`} action="Fund this kit" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default BrowseFarmsPage;
