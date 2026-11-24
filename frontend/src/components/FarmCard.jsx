// Ayn: one farm, as a row on "My farms" (copies Lab 9's ListingCard.jsx)
import { Link } from "react-router";

// What each status is called on screen, and its colour (in index.css)
const statusLabels = {
  open: "Open",
  funded: "Funded",
  installed: "Awaiting review",
  confirmed: "Confirmed",
};

function FarmCard({ farm }) {
  // The inside of the card, kept in a variable so both versions below reuse it
  const details = (
    <>
      {/* The farm's photo, or a plain square if it has none */}
      {farm.photoUrl ? (
        <img className="farm-thumb" src={farm.photoUrl} alt="" />
      ) : (
        <span className="farm-thumb empty-thumb" aria-hidden="true"></span>
      )}
      <div className="farm-text">
        <span className="farm-name">{farm.farmerName}</span>
        <span className="farm-meta">
          {farm.village} · {farm.feddans} fd · {farm.crop}
        </span>
      </div>
      {/* statusLabels[farm.status] looks up the name in the object above,
          e.g. statusLabels["installed"] is "Awaiting review" */}
      <span className={`chip chip-${farm.status}`}>{statusLabels[farm.status]}</span>
    </>
  );

  // Only an open farm can be edited, so only it links to the edit page
  if (farm.status === "open") {
    return (
      <Link className="farm-card" to={`/farms/${farm._id}/edit`}>
        {details}
      </Link>
    );
  }
  return <div className="farm-card">{details}</div>;
}

export default FarmCard;
