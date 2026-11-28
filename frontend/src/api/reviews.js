// Ayn: every reviews request the front end sends to our API (use case 5)
// Copies Lab 9's api/listings.js, like api/proofs.js
const API = "http://localhost:3000/api/reviews";

// "Bearer <token>": who is asking. Saved in the browser at login
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// The API's own message, e.g. "This proof has already been reviewed"
async function errorFrom(res) {
  const data = await res.json();
  return new Error(data.error);
}

// The proofs of every farm the company funded
export async function getMyReviews() {
  const res = await fetch(API, { headers: authHeader() });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

// decision: "confirmed" or "rejected". Gives back { proof, funding }
export async function reviewProof(id, decision, reviewNote) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ decision, reviewNote }),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}
