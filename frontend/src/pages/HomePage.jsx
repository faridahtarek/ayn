// Ayn: the home page after logging in. The use cases add to it
import Header from "../components/Header.jsx";

function HomePage({ user, onLogOut }) {
  const isOfficer = user.role === "officer";

  return (
    <div className="screen home-screen">
      <Header user={user} onLogOut={onLogOut} />

      <div className="welcome glass">
        <span className="small">{isOfficer ? "Cooperative officer" : "Company"}</span>
        <h1>Welcome, {user.name}</h1>
        <p>
          {isOfficer
            ? "Register your cooperative's farms and upload proof of their drip kits."
            : "Fund drip kits for small farms and confirm their installation."}
        </p>
      </div>
    </div>
  );
}

export default HomePage;
