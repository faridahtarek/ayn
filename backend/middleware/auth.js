// Ayn: only logged-in users get through (Lab 9)
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  // The header: "Authorization: Bearer eyJhbGci..."
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  try {
    // Throws if the token was changed, or has expired
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // valid: on to the controller, with req.user set
  } catch {
    res.status(401).json({ error: "Log in first" });
  }
}
