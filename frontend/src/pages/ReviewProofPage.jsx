// Ayn: the company reviews one proof: confirm it (the reward is released) or reject it
// with a note (it goes back to the officer). Use case 5.
// The same framed card over the fields as Faridah's farm page (use case 4), with:
// - a before/after slider: the farm's own photo from registration, and the officer's proof photo
//   (a farm registered without a photo shows the proof photo alone)
// - the review queue: "2 of 5", the arrows, or the ← → keys move between proofs,
//   and after a decision the page moves on to the next one by itself
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import Toast from "../components/Toast.jsx";
import { egp } from "../money.js";
import { pairProofs, waitingQueue } from "../reviewQueue.js";

// The farm's 4 steps, in order (the same as on the officer's farm page)
const steps = [
  { n: 0, label: "Registered" },
  { n: 1, label: "Funded" },
  { n: 2, label: "Proof sent" },
  { n: 3, label: "Confirmed" },
];
const stepOf = { open: 0, funded: 1, installed: 2, confirmed: 3 };

// What the badge on the photo says, by the proof's status
const badgeText = {
  pending: "Waiting for your review",
  confirmed: "Confirmed · reward released",
  rejected: "Rejected · back to the officer",
};

function ReviewProofPage({ fundings, reviews, loading, onReview }) {
  // For /review/abc123, id is the proof's _id
  const { id } = useParams();

  if (loading) {
    return <p className="screen form-screen co-photo-screen empty">Loading the proof...</p>;
  }

  // This proof with its funding (and so its farm)
  const pair = pairProofs(reviews, fundings).find((p) => p.proof._id === id);
  if (!pair) {
    return (
      <div className="screen form-screen co-photo-screen">
        <div className="welcome glass">
          <h1>Proof not found</h1>
          <Link to="/review">Back to Review proof</Link>
        </div>
      </div>
    );
  }

  // key: a fresh page for each proof, so the note box starts empty again
  return <ReviewCard key={id} pair={pair} queue={waitingQueue(reviews, fundings)} onReview={onReview} />;
}

