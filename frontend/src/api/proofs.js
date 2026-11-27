// Ayn: every proofs request the front end sends to our API (use case 4)
// Copies Lab 9's api/listings.js, like api/farms.js
const API = "http://localhost:3000/api/proofs";

// "Bearer <token>": who is asking. Saved in the browser at login
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// The API's own message, e.g. "Only a funded farm can get proof"
async function errorFrom(res) {
  const data = await res.json();
  return new Error(data.error);
}

export async function getMyProofs() {
  const res = await fetch(`${API}/mine`, { headers: authHeader() });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

// proof: { farm, photoUrl, installedOn, note }
export async function createProof(proof) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(proof),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function updateProof(id, proof) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(proof),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function removeProof(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw await errorFrom(res);
}
