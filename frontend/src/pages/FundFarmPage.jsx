// Ayn: a company funds one farm's kit and sets the farmer's reward (use case 3)
// Finds the farm by its id like EditFarmPage.jsx (Lab 7's ListingPage.jsx).
// Its own look: one framed card floating over a photo of the fields, like a drone's view
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { egp } from "../money.js";
import { photoFor } from "../components/FarmTile.jsx";

function FundFarmPage({ openFarms, loading, onFund }) {
  // For /browse/abc123, id is "abc123"
  const { id } = useParams();
  const farm = openFarms.find((f) => f._id === id);

  // After a reload the farms are still on their way: wait, don't say "not found" yet
  if (loading) {
    return <p className="screen form-screen co-photo-screen empty">Loading the farm...</p>;
  }

  // Not in the list: it doesn't exist, or another company funded it first
  if (!farm) {
    return (
      <div className="screen form-screen co-photo-screen">
        <div className="welcome glass">
          <h1>Farm not available</h1>
          <p>It may have just been funded by another company.</p>
          <Link to="/browse">Back to the farms</Link>
        </div>
      </div>
    );
  }

  // key: a fresh form for each farm (same reason as on Edit farm)
  return <FundFarmForm key={farm._id} farm={farm} onFund={onFund} />;
}

function FundFarmForm({ farm, onFund }) {
  const [reward, setReward] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // What the company pays in all: the kit, plus the reward once confirmed
  // (Number("") is 0, so the total starts as the kit cost alone)
  const total = farm.kitCost + Number(reward);

  async function handleFund(event) {
    event.preventDefault();
    try {
      // Only the reward: the API takes the kit cost from the farm itself
      await onFund(farm._id, Number(reward));
      navigate("/funded"); // to My farms funded, where this farm now shows
    } catch (err) {
      setError(err.message); // e.g. "This farm has already been funded"
    }
  }

  return (
    <div className="screen form-screen co-photo-screen">
      <div className="form-top">
        <Link to="/browse" className="icon-button glass" aria-label="Back to the farms">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>

      <form className="co-frame" onSubmit={handleFund}>
        {/* The card's top row: who and where, then the land as small pills.
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

        {/* The farm's photo with a target over it: this is the farm the kit is for.
            No phone number anywhere: only the cooperative contacts the farmer */}
        <div className="co-frame-photo" style={{ backgroundImage: `url(${photoFor(farm)})` }}>
          <span className="co-badge">Installer · {farm.installer}</span>
          {!farm.photoUrl && <span className="co-photo-note">Library photo</span>}
          {/* The target: 3 circles and 2 lines, drawn in white (aria-hidden: only decoration) */}
          <svg className="co-target" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="88" />
            <circle cx="100" cy="100" r="56" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="18" />
            <path d="M0 100h70M130 100h70M100 0v70M100 130v70" />
          </svg>
          <span className="co-kit-cost">Kit <strong>{egp(farm.kitCost)}</strong></span>
        </div>

        {error && <p className="error">{error}</p>}

        {/* min="1": the browser refuses a reward of 0 or less (the API checks it too) */}
        <div className="field-group soft-glass">
          <label>
            <span>Reward (EGP)</span>
            <input type="number" min="1" step="1" value={reward} required placeholder="e.g. 1500" onChange={(e) => setReward(e.target.value)} />
          </label>
        </div>

        {/* The company confirms the installer's quote before paying.
            required on a checkbox: the form won't send until it is ticked */}
        <label className="agree">
          <input type="checkbox" required />
          I confirm the kit cost of {egp(farm.kitCost)}
        </label>

        <div className="summary-box soft-glass">
          <span className="small">What you commit</span>
          <div><span>Drip kit</span><span>{egp(farm.kitCost)}</span></div>
          {/* Held until you confirm the installation (use case 5) */}
          <div><span>Farmer's reward</span><span>{egp(Number(reward))}</span></div>
          <div className="summary-total"><span>Total</span><span>{egp(total)}</span></div>
        </div>

        <button className="main-button" type="submit">Fund this kit</button>
        <p className="small">Payment is simulated. The reward is held until you confirm the installation.</p>
      </form>
    </div>
  );
}

export default FundFarmPage;
