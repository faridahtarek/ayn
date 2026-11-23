// Ayn: the app, its routes and who is logged in (Lab 9)
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  // Who is logged in. Kept in the browser, so a reload keeps it
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

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

  return (
    <main>
      <Routes>
        <Route path="/" element={user ? <HomePage user={user} onLogOut={logOut} /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogIn={logIn} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogIn={logIn} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default App;
