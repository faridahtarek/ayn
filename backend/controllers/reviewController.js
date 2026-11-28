// Ayn: the reviews controllers (use case 5). Copies Lab 9's listingController.js,
// like proofController.js. The company confirms or rejects an officer's proof
import { getProofsByFarms, getProofById, updateProof } from "../models/Proof.js";
import { getFundingsByCompany, getFundingByFarm, updateFunding } from "../models/Funding.js";
import { updateFarm } from "../models/Farm.js";

// GET /api/reviews: the proofs of every farm the logged-in company funded
export async function handleGetMine(req, res) {
  // Only companies review proof, never officers
  if (req.user.role !== "company") {
    return res.status(403).json({ error: "Only companies can review proof" });
  }
  const fundings = await getFundingsByCompany(req.user.id);
  // map: the list of the farms' _ids, e.g. ["abc", "def"]
  // (f.farm is the whole farm, filled in by populate; a deleted farm is null, so skip it)
  const farmIds = fundings.filter((f) => f.farm).map((f) => f.farm._id);
  res.json(await getProofsByFarms(farmIds));
}

// PUT /api/reviews/:id: the company confirms or rejects one proof, with a note
export async function handleReview(req, res) {
  if (req.user.role !== "company") {
    return res.status(403).json({ error: "Only companies can review proof" });
  }
  const { decision, reviewNote } = req.body || {}; // no body sent? use an empty object
  if (decision !== "confirmed" && decision !== "rejected") {
    return res.status(400).json({ error: "decision must be confirmed or rejected" });
  }
  // A rejection needs a reason, so the officer knows what to fix.
  // trim() removes spaces, so "   " counts as empty
  if (decision === "rejected" && !(reviewNote || "").trim()) {
    return res.status(400).json({ error: "Write a note so the officer knows what to fix" });
  }
  const proof = await getProofById(req.params.id);
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  // Logged in is not enough: it must be a farm YOU funded
  const funding = await getFundingByFarm(proof.farm);
  if (!funding || String(funding.company) !== req.user.id) {
    return res.status(403).json({ error: "You did not fund this farm" });
  }
  // Only a proof waiting for review: a decision is final
  if (proof.status !== "pending") {
    return res.status(409).json({ error: "This proof has already been reviewed" });
  }

  const saved = await updateProof(proof._id, { status: decision, reviewNote: reviewNote });
  let savedFunding = funding;
  if (decision === "confirmed") {
    // The kit is in: the farm is done, and the farmer's reward is released
    await updateFarm(proof.farm, { status: "confirmed" });
    savedFunding = await updateFunding(funding._id, { rewardStatus: "released" });
  } else {
    // Back to the officer: the farm waits for new proof (use case 4)
    await updateFarm(proof.farm, { status: "funded" });
    savedFunding = await getFundingByFarm(proof.farm);
  }
  // Both, so the page can update the proof and the farm's status at once
  res.json({ proof: saved, funding: savedFunding });
}
