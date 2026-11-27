// Ayn: add or edit the proof of installation of a funded farm (use case 4)
// A form like Lab 9's AddListingPage.jsx; finds the farm like Lab 7's ListingPage.jsx.
// The same framed card over a photo of the fields as use case 3's Fund this kit
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { photoFor } from "../components/FarmTile.jsx";

function ProofPage({ farms, proofs, loading, onAdd, onSave }) {
  // For /farms/abc123/proof, id is "abc123"
  const { id } = useParams();
  const farm = farms.find((f) => f._id === id);
  // The farm's proof if it already has one: then this page edits it
  const proof = proofs.find((p) => p.farm === id);

  // After a reload the lists are still on their way: wait, don't say "not found" yet
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

  // Not funded, or already confirmed by the company: no proof to send
  if (farm.status === "open" || (proof && proof.status === "confirmed")) {
    return (
      <div className="screen form-screen co-photo-screen">
        <div className="welcome glass">
          <h1>No proof needed</h1>
          <Link to={`/farms/${farm._id}`}>Back to the farm</Link>
        </div>
      </div>
    );
  }

  return <ProofForm farm={farm} proof={proof} onAdd={onAdd} onSave={onSave} />;
}

function ProofForm({ farm, proof, onAdd, onSave }) {
  // Editing: each input starts with the saved value. Adding: empty
  // (the date comes back as "2026-11-20T00:00:00.000Z": the date input wants "2026-11-20")
  const [photoUrl, setPhotoUrl] = useState(proof ? proof.photoUrl : "");
  const [installedOn, setInstalledOn] = useState(proof ? proof.installedOn.slice(0, 10) : "");
  const [note, setNote] = useState(proof ? proof.note : "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    try {
      if (proof) {
        await onSave(proof._id, { photoUrl: photoUrl, installedOn: installedOn, note: note });
      } else {
        await onAdd({ farm: farm._id, photoUrl: photoUrl, installedOn: installedOn, note: note });
      }
      navigate(`/farms/${farm._id}`); // back to the farm, now waiting for review
    } catch (err) {
      setError(err.message); // e.g. "Only a funded farm can get proof"
    }
  }

  // The title says what this form does
  let title = "Add proof";
  if (proof && proof.status === "rejected") {
    title = "Send new proof";
  } else if (proof) {
    title = "Edit proof";
  }

  return (
    <div className="screen form-screen co-photo-screen wide-screen">
      <div className="form-top">
        <Link to={`/farms/${farm._id}`} className="icon-button glass" aria-label="Back to the farm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>

      <form className="co-frame wide-frame" onSubmit={handleSubmit}>
        {/* The card's top row, like on Fund this kit */}
        <div className="co-frame-head">
          <div>
            <h1>{title}</h1>
            <span className="co-frame-id">#{farm._id.slice(-6).toUpperCase()} · {farm.farmerName} · {farm.village}</span>
          </div>
          <div className="co-pills">
            <span className="co-pill">{farm.feddans} <span>fd</span></span>
            <span className="co-pill">{farm.crop}</span>
          </div>
        </div>

        {/* On a laptop: the photo on the left, the fields on the right (stacked on a phone) */}
        <div className="frame-columns">
          <div className="frame-left">
            {/* Your photo as soon as a link is pasted, until then the farm's photo
                (a || b: a if it has a value, otherwise b) */}
            <div className="co-frame-photo" style={{ backgroundImage: `url(${photoUrl || photoFor(farm)})` }}>
              <span className="co-badge">Installer · {farm.installer}</span>
              <span className="co-photo-note">{photoUrl ? "Your photo" : "Paste a photo link"}</span>
            </div>
          </div>

          <div className="frame-right">
            {/* After a rejection: why, in the company's words (use case 5) */}
            {proof && proof.status === "rejected" && proof.reviewNote && (
              <p className="review-note">Company: {proof.reviewNote}</p>
            )}

            {error && <p className="error">{error}</p>}

            <div className="field-group soft-glass">
              <label>
                <span>Photo link</span>
                <input value={photoUrl} required placeholder="https://..." onChange={(e) => setPhotoUrl(e.target.value)} />
              </label>
              <label>
                <span>Installed on</span>
                {/* Not in the labs: type="date" shows a calendar and gives "2026-11-24" */}
                <input type="date" value={installedOn} required onChange={(e) => setInstalledOn(e.target.value)} />
              </label>
              <label>
                <span>Note</span>
                <input value={note} placeholder="Optional, e.g. lines on all beds" onChange={(e) => setNote(e.target.value)} />
              </label>
            </div>

            <button className="main-button" type="submit">
              {proof ? "Save and send for review" : "Send for review"}
            </button>
            <p className="small">The company reviews it before the farmer's reward is released.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProofPage;
