// Ayn: the first page a visitor sees, before signing in.
// A long overview, like an Apple product page: one idea per section
import { Link } from "react-router";
import Logo from "../components/Logo.jsx";

// How Ayn works: one row each, with a photo
const steps = [
  {
    number: "01",
    title: "A cooperative registers the farm.",
    text: "The officer adds the farmer, their land and crop, and a local installer's quote for a drip kit. The farmer never needs an app.",
    photo: "/images/green-fields.jpg",
  },
  {
    number: "02",
    title: "A company funds the kit.",
    text: "Companies browse farms waiting for funding, pay for a kit and set a reward for the farmer.",
    photo: "/images/nile-village.jpg",
  },
  {
    number: "03",
    title: "Proof first. Then the reward.",
    text: "Once the kit is in the ground, the officer uploads proof. When the company confirms it, the farmer's reward is released.",
    photo: "/images/farmer.jpg",
  },
];

function LandingPage() {
  return (
    <div className="landing">
      {/* Thin top bar, like the signed-in pages */}
      <header className="landing-bar">
        <Logo />
        {/* <a href="#how"> jumps down to the part of this page with id="how" (not a new page,
            so a plain <a>, not Link) */}
        <nav className="landing-links">
          <a href="#how">How it works</a>
          <a href="#who">Who it's for</a>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="landing-pill">Create account</Link>
        </nav>
      </header>

      {/* 1. The headline */}
      <section className="landing-hero">
        <span className="landing-eyebrow">Ayn · drip irrigation for Egypt</span>
        <h1>
          Drip kits for small farms.
          <span> Funded by companies.</span>
        </h1>
        <p>
          Cooperatives register the farms, companies pay for the kits, and farmers stop flooding their fields.
        </p>
        <div className="landing-actions">
          <Link to="/register" className="landing-button">Get started</Link>
          <a href="#how" className="landing-link">See how it works ›</a>
        </div>
      </section>
      {/* Photo bands: the photo stays still while the page slides over it.
          style={{ backgroundImage }}: sets the photo from JSX (each band has its own).
          role="img" + aria-label: screen readers read it as a picture with this description */}
      <div className="landing-band tall" style={{ backgroundImage: "url(/images/farmer.jpg)" }} role="img" aria-label="A farmer working in a field in Egypt"></div>

      {/* 2. The problem */}
      <section className="landing-statement">
        <span className="landing-eyebrow">The problem</span>
        <h2>
          Many small farms still flood their fields.
          <span> Switching costs money, and brings the farmer nothing back.</span>
        </h2>
      </section>

      <div className="landing-band" style={{ backgroundImage: "url(/images/nile-palms.jpg)" }} role="img" aria-label="Fields and palm trees beside the Nile"></div>

      {/* 3. How it works */}
      <section className="landing-steps" id="how">
        <span className="landing-eyebrow">How it works</span>
        <h2>Three steps, one farm at a time.</h2>
        {steps.map((s) => (
          <div key={s.number} className="landing-step">
            <div className="landing-step-text">
              <span className="landing-step-number">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
            {/* The step's photo, from the steps list above (a template string builds url(...)) */}
            <div className="landing-step-photo" style={{ backgroundImage: `url(${s.photo})` }}></div>
          </div>
        ))}
      </section>

      <div className="landing-band" style={{ backgroundImage: "url(/images/fields-aerial.jpg)" }} role="img" aria-label="Farm plots along the Nile from above"></div>

      {/* 4. Who it's for */}
      <section className="landing-who" id="who">
        <span className="landing-eyebrow">Who it's for</span>
        <h2>Two sides. One goal.</h2>
        <div className="landing-who-grid">
          <div className="landing-who-card">
            <h3>Cooperative officers</h3>
            <p>Register your farmers' land, get their drip kits funded, and upload proof once they're installed.</p>
            <Link to="/register" className="landing-link">Join as an officer ›</Link>
          </div>
          <div className="landing-who-card">
            <h3>Companies</h3>
            <p>Fund kits for real farms, reward the farmers, and see every farm you switched to drip in one place.</p>
            <Link to="/register" className="landing-link">Join as a company ›</Link>
          </div>
        </div>
      </section>

      {/* 5. The last call to action */}
      <section className="landing-final">
        <h2>Start with one farm.</h2>
        <Link to="/register" className="landing-button">Create an account</Link>
      </section>

      <footer className="landing-footer">
        <img className="logo-mark" src="/logo-mark.svg" alt="" />
        <span>A BINF 503 course project · German International University · 2026</span>
      </footer>
    </div>
  );
}

export default LandingPage;
