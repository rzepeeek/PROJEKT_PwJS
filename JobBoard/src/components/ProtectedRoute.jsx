// zabezpieczenie zeby nie mozna bylo przejsc na inny link niz /login lub /register jesli nie jest sie zalogowanym

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // sprawdzenie przy zaladowaniu komponentu, czy uzytkownik jest zalogowany
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
    setLoading(false);
  }

  // napis ladowanie podczas przechodzenia miedzy stronami
  if (loading) {
    return <h2>Ładowanie...</h2>;
  }

  // przekierowanie na strone logowania jesli ktos nie jest zalogowany
  if (!user) {
    return <Navigate to="/login" />;
  }

  // wyswietlenie docelowej strony po poprawnym zalogowaniu
  return children;
}