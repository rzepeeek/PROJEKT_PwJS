// wyswietlanie gornego paska nawigacyjnego, przechodzenie miedzy roznymi widokami aplikacji oraz wylogowywanie

import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ukrywanie paska nawigacyjnego na stronach logowania i rejestracji
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  // wylogowanie uzytkownika i przekierowanie na strone logowania
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="navbar">
      <h2>💼 Job Board</h2>

      {/* linki nawigacyjne dostepne po zalogowaniu */}
      <div className="nav-links">
        <Link to="/jobs">Oferty</Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

      {/* przycisk wylogowania */}
        <button
          className="btn"
          onClick={handleLogout}
        >
          Wyloguj
        </button>
      </div>
    </div>
  );
}