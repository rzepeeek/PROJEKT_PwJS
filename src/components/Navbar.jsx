import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ukryj navbar na login i register
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="navbar">
      <h2>💼 Job Board</h2>

      <div className="nav-links">
        <Link to="/jobs">Oferty</Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

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