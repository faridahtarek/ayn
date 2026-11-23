// Ayn: sign in (Lab 9)
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/auth.js";
import Logo from "../components/Logo.jsx";

function LoginPage({ onLogIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const session = await login(email, password);
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
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@cooperative.eg" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="••••••••" value={password} required onChange={(e) => setPassword(e.target.value)} />
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
