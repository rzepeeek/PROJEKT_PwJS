// dodawanie nowych ofert pracy przez rekrutera

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function NewJob() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");

  // sprawdzenie uprawnien uzytkownika po otwarciu strony
  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // weryfikacja czy uzytkownik jest zalogowany
    if (!user) {
      navigate("/login");
      return;
    }

    // sprawdzenie czy uzytkownik posiada role rekrutera
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data || data.role !== "recruiter") {
      navigate("/jobs");
      return;
    }

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // dodanie nowej oferty pracy do bazy danych
    const { error } = await supabase
      .from("job_postings")
      .insert({
        recruiter_id: user.id,
        company,
        position,
        location,
        salary_min: salaryMin,
        salary_max: salaryMax,
        description,
      });

    if (error) {
      alert(error.message);
      return;
    }

    // przekierowanie do listy ofert po zalogowaniu
    alert("Oferta dodana");
    navigate("/jobs");
  }

  // wyswietlenie komunikatu podczas sprawdzania uprawnien
  if (loading) {
    return <h2>Ładowanie...</h2>;
  }

  return (
    <div className="container">
      {/* formularz dodawania nowej oferty pracy */}
      <div
        className="card"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "25px" }}>
          Nowa oferta pracy
        </h1>

        <form onSubmit={handleSubmit}>
          <label>Firma</label>
          <input
            className="input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <br />
          <br />

          <label>Stanowisko</label>
          <input
            className="input"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />

          <br />
          <br />

          <label>Lokalizacja</label>
          <input
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <br />
          <br />

          <label>Minimalna pensja</label>
          <input
            className="input"
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            required
          />

          <br />
          <br />

          <label>Maksymalna pensja</label>
          <input
            className="input"
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            required
          />

          <br />
          <br />

          <label>Opis stanowiska</label>

          <textarea
            className="input"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <br />
          <br />

          <button
            type="submit"
            className="btn"
          >
            Dodaj ofertę
          </button>
        </form>
      </div>
    </div>
  );
}