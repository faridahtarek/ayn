// Ayn: one farm, as a row on "My farms" (copies Lab 9's ListingCard.jsx)
import { Link } from "react-router";

// What each status is called on screen, and its colour (in index.css)
const statusLabels = {
  open: "Open",
  funded: "Funded",
  installed: "Awaiting review",
  confirmed: "Confirmed",
};

// Use case 4: what happens next for this farm, from its status and its proof.
// Used here on each row and on the farm's own page (FarmPage.jsx)
export function nextStep(farm, proof) {
  if (farm.status === "open") return "Next: a company funds the kit";
  if (farm.status === "installed") return "Next: the company reviews your proof";
  if (farm.status === "confirmed") return "Done: the farmer's reward is released";
  // Funded: no proof yet, or the company rejected it (the farm went back to funded)
  if (proof && proof.status === "rejected") return "Next: send new proof";
  return "Next: add proof once the kit is installed";
}

function FarmCard({ farm, proof }) {
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
        <span className="farm-next">{nextStep(farm, proof)}</span>
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
  // Use case 4: a funded farm opens its own page, with its proof
  return (
    <Link className="farm-card" to={`/farms/${farm._id}`}>
      {details}
    </Link>
  );
}

export default FarmCard;
