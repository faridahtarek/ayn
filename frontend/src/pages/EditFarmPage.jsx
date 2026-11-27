// Ayn: edit or delete a farm while it is open (use case 2)
// Finds the farm by its id like Lab 7's ListingPage.jsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { governorates, crops } from "../farmOptions.js";

function EditFarmPage({ farms, loading, onSave, onDelete }) {
  // For /farms/abc123/edit, id is "abc123"
  const { id } = useParams();
  const farm = farms.find((f) => f._id === id);

  // After a reload the farms are still on their way: wait, don't say "not found" yet
  if (loading) {
    return <p className="screen form-screen photo-screen empty">Loading your farm...</p>;
  }

  if (!farm) {
    return (
      <div className="screen form-screen photo-screen">
        <div className="welcome glass">
          <h1>Farm not found</h1>
          <Link to="/farms">Back to my farms</Link>
        </div>
      </div>
    );
  }

  // key: a fresh form for each farm
  // Not in the lab: useState only uses its starting value once. Giving the form
  // the farm's _id as key makes React build a new form (new state) for another farm
  return <EditFarmForm key={farm._id} farm={farm} onSave={onSave} onDelete={onDelete} />;
}

function EditFarmForm({ farm, onSave, onDelete }) {
  // Each input starts with the farm's saved value
  const [farmerName, setFarmerName] = useState(farm.farmerName);
  const [farmerPhone, setFarmerPhone] = useState(farm.farmerPhone);
  const [village, setVillage] = useState(farm.village);
  const [governorate, setGovernorate] = useState(farm.governorate);
  const [feddans, setFeddans] = useState(farm.feddans);
  const [crop, setCrop] = useState(farm.crop);
  const [installer, setInstaller] = useState(farm.installer);
  const [kitCost, setKitCost] = useState(farm.kitCost);
  // Older farms have no photo: start with an empty box
  // (a || b: a if it has a value, otherwise b)
  const [photoUrl, setPhotoUrl] = useState(farm.photoUrl || "");

  // Is the "Delete this farm?" box showing?
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSave(event) {
    event.preventDefault();
    try {
      await onSave(farm._id, {
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
      setError(err.message); // e.g. "This farm is funded..."
    }
  }

  async function handleDelete() {
    try {
      await onDelete(farm._id);
      navigate("/farms");
    } catch (err) {
      setConfirming(false);
      setError(err.message);
    }
  }

  return (
    <div className="screen form-screen photo-screen">
      <div className="form-top">
        <Link to="/farms" className="icon-button glass" aria-label="Back to my farms">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>

      <form className="register-form" onSubmit={handleSave}>
        <div className="form-title">
          <h1>Edit farm</h1>
          <span>Open · editable until a company funds it</span>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="field-group soft-glass">
          <label>
            <span>Farmer</span>
            <input value={farmerName} required onChange={(e) => setFarmerName(e.target.value)} />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" value={farmerPhone} required onChange={(e) => setFarmerPhone(e.target.value)} />
          </label>
          <label>
            <span>Village</span>
            <input value={village} required onChange={(e) => setVillage(e.target.value)} />
          </label>
          <label>
            <span>Governorate</span>
            <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
              {governorates.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Photo link</span>
            <input type="url" value={photoUrl} placeholder="Optional: https://..." onChange={(e) => setPhotoUrl(e.target.value)} />
          </label>
        </div>

        {/* Shows the photo as soon as a link is pasted */}
        {photoUrl && <img className="farm-photo" src={photoUrl} alt="The farm" />}

        <div className="field-group soft-glass">
          <label>
            <span>Feddans</span>
            <input type="number" min="0.1" step="0.1" value={feddans} required onChange={(e) => setFeddans(e.target.value)} />
          </label>
          <label>
            <span>Crop</span>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              {crops.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Installer</span>
            <input value={installer} required onChange={(e) => setInstaller(e.target.value)} />
          </label>
          <label>
            <span>Kit cost (EGP)</span>
            <input type="number" min="1" step="1" value={kitCost} required onChange={(e) => setKitCost(e.target.value)} />
          </label>
        </div>

        <button className="main-button" type="submit">Save changes</button>
        <button className="delete-button" type="button" onClick={() => setConfirming(true)}>
          Delete farm
        </button>
      </form>

      {/* Only while confirming is true. role="alertdialog": tells screen readers
          it is a question that needs an answer */}
      {confirming && (
        <div className="confirm-box glass" role="alertdialog" aria-label="Delete farm">
          <span className="confirm-title">Delete {farm.farmerName}'s farm?</span>
          <span>It will disappear from your farms and from the companies' list. This can't be undone.</span>
          <div className="confirm-buttons">
            <button type="button" className="cancel-button" onClick={() => setConfirming(false)}>Cancel</button>
            <button type="button" className="delete-button solid" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditFarmPage;
