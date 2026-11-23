// Ayn: register and log in, through our API (Lab 9)
const API = "http://localhost:3000/api/auth";

async function send(path, body) {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  // The API's own message, e.g. "Wrong email or password"
  if (!res.ok) throw new Error(data.error);
  return data; // { token, user }
}

export function register(name, email, password, role, organisation) {
  return send("register", { name, email, password, role, organisation });
}

export function login(email, password) {
  return send("login", { email, password });
}
