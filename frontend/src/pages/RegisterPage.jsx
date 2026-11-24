// Ayn: create an account (Lab 9), as an officer or a company
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../api/auth.js";

function RegisterPage({ onLogIn }) {
  const [role, setRole] = useState("officer");
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Show the password as text, or hide it as dots
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Registering logs you in too: the API sends a token
      const session = await register(name, email, password, role, organisation);
      onLogIn(session);
      navigate("/");
    } catch (err) {
      setError(err.message); // the API's message
    }
  }

  const isOfficer = role === "officer";

  return (
    <div className="screen register-screen">
      <div className="register-photo" aria-hidden="true"></div>

      <Link to="/login" className="icon-button glass back-button" aria-label="Back to sign in">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </Link>

      <div className="register-title">
        <h1>Create your account</h1>
        <span>Takes about a minute</span>
      </div>

      <div className="switch soft-glass" role="group" aria-label="Account type">
        <button type="button" className={isOfficer ? "on" : ""} onClick={() => setRole("officer")}>Cooperative officer</button>
        <button type="button" className={isOfficer ? "" : "on"} onClick={() => setRole("company")}>Company</button>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <div className="field-group soft-glass">
          <label>
            <span>Name</span>
            {/* The example text changes with the switch: ? : picks the officer's or the company's */}
            <input value={name} required placeholder={isOfficer ? "Mahmoud Salah" : "Rana Adel"} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <span>{isOfficer ? "Cooperative" : "Company"}</span>
            <input value={organisation} required placeholder={isOfficer ? "Kafr El-Sheikh Agri. Coop." : "Nakheel Foods"} onChange={(e) => setOrganisation(e.target.value)} />
          </label>
        </div>

        <div className="field-group soft-glass">
          <label>
            <span>Email</span>
            <input type="email" value={email} required placeholder="you@example.eg" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <span>Password</span>
            {/* type "text" shows the password, "password" hides it; minLength: at least 8 characters */}
            <input type={showPassword ? "text" : "password"} value={password} required placeholder="8+ characters" minLength={8} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="eye-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.6 16.6 0 0 0 2.5 12S6 19 12 19a9.6 9.6 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </label>
        </div>

        <label className="agree">
          <input type="checkbox" required />
          I agree to Ayn's terms and privacy policy
        </label>

        <button className="main-button" type="submit">Create account</button>
        <p className="small">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;
