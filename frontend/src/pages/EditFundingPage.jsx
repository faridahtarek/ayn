// Ayn: one farm the company funded: change the reward or withdraw (use case 3)
// Built like EditFarmPage.jsx: finds the funding by its id, then a form with a delete box.
// The same framed card over the fields as Fund this kit
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { egp } from "../money.js";
import { photoFor } from "../components/FarmTile.jsx";

// What each farm status means for the company
const statusNotes = {
  funded: "Funded · editable until proof is uploaded",
  installed: "Proof uploaded · awaiting your review",
  confirmed: "Confirmed · reward released",
};

function EditFundingPage({ fundings, reviews, loading, onSave, onWithdraw }) {
  // For /funded/abc123, id is the funding's _id
  const { id } = useParams();
  const funding = fundings.find((f) => f._id === id);

  // After a reload the fundings are still on their way: wait, don't say "not found" yet
  if (loading) {
    return <p className="screen form-screen co-photo-screen empty">Loading your farm...</p>;
  }

  if (!funding) {
    return (
      <div className="screen form-screen co-photo-screen">
        <div className="welcome glass">
          <h1>Farm not found</h1>
          <Link to="/funded">Back to my farms funded</Link>
        </div>
      </div>
    );
  }

  // key: a fresh form for each funding (same reason as on Edit farm)
  return <EditFundingForm key={funding._id} funding={funding} proof={reviews.find((p) => p.farm === funding.farm._id)} onSave={onSave} onWithdraw={onWithdraw} />;
}

// proof (use case 5): the officer's proof for this farm, if there is one
function EditFundingForm({ funding, proof, onSave, onWithdraw }) {
  // The farm inside the funding (the API filled it in with populate)
  const farm = funding.farm;
  // The reward starts at the saved one
  const [reward, setReward] = useState(funding.reward);
  // Is the "Withdraw?" box showing?
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Only while the farm waits for its kit can the deal change
  const canChange = farm.status === "funded";

  async function handleSave(event) {
    event.preventDefault();
    try {
      await onSave(funding._id, Number(reward));
      navigate("/funded"); // back to My farms funded
    } catch (err) {
      setError(err.message); // e.g. "Proof of installation has been uploaded..."
    }
  }

  async function handleWithdraw() {
    try {
      await onWithdraw(funding._id);
      navigate("/funded");
    } catch (err) {
      setConfirming(false);
      setError(err.message);
    }
  }

  return (
    <div className="screen form-screen co-photo-screen">
      <div className="form-top">
        <Link to="/funded" className="icon-button glass" aria-label="Back to my farms funded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>

      <form className="co-frame" onSubmit={handleSave}>
        {/* The card's top row, like on Fund this kit */}
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

        <div className="co-frame-photo" style={{ backgroundImage: `url(${photoFor(farm)})` }}>
          {/* statusNotes[farm.status] looks up the sentence above, e.g. statusNotes["funded"] */}
          <span className={`co-badge co-status co-status-${farm.status}`}>{statusNotes[farm.status]}</span>
          {!farm.photoUrl && <span className="co-photo-note">Library photo</span>}
          <span className="co-kit-cost">Kit <strong>{egp(funding.kitCost)}</strong> · {farm.installer}</span>
        </div>

        {error && <p className="error">{error}</p>}

        {/* The reward: an input while it can change, plain text after */}
        {canChange ? (
          <div className="field-group soft-glass">
            <label>
              <span>Reward (EGP)</span>
              <input type="number" min="1" step="1" value={reward} required onChange={(e) => setReward(e.target.value)} />
            </label>
          </div>
        ) : (
          <div className="summary-box soft-glass">
            {/* held or released: released once you confirm the proof (use case 5) */}
            <div><span>Farmer's reward</span><span>{egp(funding.reward)} · {funding.rewardStatus}</span></div>
          </div>
        )}

        <div className="summary-box soft-glass">
          <span className="small">What you commit</span>
          <div><span>Drip kit</span><span>{egp(funding.kitCost)}</span></div>
          <div><span>Farmer's reward</span><span>{egp(Number(reward))}</span></div>
          <div className="summary-total"><span>Total</span><span>{egp(funding.kitCost + Number(reward))}</span></div>
        </div>

        {/* && : the buttons only exist while the deal can change */}
        {/* Use case 5: proof is waiting, so the next step is the review */}
        {proof && proof.status === "pending" && (
          <Link to={`/review/${proof._id}`} className="main-button">Review the proof</Link>
        )}
        {canChange && <button className="main-button" type="submit">Save reward</button>}
        {canChange && (
          <button className="delete-button" type="button" onClick={() => setConfirming(true)}>
            Withdraw funding
          </button>
        )}
      </form>

      {/* Only while confirming is true (the same box as "Delete farm") */}
      {confirming && (
        <div className="confirm-box glass" role="alertdialog" aria-label="Withdraw funding">
          <span className="confirm-title">Withdraw from {farm.farmerName}'s farm?</span>
          <span>The farm goes back on the list, so another company can fund its kit.</span>
          <div className="confirm-buttons">
            <button type="button" className="cancel-button" onClick={() => setConfirming(false)}>Cancel</button>
            <button type="button" className="delete-button solid" onClick={handleWithdraw}>Withdraw</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditFundingPage;
