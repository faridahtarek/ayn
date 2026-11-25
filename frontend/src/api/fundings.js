// Ayn: every fundings request the front end sends to our API (use case 3)
// Copies Lab 9's api/listings.js, like api/farms.js
const API = "http://localhost:3000/api/fundings";

// "Bearer <token>": who is asking. Saved in the browser at login
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// The API's own message, e.g. "This farm has already been funded"
// (same as in api/farms.js. Used as: throw await errorFrom(res))
async function errorFrom(res) {
  const data = await res.json();
  return new Error(data.error);
}

// The company's fundings, each with its whole farm inside (funding.farm.farmerName...)
export async function getMyFundings() {
  const res = await fetch(`${API}/mine`, { headers: authHeader() });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

// Only the farm's _id and the reward: the API copies the kit cost from the farm
export async function createFunding(farmId, reward) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ farm: farmId, reward }),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json(); // the saved funding, with its farm now "funded"
}

export async function updateFunding(id, reward) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ reward }),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json(); // the funding with the new reward
}

// Withdraw: the API deletes the funding and puts the farm back to "open"
export async function removeFunding(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw await errorFrom(res);
}
