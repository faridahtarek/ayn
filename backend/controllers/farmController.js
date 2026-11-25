// Ayn: the farms controllers (use case 2). Copies Lab 9's listingController.js
// Read the request, call the model, send the response
import {
  getFarmsByOfficer,
  getOpenFarms,
  getFarmById,
  addFarm,
  updateFarm,
  removeFarm,
} from "../models/Farm.js";

// Every field the officer fills in on the form
const fields = ["farmerName", "farmerPhone", "village", "governorate", "feddans", "crop", "installer", "kitCost"];

// Is any field missing from the request?
// fields.find gives the first name whose value is empty (or undefined if none is);
// data[f] reads the property whose name is in f, e.g. data["village"]
function missingField(data) {
  return fields.find((f) => !data[f]);
}

// Only these fields, so no one can send a different officer or status
function pickFields(data) {
  return {
    farmerName: data.farmerName,
    farmerPhone: data.farmerPhone,
    village: data.village,
    governorate: data.governorate,
    feddans: data.feddans,
    crop: data.crop,
    installer: data.installer,
    kitCost: data.kitCost,
    // Optional: a link to a photo of the farm
    photoUrl: data.photoUrl,
  };
}

// GET /api/farms/mine: the logged-in officer's farms
export async function handleGetMine(req, res) {
  res.json(await getFarmsByOfficer(req.user.id));
}

// GET /api/farms/open: the farms waiting for a company (use case 3)
export async function handleGetOpen(req, res) {
  // Only companies browse farms to fund
  if (req.user.role !== "company") {
    return res.status(403).json({ error: "Only companies can browse farms to fund" });
  }
  res.json(await getOpenFarms());
}

// GET /api/farms/:id: one farm
export async function handleGetOne(req, res) {
  const farm = await getFarmById(req.params.id);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  res.json(farm);
}

// POST /api/farms: an officer registers a farm
export async function handleCreate(req, res) {
  // Only officers register farms, never companies
  if (req.user.role !== "officer") {
    return res.status(403).json({ error: "Only cooperative officers can register farms" });
  }
  const data = req.body || {}; // no body sent? use an empty object
  const missing = missingField(data);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }
  const farm = await addFarm({
    ...pickFields(data),
    // The officer is whoever is logged in, never what the client says
    officer: req.user.id,
    // A new farm always waits for a company
    status: "open",
  });
  res.status(201).json(farm);
}

// PUT /api/farms/:id: the officer edits their farm
export async function handleUpdate(req, res) {
  const data = req.body || {};
  const missing = missingField(data);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }
  const farm = await getFarmById(req.params.id);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  // Logged in is not enough: it must be YOUR farm
  if (String(farm.officer) !== req.user.id) {
    return res.status(403).json({ error: "This is not your farm" });
  }
  // Once a company funds it, the farm can't change
  if (farm.status !== "open") {
    return res.status(409).json({ error: "This farm is funded, so it can no longer be edited" });
  }
  res.json(await updateFarm(req.params.id, pickFields(data)));
}

// DELETE /api/farms/:id: the officer deletes their farm
export async function handleDelete(req, res) {
  const farm = await getFarmById(req.params.id);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  // Logged in is not enough: it must be YOUR farm
  if (String(farm.officer) !== req.user.id) {
    return res.status(403).json({ error: "This is not your farm" });
  }
  // Once a company funds it, the farm can't be removed
  if (farm.status !== "open") {
    return res.status(409).json({ error: "This farm is funded, so it can no longer be deleted" });
  }
  await removeFarm(req.params.id);
  res.status(204).end(); // done, nothing to send back
}
