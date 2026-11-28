// Ayn: one farm as a photo card, on the company's pages (use case 3)
// The officer's pages keep FarmCard.jsx, the slim row
import { Link } from "react-router";
import { egp } from "../money.js";

// What each status is called on screen (the same names as FarmCard.jsx)
const statusLabels = {
  open: "Open",
  funded: "Funded",
  installed: "Awaiting review",
  confirmed: "Confirmed",
};

// Photos of Egyptian fields (public/images/company, credits in CREDITS.md there),
// used when a farm has no photo of its own
const libraryPhotos = [
  "/images/company/rice-seedlings.jpg",
  "/images/company/field-by-water.jpg",
  "/images/company/ploughed-field.jpg",
  "/images/company/palms-mist.jpg",
  "/images/company/palms-field.jpg",
  "/images/company/mudbrick-field.jpg",
  "/images/company/nile-feluccas.jpg",
];

// The farm's own photo, or one from the library.
// parseInt(..., 16) reads the last 2 characters of the _id as a number, and % keeps it
// between 0 and 6, so the same farm always gets the same photo
export function photoFor(farm) {
  if (farm.photoUrl) return farm.photoUrl;
  const n = parseInt(farm._id.slice(-2), 16) || 0;
  return libraryPhotos[n % libraryPhotos.length];
}

// to: where the card leads. price: the amount in the corner (e.g. the kit cost).
// action: the words beside the arrow. showStatus: the status badge, on My farms funded.
// Use case 5: photo (the proof's photo instead of the farm's), badge and badgeStatus
// (the proof's own status, e.g. "pending", instead of the farm's)
function FarmTile({ farm, to, price, action, showStatus, photo, badge, badgeStatus }) {
  return (
    <Link className="co-tile" to={to}>
      {/* The photo, with the governorate and status as small badges on top of it.
          style={{ backgroundImage }}: the photo is set from JSX, like the landing page bands */}
      <div className="co-tile-photo" style={{ backgroundImage: `url(${photo || photoFor(farm)})` }}>
        <span className="co-badge">{farm.governorate}</span>
        {showStatus && (
          <span className={`co-badge co-status co-status-${badgeStatus || farm.status}`}>{badge || statusLabels[farm.status]}</span>
        )}
        {/* An honest note when the photo isn't of this farm */}
        {photo && <span className="co-photo-note">Proof photo</span>}
        {!photo && !farm.photoUrl && <span className="co-photo-note">Library photo</span>}
      </div>

      <div className="co-tile-body">
        <span className="co-tile-name">{farm.farmerName}</span>
        <span className="co-tile-meta">
          {farm.village} · {farm.feddans} fd · {farm.crop}
        </span>
        <div className="co-tile-foot">
          <span className="co-tile-price">{price || egp(farm.kitCost)}</span>
          <span className="co-tile-action">
            {action}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default FarmTile;
