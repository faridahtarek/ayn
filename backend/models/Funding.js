// Ayn: the fundings model (use case 3). Copies Lab 9's Listing.js, like Farm.js
// The only code that touches the fundings data
import mongoose from "mongoose";

// The shape of one funding, exactly as in our README
const fundingSchema = new mongoose.Schema({
  // The _id of the company that pays for the kit
  company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // unique: one company per farm, MongoDB refuses a second funding for the same farm
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, unique: true },
  // The kit cost the company confirmed, copied from the farm when it funds it
  kitCost: { type: Number, required: true },
  // Paid to the farmer once the company confirms the installation (use case 5)
  reward: { type: Number, required: true },
  rewardStatus: { type: String, enum: ["held", "released"], default: "held" },
  // Payment is simulated in this course: every funding counts as paid
  paid: { type: Boolean, default: true },
});

const Funding = mongoose.model("Funding", fundingSchema);

// Not in the lab: populate("farm") swaps the farm's _id for the whole farm,
// so the front end gets the farmer, village, feddans and status in one answer
export async function getFundingsByCompany(companyId) {
  return Funding.find({ company: companyId }).populate("farm");
}

// Use case 5: the funding of one farm, or null (one company per farm)
// findOne: the first document that matches, instead of a list
export async function getFundingByFarm(farmId) {
  return Funding.findOne({ farm: farmId }).populate("farm");
}

export async function getFundingById(id) {
  // "abc" can never be an _id: not found
  if (!mongoose.isValidObjectId(id)) return null;
  return Funding.findById(id).populate("farm");
}

export async function addFunding(data) {
  const funding = await Funding.create(data);
  // Send it back with its farm filled in, like the two above
  return funding.populate("farm");
}

export async function updateFunding(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;
  // new: true sends back the funding after the update
  return Funding.findByIdAndUpdate(id, data, { new: true }).populate("farm");
}

export async function removeFunding(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Funding.findByIdAndDelete(id);
}