function ReviewCard({ pair, queue, onReview }) {
  const { proof, funding } = pair;
  const farm = funding.farm;
  const [note, setNote] = useState(proof.reviewNote || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Where this proof sits in the queue: -1 if it was already reviewed
  const place = queue.findIndex((p) => p.proof._id === proof._id);
  // The proofs before and after it (none at the ends)
  const previous = place > 0 ? queue[place - 1] : null;
  const next = place >= 0 && place < queue.length - 1 ? queue[place + 1] : null;

  // ← and → move through the queue, Escape goes back to the list
  // (not while typing the note, where the arrows move the cursor)
  useEffect(() => {
    function onKey(e) {
      if (document.activeElement.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && previous) navigate(`/review/${previous.proof._id}`);
      if (e.key === "ArrowRight" && next) navigate(`/review/${next.proof._id}`);
      if (e.key === "Escape" && !document.querySelector(".jump-box")) navigate("/review");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next]);

  async function decide(decision) {
    setError("");
    setBusy(true); // grey out the buttons so one click can't send twice
    try {
      await onReview(proof._id, decision, note);
      // The message that fades in at the bottom of the next page
      const message =
        decision === "confirmed"
          ? `Confirmed: ${farm.farmerName}'s reward of ${egp(funding.reward)} is released`
          : `Rejected: ${farm.farmerName}'s proof went back to the officer`;
      // On to the next proof that still waits, or back to the list if this was the last
      // (the queue still holds this proof: skip it)
      const rest = queue.filter((p) => p.proof._id !== proof._id);
      const following = next || rest[0];
      navigate(following ? `/review/${following.proof._id}` : "/review", { state: { toast: message } });
    } catch (err) {
      setError(err.message); // e.g. "Write a note so the officer knows what to fix"
      setBusy(false);
    }
  }

  const waiting = proof.status === "pending";

  return (
    <div className="screen form-screen co-photo-screen wide-screen">
      <div className="form-top review-top">
        <Link to="/review" className="icon-button glass" aria-label="Back to Review proof">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>

        {/* The queue: "2 of 5" between the two arrows (only for proofs still waiting) */}
        {place >= 0 && (
          <div className="queue-nav glass" aria-label="Review queue">
            <QueueArrow to={previous && `/review/${previous.proof._id}`} label="Previous proof" d="M15 6l-6 6 6 6" />
            <span className="queue-count">
              <strong>{place + 1}</strong> of {queue.length}
            </span>
            <QueueArrow to={next && `/review/${next.proof._id}`} label="Next proof" d="M9 6l6 6-6 6" />
          </div>
        )}
      </div>

      <div className="co-frame wide-frame">
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

        <div className="frame-columns">
          <div className="frame-left">
            {/* The farm's own photo from registration: compare before and after.
                No photo of its own: show the proof alone, never a library photo as a fake "before" */}
            {farm.photoUrl ? (
              <BeforeAfter before={farm.photoUrl} after={proof.photoUrl} status={proof.status} />
            ) : (
              <div className="co-frame-photo" style={{ backgroundImage: `url(${proof.photoUrl})` }}>
                <span className={`co-badge co-status co-status-${proof.status}`}>{badgeText[proof.status]}</span>
                <span className="compare-tag compare-after">Proof</span>
              </div>
            )}

            {/* The farm's steps, lit up to where it is now */}
            <div className="summary-box soft-glass">
              <ol className="steps">
                {steps.map((s) => (
                  <li key={s.n} className={s.n <= stepOf[farm.status] ? "done" : ""}>
                    {s.label}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="frame-right">
            {/* What the officer sent */}
            <div className="summary-box soft-glass">
              <span className="small">Proof of installation</span>
              {/* "2026-11-20T00:00:00.000Z": the first 10 characters are the date */}
              <div><span>Installed on</span><span>{proof.installedOn.slice(0, 10)}</span></div>
              <div><span>Installer</span><span>{farm.installer}</span></div>
              {proof.note && <div><span>Officer's note</span><span>{proof.note}</span></div>}
            </div>

            {/* What confirming releases */}
            <div className="summary-box soft-glass">
              <span className="small">Your funding</span>
              <div><span>Drip kit</span><span>{egp(funding.kitCost)}</span></div>
              <div><span>Farmer's reward</span><span>{egp(funding.reward)} · {funding.rewardStatus}</span></div>
            </div>

            {error && <p className="error">{error}</p>}

            {waiting ? (
              <>
                {/* A note: optional to confirm, needed to reject */}
                <div className="field-group soft-glass">
                  <label className="note-field">
                    <span>Your note</span>
                    <textarea rows="3" value={note} placeholder="Needed to reject, e.g. the drip lines don't reach the last beds" onChange={(e) => setNote(e.target.value)} />
                  </label>
                </div>
                <button className="main-button" type="button" disabled={busy} onClick={() => decide("confirmed")}>
                  Confirm and release {egp(funding.reward)}
                </button>
                <button className="delete-button" type="button" disabled={busy} onClick={() => decide("rejected")}>
                  Reject and send back
                </button>
                <p className="small keys-hint">
                  <kbd>←</kbd> <kbd>→</kbd> move between proofs · <kbd>Esc</kbd> back to the list
                </p>
              </>
            ) : (
              // Already reviewed: the decision, and the note if there was one
              <div className="summary-box soft-glass">
                <span className="small">Your decision</span>
                <div><span>{proof.status === "confirmed" ? "Confirmed" : "Rejected"}</span><span>{proof.status === "confirmed" ? "Reward released" : "Waiting for new proof"}</span></div>
                {proof.reviewNote && <p className={proof.status === "rejected" ? "review-note" : "small"}>"{proof.reviewNote}"</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* key: each visit is a new message, even if the words are the same */}
      <Toast key={location.key} message={location.state && location.state.toast} />
    </div>
  );
}

// One arrow of the queue: a link, or a faded arrow at the ends of the queue
function QueueArrow({ to, label, d }) {
  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
  if (!to) return <span className="queue-arrow off" aria-hidden="true">{icon}</span>;
  return (
    <Link className="queue-arrow" to={to} aria-label={label}>
      {icon}
    </Link>
  );
}

// Before/after: the farm's photo underneath, the proof photo on top, cut at the slider.
// Not in the labs: clip-path shows only part of the top photo; the range input
// (a slider from 0 to 100) moves the cut, and works with the keyboard too
function BeforeAfter({ before, after, status }) {
  // Starts a bit past the middle, so the person in the middle of a proof photo shows whole
  const [cut, setCut] = useState(62);
  return (
    <div className="co-frame-photo compare">
      <div className="compare-layer" style={{ backgroundImage: `url(${before})` }}></div>
      {/* inset(0 X% 0 0): hides the right X% of the proof photo */}
      <div className="compare-layer" style={{ backgroundImage: `url(${after})`, clipPath: `inset(0 ${100 - cut}% 0 0)` }}></div>
      {/* The white line and its round handle, at the cut */}
      <div className="compare-line" style={{ left: `${cut}%` }}>
        <span className="compare-handle" aria-hidden="true">‹ ›</span>
      </div>
      <span className={`co-badge co-status co-status-${status}`}>{badgeText[status]}</span>
      <span className="compare-tag compare-after">Proof</span>
      <span className="compare-tag compare-before">Before</span>
      <input
        className="compare-range"
        type="range"
        min="0"
        max="100"
        value={cut}
        aria-label="Compare the farm before and the proof photo"
        onChange={(e) => setCut(Number(e.target.value))}
      />
    </div>
  );
}

export default ReviewProofPage;
