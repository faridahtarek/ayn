// Ayn: the proofs controllers (use case 4). Copies Lab 9's listingController.js
// Read the request, call the model, send the response
import {
  getProofsByOfficer,
  getProofByFarm,
  getProofById,
  addProof,
  updateProof,
  removeProof,
} from "../models/Proof.js";
import { getFarmById, updateFarm } from "../models/Farm.js";

// GET /api/proofs/mine: the logged-in officer's proofs
export async function handleGetMine(req, res) {
  res.json(await getProofsByOfficer(req.user.id));
}

// POST /api/proofs: the officer adds proof of the installation to a funded farm
export async function handleCreate(req, res) {
  // Only officers upload proof, never companies
  if (req.user.role !== "officer") {
    return res.status(403).json({ error: "Only cooperative officers can upload proof" });
  }
  const data = req.body || {}; // no body sent? use an empty object
  if (!data.farm || !data.photoUrl || !data.installedOn) {
    return res.status(400).json({ error: "farm, photoUrl and installedOn are required" });
  }
  const farm = await getFarmById(data.farm);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  // Logged in is not enough: it must be YOUR farm
  if (String(farm.officer) !== req.user.id) {
    return res.status(403).json({ error: "This is not your farm" });
  }
  // One proof per farm: a rejected one is edited, not added again
  const existing = await getProofByFarm(farm._id);
  if (existing) {
    return res.status(409).json({ error: "This farm already has proof, so edit it instead" });
  }
  // No company has paid for the kit yet: nothing to prove
  if (farm.status !== "funded") {
    return res.status(409).json({ error: "Only a funded farm can get proof" });
  }
  const proof = await addProof({
    farm: farm._id,
    // The officer is whoever is logged in, never what the client says
    officer: req.user.id,
    photoUrl: data.photoUrl,
    installedOn: data.installedOn,
    note: data.note,
    // status: the schema makes it "pending"
  });
  // The farm now waits for the company's review
  await updateFarm(farm._id, { status: "installed" });
  res.status(201).json(proof);
}

// PUT /api/proofs/:id: the officer edits the proof, e.g. after the company rejects it
export async function handleUpdate(req, res) {
  const data = req.body || {};
  if (!data.photoUrl || !data.installedOn) {
    return res.status(400).json({ error: "photoUrl and installedOn are required" });
  }
  const proof = await getProofById(req.params.id);
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  // Logged in is not enough: it must be YOUR proof
  if (String(proof.officer) !== req.user.id) {
    return res.status(403).json({ error: "This is not your proof" });
  }
  // Confirmed means the reward was released: the proof is final
  if (proof.status === "confirmed") {
    return res.status(409).json({ error: "The company confirmed this proof, so it can no longer be edited" });
  }
  // The company withdrew in the meantime: the farm is no longer funded
  const farm = await getFarmById(proof.farm);
  if (farm.status === "open") {
    return res.status(409).json({ error: "The company withdrew its funding, so this farm can't get proof" });
  }
  const changes = {
    photoUrl: data.photoUrl,
    installedOn: data.installedOn,
    note: data.note,
    // New proof to review: back to pending, whatever the company said before
    status: "pending",
  };
  const saved = await updateProof(req.params.id, changes);
  // After a rejection the farm went back to "funded": it waits for a review again
  await updateFarm(proof.farm, { status: "installed" });
  res.json(saved);
}

// DELETE /api/proofs/:id: the officer deletes the proof before the company reviews it
export async function handleDelete(req, res) {
  const proof = await getProofById(req.params.id);
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  // Logged in is not enough: it must be YOUR proof
  if (String(proof.officer) !== req.user.id) {
    return res.status(403).json({ error: "This is not your proof" });
  }
  // Only while it waits for the company: a reviewed proof stays
  if (proof.status !== "pending") {
    return res.status(409).json({ error: "The company already reviewed this proof, so it can no longer be deleted" });
  }
  await removeProof(req.params.id);
  // The farm is funded but has no proof again
  await updateFarm(proof.farm, { status: "funded" });
  res.status(204).end(); // done, nothing to send back
}
