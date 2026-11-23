// Ayn: the users, officers and companies (Lab 9)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Never the password itself: a bcrypt hash of it
  password: { type: String, required: true },
  // Chosen on the registration form
  role: { type: String, enum: ["officer", "company"], default: "officer" },
  // The cooperative or the company's name
  organisation: { type: String },
});

const User = mongoose.model("User", userSchema);

export async function addUser(data) {
  return User.create(data);
}

export async function getUserByEmail(email) {
  return User.findOne({ email: email });
}
