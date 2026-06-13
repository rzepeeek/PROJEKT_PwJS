// proces logowania uzytkownika z wykorzystaniem supabase

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // obsluga procesu logowania uzytkownika
  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // wyswietlenie bledu w przypadku nieudanego logowania
    if (error) {
      alert(error.message);
      return;
    }

    // przekierowanie uzytkownika do panelu po poprawnym zalogowaniu
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Logowanie</h1>

        {/* formularz logowania uzytkownika */}
        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Podaj email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Hasło</label>

          <input
            type="password"
            placeholder="Podaj hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn"
          >
            Zaloguj się
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {/* link do strony rejestracji dla nowych uzytkownikow */}
          Nie masz konta?{" "}
          <Link to="/register">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}