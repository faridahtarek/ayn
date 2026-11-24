// Ayn: every farms request the front end sends to our API (use case 2)
// Copies Lab 9's api/listings.js
const API = "http://localhost:3000/api/farms";

// "Bearer <token>": who is asking. Saved in the browser at login
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// The API's own message, e.g. "This farm is funded..."
// (the lab throws "POST failed: 409"; this reads the API's error text instead,
// like the lab's api/auth.js does. Used as: throw await errorFrom(res))
async function errorFrom(res) {
  const data = await res.json();
  return new Error(data.error);
}

export async function getMyFarms() {
  const res = await fetch(`${API}/mine`, { headers: authHeader() });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function createFarm(farm) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(farm),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json(); // the saved farm, with its _id and status "open"
}

export async function updateFarm(id, farm) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(farm),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json(); // the farm after the edit
}

export async function removeFarm(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw await errorFrom(res);
}
