// Ayn: the proofs model (use case 4). Copies Lab 9's Listing.js, like Farm.js
// The only code that touches the proofs data
import mongoose from "mongoose";

// The shape of one proof, exactly as in our README
const proofSchema = new mongoose.Schema({
  // unique: one proof per farm, MongoDB refuses a second one for the same farm
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, unique: true },
  // The _id of the officer who uploaded it
  officer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // A link to the photo of the installed kit, no file upload
  photoUrl: { type: String, required: true },
  // Not in the labs (they use String and Number): Date, as in our README
  installedOn: { type: Date, required: true },
  note: { type: String },
  // pending until the company reviews it (use case 5)
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
  // Written by the company when it confirms or rejects (use case 5)
  reviewNote: { type: String },
});

const Proof = mongoose.model("Proof", proofSchema);

// Only the proofs this officer uploaded
// find({ officer: id }) keeps only the documents whose officer field equals this id
export async function getProofsByOfficer(officerId) {
  return Proof.find({ officer: officerId });
}

// The proof of one farm, or null if it has none yet
// findOne: the first document that matches, instead of a list
export async function getProofByFarm(farmId) {
  return Proof.findOne({ farm: farmId });
}

export async function getProofById(id) {
  // "abc" can never be an _id: not found
  if (!mongoose.isValidObjectId(id)) return null;
  return Proof.findById(id);
}

export async function addProof(data) {
  return Proof.create(data);
}

export async function updateProof(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;
  // new: true sends back the proof after the update
  return Proof.findByIdAndUpdate(id, data, { new: true });
}

export async function removeProof(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Proof.findByIdAndDelete(id);
}
