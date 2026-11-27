// Ayn: one funded farm and its proof of installation (use case 4)
// Finds the farm by its id like Lab 7's ListingPage.jsx. The same framed card over
// a photo of the fields as use case 3's Fund this kit; the delete box as on Edit farm
import { useState } from "react";
import { Link, useParams } from "react-router";
import { egp } from "../money.js";
import { photoFor } from "../components/FarmTile.jsx";
import { nextStep } from "../components/FarmCard.jsx";

// The farm's 4 steps, in order
const steps = [
  { n: 0, label: "Registered" },
  { n: 1, label: "Funded" },
  { n: 2, label: "Proof sent" },
  { n: 3, label: "Confirmed" },
];

// Which step each farm status has reached
const stepOf = { open: 0, funded: 1, installed: 2, confirmed: 3 };

// What the badge on the photo says, by the proof's status, or the farm's if no proof yet
const badgeText = {
  open: "Open · waiting for a company",
  funded: "Funded · add proof once the kit is in",
  pending: "Proof sent · waiting for review",
  rejected: "Rejected · send new proof",
  confirmed: "Confirmed · reward released",
};

function FarmPage({ farms, proofs, loading, onDeleteProof }) {
  // For /farms/abc123, id is "abc123"
  const { id } = useParams();
  const farm = farms.find((f) => f._id === id);
  // This farm's proof, or undefined if the officer hasn't added one yet
  const proof = proofs.find((p) => p.farm === id);

  // Is the "Delete this proof?" box showing?
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  // After a reload the farms are still on their way: wait, don't say "not found" yet
  if (loading) {
    return <p className="screen form-screen co-photo-screen empty">Loading your farm...</p>;
  }

  if (!farm) {
    return (
      <div className="screen form-screen co-photo-screen">
        <div className="welcome glass">
          <h1>Farm not found</h1>
          <Link to="/farms">Back to my farms</Link>
        </div>
      </div>
    );
  }

  async function handleDelete() {
    try {
      await onDeleteProof(proof._id);
      setConfirming(false); // stay here: the farm now shows "Add proof" again
    } catch (err) {
      setConfirming(false);
      setError(err.message); // e.g. "The company already reviewed this proof..."
    }
  }

  // The proof's status if there is one, otherwise the farm's (e.g. "funded")
  const status = proof ? proof.status : farm.status;

  return (
    <div className="screen form-screen co-photo-screen wide-screen">
      <div className="form-top">
        <Link to="/farms" className="icon-button glass" aria-label="Back to my farms">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>

      <div className="co-frame wide-frame">
        {/* The card's top row, like on Fund this kit.
            slice(-6): the last 6 characters of the _id, a short farm number */}
        <div className="co-frame-head">
          <div>
            <h1>{farm.farmerName}</h1>
            <span className="co-frame-id">#{farm._id.slice(-6).toUpperCase()} · {farm.village}, {farm.governorate}</span>
          </div>
          <div className="co-pills">
            <span className="co-pill">{farm.feddans} <span>fd</span></span>
            <span className="co-pill">{farm.crop}</span>
          </div>
        </div>

        {/* On a laptop: two columns side by side (photo and steps | proof and buttons).
            On a phone they stack, one under the other */}
        <div className="frame-columns">
          <div className="frame-left">
            {/* The proof's photo once there is one, otherwise the farm's (or a library photo) */}
            <div className="co-frame-photo" style={{ backgroundImage: `url(${proof ? proof.photoUrl : photoFor(farm)})` }}>
              {/* badgeText[status] looks up the sentence above, e.g. badgeText["pending"] */}
              <span className={`co-badge co-status co-status-${status}`}>{badgeText[status]}</span>
              {proof && <span className="co-photo-note">Proof photo</span>}
              {!proof && !farm.photoUrl && <span className="co-photo-note">Library photo</span>}
              {/* The installer beside the price, like use case 3's Edit funding page */}
              <span className="co-kit-cost">Kit <strong>{egp(farm.kitCost)}</strong> · {farm.installer}</span>
            </div>

            {/* Status update: the steps so far are lit ("done"), then what happens next */}
            <div className="summary-box soft-glass">
              <ol className="steps">
                {steps.map((s) => (
                  <li key={s.n} className={s.n <= stepOf[farm.status] ? "done" : ""}>
                    {s.label}
                  </li>
                ))}
              </ol>
              <span className="next-step">{nextStep(farm, proof)}</span>
            </div>
          </div>

          <div className="frame-right">
            {error && <p className="error">{error}</p>}

            {/* The proof's details */}
            {proof && (
              <div className="summary-box soft-glass">
                <span className="small">Proof of installation</span>
                {/* The API sends "2026-11-20T00:00:00.000Z": the first 10 characters are the date */}
                <div><span>Installed on</span><span>{proof.installedOn.slice(0, 10)}</span></div>
                {/* The note is optional: only show it if there is one */}
                {proof.note && <div><span>Note</span><span>{proof.note}</span></div>}
                {/* After a rejection: why, in the company's words (use case 5) */}
                {proof.status === "rejected" && proof.reviewNote && (
                  <p className="review-note">Company: {proof.reviewNote}</p>
                )}
              </div>
            )}

            {/* Funded with no proof: the officer adds it once the kit is in */}
            {farm.status === "funded" && !proof && (
              <Link to={`/farms/${farm._id}/proof`} className="main-button">Add proof of installation</Link>
            )}
            {/* Edit: any time before the company confirms it */}
            {proof && proof.status !== "confirmed" && (
              <Link to={`/farms/${farm._id}/proof`} className="main-button">
                {proof.status === "rejected" ? "Send new proof" : "Edit proof"}
              </Link>
            )}
            {/* Delete: only while it waits for the company */}
            {proof && proof.status === "pending" && (
              <button className="delete-button" type="button" onClick={() => setConfirming(true)}>
                Delete proof
              </button>
            )}

            {farm.status === "open" && <p className="small">A company has to fund this farm before it can get proof.</p>}
            {!proof && farm.status === "funded" && <p className="small">A photo of the installed kit, the date and a note.</p>}
          </div>
        </div>
      </div>

      {/* Only while confirming is true (the same box as "Delete farm") */}
      {confirming && (
        <div className="confirm-box glass" role="alertdialog" aria-label="Delete proof">
          <span className="confirm-title">Delete this proof?</span>
          <span>The company won't see it any more, and the farm goes back to funded.</span>
          <div className="confirm-buttons">
            <button type="button" className="cancel-button" onClick={() => setConfirming(false)}>Cancel</button>
            <button type="button" className="delete-button solid" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmPage;
