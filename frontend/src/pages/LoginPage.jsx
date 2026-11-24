// Ayn: sign in (Lab 9)
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/auth.js";
import Logo from "../components/Logo.jsx";

function LoginPage({ onLogIn }) {
  // Officer or company: the same switch as on Create account
  // (sent with the login; the API checks it matches the account)
  const [role, setRole] = useState("officer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Show the password as text, or hide it as dots
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const session = await login(email, password, role);
      onLogIn(session); // App remembers who logged in
      navigate("/");
    } catch (err) {
      setError(err.message); // the API's message
    }
  }

  return (
    <div className="screen login-screen">
      <div className="login-top">
        <Logo />
      </div>

      <h1 className="login-title">Drip kits for small farms, funded by companies.</h1>

      <form className="form login-form" onSubmit={handleSubmit}>
        <div className="switch soft-glass" role="group" aria-label="Sign in as">
          <button type="button" className={role === "officer" ? "on" : ""} onClick={() => setRole("officer")}>Cooperative officer</button>
          <button type="button" className={role === "company" ? "on" : ""} onClick={() => setRole("company")}>Company</button>
        </div>
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@cooperative.eg" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        {/* Not in the lab: show/hide password. type "text" shows it, "password" shows dots.
            !showPassword flips true to false and back. The eye icon is an <svg> drawing */}
        <div className="password-box">
          <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="eye-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.6 16.6 0 0 0 2.5 12S6 19 12 19a9.6 9.6 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
          </button>
        </div>
        <button className="main-button" type="submit">
          Sign in
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className="small">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;
