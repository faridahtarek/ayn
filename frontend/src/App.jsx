// Ayn: the app, its routes, who is logged in and their farms (Labs 7-9)
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyFarmsPage from "./pages/MyFarmsPage.jsx";
import AddFarmPage from "./pages/AddFarmPage.jsx";
import EditFarmPage from "./pages/EditFarmPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { getMyFarms, createFarm, updateFarm, removeFarm } from "./api/farms.js";

function App() {
  // Who is logged in. Kept in the browser, so a reload keeps it
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Use case 2: the officer's farms. Empty until the API answers
  const isOfficer = user && user.role === "officer";

  const [farms, setFarms] = useState([]);
  // An officer's farms are loading from the start (like the lab's useState(true))
  const [loading, setLoading] = useState(isOfficer);
  const [error, setError] = useState("");

  // Whenever the logged-in user changes: ask the API for their farms
  // ([user] at the end: runs again after log in and log out, not only once)
  useEffect(() => {
    // Visitors and companies have no farms: empty the list and stop here
    if (!isOfficer) {
      setFarms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getMyFarms()
      .then((data) => setFarms(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  function logIn(session) {
    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));
    setUser(session.user);
  }

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  async function addFarm(farm) {
    // The API saves it, and sends it back with its _id
    const saved = await createFarm(farm);
    setFarms([...farms, saved]);
  }

  async function saveFarm(id, farm) {
    const saved = await updateFarm(id, farm);
    // Swap the old farm for the edited one:
    // map builds a new list; for the edited farm (same _id) it puts saved, else keeps f
    setFarms(farms.map((f) => (f._id === id ? saved : f)));
  }

  async function deleteFarm(id) {
    await removeFarm(id); // gone from MongoDB
    setFarms(farms.filter((f) => f._id !== id));
  }

  // The home page: visitors see the landing page, officers their dashboard,
  // companies their own home (Lojaine's use cases)
  let home = <LandingPage />;
  if (isOfficer) {
    home = <DashboardPage user={user} farms={farms} loading={loading} error={error} onLogOut={logOut} />;
  } else if (user) {
    home = <HomePage user={user} onLogOut={logOut} />;
  }

  return (
    <main>
      <Routes>
        <Route path="/" element={home} />
        <Route path="/farms" element={isOfficer ? <MyFarmsPage user={user} farms={farms} loading={loading} error={error} onLogOut={logOut} /> : <Navigate to="/" />} />
        <Route path="/farms/new" element={isOfficer ? <AddFarmPage onAdd={addFarm} /> : <Navigate to="/" />} />
        <Route path="/farms/:id/edit" element={isOfficer ? <EditFarmPage farms={farms} loading={loading} onSave={saveFarm} onDelete={deleteFarm} /> : <Navigate to="/" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogIn={logIn} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogIn={logIn} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default App;
