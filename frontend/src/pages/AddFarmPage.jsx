// Ayn: register a farm, in 2 steps (use case 2)
// Copies Lab 8's AddListingPage.jsx: a form saved by the API
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { governorates, crops } from "../farmOptions.js";

function AddFarmPage({ onAdd }) {
  // Which step of the form is showing
  // Not in the lab: a 2-step form. {step === 1 && (...)} below shows step 1 only
  // while step is 1; "Next" sets it to 2. All the state stays, so nothing is lost
  const [step, setStep] = useState(1);

  // Step 1: the farmer and their land. One piece of state per input
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [village, setVillage] = useState("");
  const [governorate, setGovernorate] = useState(governorates[0]);
  const [feddans, setFeddans] = useState("");
  const [crop, setCrop] = useState(crops[0]);
  // Optional: a link to a photo of the farm
  const [photoUrl, setPhotoUrl] = useState("");

  // Step 2: the drip kit quote
  const [installer, setInstaller] = useState("");
  const [kitCost, setKitCost] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleNext(event) {
    // Stop the browser from reloading the page
    event.preventDefault();
    setStep(2);
  }

  async function handleSave(event) {
    event.preventDefault();
    try {
      // No _id, officer or status: the API sets them
      await onAdd({
        farmerName,
        farmerPhone,
        village,
        governorate,
        feddans: Number(feddans),
        crop,
        installer,
        kitCost: Number(kitCost),
        photoUrl,
      });
      navigate("/farms"); // back to My farms
    } catch (err) {
      setError(err.message); // the API's message
    }
  }

  return (
    <div className="screen form-screen photo-screen">
      {/* Back arrow: on step 1 it leaves the form, on step 2 it goes back to step 1.
          The <svg> draws the arrow: path d holds the drawing commands, and
          stroke="currentColor" uses the text's colour. aria-label names it for screen readers */}
      <div className="form-top">
        {step === 1 ? (
          <Link to="/farms" className="icon-button glass" aria-label="Back to my farms">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </Link>
        ) : (
          <button type="button" className="icon-button glass" aria-label="Back to step 1" onClick={() => setStep(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
        )}
        <span className="step glass">Step {step} of 2</span>
      </div>

      {step === 1 && (
        <form className="register-form" onSubmit={handleNext}>
          <div className="form-title">
            <h1>Register a farm</h1>
            <span>The farmer and their land</span>
          </div>

          <div className="field-group soft-glass">
            <label>
              <span>Farmer</span>
              <input value={farmerName} required placeholder="Youssef Ragab" onChange={(e) => setFarmerName(e.target.value)} />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" value={farmerPhone} required placeholder="01x xxxx xxxx" onChange={(e) => setFarmerPhone(e.target.value)} />
            </label>
            <label>
              <span>Village</span>
              <input value={village} required placeholder="Biyala" onChange={(e) => setVillage(e.target.value)} />
            </label>
            {/* <select>: a dropdown; one <option> per governorate (from farmOptions.js).
                It works like an input: value + onChange */}
            <label>
              <span>Governorate</span>
              <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
                {governorates.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            {/* min and step: the browser refuses less than 0.1 and allows one decimal */}
            <label>
              <span>Land size</span>
              <input type="number" min="0.1" step="0.1" value={feddans} required placeholder="Feddans, e.g. 1.8" onChange={(e) => setFeddans(e.target.value)} />
            </label>
            {/* type="url": the browser checks it is a web address. No required: optional */}
            <label>
              <span>Photo link</span>
              <input type="url" value={photoUrl} placeholder="Optional: https://..." onChange={(e) => setPhotoUrl(e.target.value)} />
            </label>
          </div>

          {/* Shows the photo as soon as a link is pasted */}
          {photoUrl && <img className="farm-photo" src={photoUrl} alt="The farm" />}

          {/* The crop: one button per crop instead of a dropdown; the chosen one gets "on".
              type="button" so clicking it doesn't submit the form */}
          <div className="crop-picker">
            <span>Main crop</span>
            <div className="switch soft-glass" role="group" aria-label="Main crop">
              {crops.map((c) => (
                <button key={c} type="button" className={crop === c ? "on" : ""} onClick={() => setCrop(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button className="main-button" type="submit">Next: drip kit quote →</button>
        </form>
      )}

      {step === 2 && (
        <form className="register-form" onSubmit={handleSave}>
          <div className="form-title">
            <h1>Drip kit quote</h1>
            <span>From a local installer</span>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="field-group soft-glass">
            <label>
              <span>Installer</span>
              <input value={installer} required placeholder="Delta Drip Systems" onChange={(e) => setInstaller(e.target.value)} />
            </label>
            <label>
              <span>Kit cost (EGP)</span>
              <input type="number" min="1" step="1" value={kitCost} required placeholder="29000" onChange={(e) => setKitCost(e.target.value)} />
            </label>
          </div>

          <div className="summary-box soft-glass">
            <span className="small">Summary</span>
            {photoUrl && <img className="farm-photo" src={photoUrl} alt="The farm" />}
            <div><span>Farmer</span><span>{farmerName} · {farmerPhone}</span></div>
            <div><span>Land</span><span>{feddans} feddans · {crop}</span></div>
            <div><span>Place</span><span>{village}, {governorate}</span></div>
          </div>

          <button className="main-button" type="submit">Save farm</button>
        </form>
      )}
    </div>
  );
}

export default AddFarmPage;
