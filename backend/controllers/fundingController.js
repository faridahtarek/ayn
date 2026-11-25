// Ayn: the fundings controllers (use case 3). Copies Lab 9's listingController.js,
// like farmController.js. Read the request, call the model, send the response
import {
  getFundingsByCompany,
  getFundingById,
  addFunding,
  updateFunding,
  removeFunding,
} from "../models/Funding.js";
import { getFarmById, updateFarm } from "../models/Farm.js";

// Is the reward a real amount? Number("abc") is NaN, which is not > 0 either
function badReward(reward) {
  return !(Number(reward) > 0);
}

// Checks shared by "change the reward" and "withdraw":
// sends the error and gives back null, or gives back the funding
async function findOwnFunding(req, res) {
  const funding = await getFundingById(req.params.id);
  if (!funding) {
    res.status(404).json({ error: "Funding not found" });
    return null;
  }
  // Logged in is not enough: it must be YOUR funding
  if (String(funding.company) !== req.user.id) {
    res.status(403).json({ error: "This is not your funding" });
    return null;
  }
  // Once the officer uploads proof, the deal is locked (use case 4)
  if (funding.farm.status !== "funded") {
    res.status(409).json({ error: "Proof of installation has been uploaded, so this funding can no longer change" });
    return null;
  }
  return funding;
}

// GET /api/fundings/mine: the logged-in company's fundings, each with its farm
export async function handleGetMine(req, res) {
  res.json(await getFundingsByCompany(req.user.id));
}

// POST /api/fundings: a company funds a farm's kit and sets the farmer's reward
export async function handleCreate(req, res) {
  // Only companies fund farms, never officers
  if (req.user.role !== "company") {
    return res.status(403).json({ error: "Only companies can fund farms" });
  }
  const { farm: farmId, reward } = req.body || {}; // no body sent? use an empty object
  if (!farmId) {
    return res.status(400).json({ error: "farm is required" });
  }
  if (badReward(reward)) {
    return res.status(400).json({ error: "reward must be more than 0" });
  }
  const farm = await getFarmById(farmId);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  // Another company got there first
  if (farm.status !== "open") {
    return res.status(409).json({ error: "This farm has already been funded" });
  }
  const funding = await addFunding({
    // The company is whoever is logged in, never what the client says
    company: req.user.id,
    farm: farm._id,
    // The kit cost comes from the farm, so no one can send a lower price
    kitCost: farm.kitCost,
    reward: Number(reward),
  });
  // The farm stops waiting: officers see it as funded, other companies no longer see it
  await updateFarm(farm._id, { status: "funded" });
  // The farm inside the funding was read before the update: show the new status
  funding.farm.status = "funded";
  res.status(201).json(funding);
}

// PUT /api/fundings/:id: the company changes the farmer's reward
export async function handleUpdate(req, res) {
  const { reward } = req.body || {};
  if (badReward(reward)) {
    return res.status(400).json({ error: "reward must be more than 0" });
  }
  const funding = await findOwnFunding(req, res);
  if (!funding) return; // findOwnFunding already sent the error
  // Only the reward can change: the kit cost stays the one confirmed
  res.json(await updateFunding(req.params.id, { reward: Number(reward) }));
}

// DELETE /api/fundings/:id: the company withdraws before proof is uploaded
export async function handleDelete(req, res) {
  const funding = await findOwnFunding(req, res);
  if (!funding) return;
  await removeFunding(req.params.id);
  // The farm goes back to waiting, so another company can fund it
  await updateFarm(funding.farm._id, { status: "open" });
  res.status(204).end(); // done, nothing to send back
}
