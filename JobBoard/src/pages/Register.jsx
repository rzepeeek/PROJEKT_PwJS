// rejestracja nowego uzytkownika wraz z wyborem kandydat/rekruter

import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Konto utworzone!");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Rejestracja</h1>

        <form onSubmit={handleRegister}>
          <label>Imię i nazwisko</label>

          <input
            type="text"
            placeholder="Jan Kowalski"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Hasło</label>

          <input
            type="password"
            placeholder="Minimum 6 znaków"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Rola</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="candidate">
              Kandydat
            </option>

            <option value="recruiter">
              Rekruter
            </option>
          </select>

          <button
            type="submit"
            className="btn"
          >
            Załóż konto
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Masz już konto?{" "}
          <Link to="/login">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}