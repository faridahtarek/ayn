// Ayn: the farms model (use case 2). Copies Lab 9's Listing.js
// The only code that touches the farms data
import mongoose from "mongoose";

// The shape of one farm, exactly as in our README
const farmSchema = new mongoose.Schema({
  // The _id of the officer who registered it
  officer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  village: { type: String, required: true },
  governorate: { type: String, required: true },
  feddans: { type: Number, required: true },
  crop: { type: String, required: true },
  // The local company that supplies and installs the kit
  installer: { type: String, required: true },
  // The installer's quote, in Egyptian pounds
  kitCost: { type: Number, required: true },
  // A link to a photo of the farm, no file upload (optional)
  photoUrl: { type: String },
  // enum: only these 4 values are allowed; default: a new farm starts "open"
  status: {
    type: String,
    enum: ["open", "funded", "installed", "confirmed"],
    default: "open",
  },
});

// The model: our handle on the "farms" collection
const Farm = mongoose.model("Farm", farmSchema);

// Only the farms this officer registered
// The lab's find() has no filter (all listings); find({ officer: id }) keeps
// only the documents whose officer field equals this id
export async function getFarmsByOfficer(officerId) {
  return Farm.find({ officer: officerId });
}

export async function getFarmById(id) {
  // "abc" can never be an _id: not found
  if (!mongoose.isValidObjectId(id)) return null;
  return Farm.findById(id);
}

export async function addFarm(data) {
  // The schema keeps only the fields it knows
  return Farm.create(data);
}

export async function updateFarm(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;
  // new: true sends back the farm after the update
  return Farm.findByIdAndUpdate(id, data, {
    new: true,
  });
}

export async function removeFarm(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Farm.findByIdAndDelete(id);
}
