// Ayn: register and log in, through our API (Lab 9)
const API = "http://localhost:3000/api/auth";

async function send(path, body) {
  // Not in the lab: try/catch around fetch, so a stopped back end shows a clear
  // message. res is declared with let outside the try, so the code after can use it
  let res;
  try {
    res = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch fails when nothing answers on port 3000
    throw new Error("Can't reach the server. Is the back end running (npm start)?");
  }
  const data = await res.json();
  // The API's own message, e.g. "Wrong email or password"
  if (!res.ok) throw new Error(data.error);
  return data; // { token, user }
}

export function register(name, email, password, role, organisation) {
  return send("register", { name, email, password, role, organisation });
}

export function login(email, password, role) {
  return send("login", { email, password, role });
}
