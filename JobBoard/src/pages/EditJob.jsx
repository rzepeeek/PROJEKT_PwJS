// edycja dodanych wczesniej ofert

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadJob();
  }, []);

  async function loadJob() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "recruiter") {
      navigate("/jobs");
      return;
    }

    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      navigate("/jobs");
      return;
    }

    if (data.recruiter_id !== user.id) {
      navigate("/jobs");
      return;
    }

    setCompany(data.company);
    setPosition(data.position);
    setLocation(data.location);
    setSalaryMin(data.salary_min);
    setSalaryMax(data.salary_max);
    setDescription(data.description);

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("job_postings")
      .update({
        company,
        position,
        location,
        salary_min: salaryMin,
        salary_max: salaryMax,
        description,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Oferta zaktualizowana");
    navigate(`/jobs/${id}`);
  }

  async function deactivateJob() {
    const { error } = await supabase
      .from("job_postings")
      .update({
        is_active: false,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Oferta dezaktywowana");
    navigate("/jobs");
  }

  if (loading) {
    return <h2>Ładowanie...</h2>;
  }

  return (
    <div className="container">
      <div
        className="card"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "25px" }}>
          Edycja oferty
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
            Zapisz zmiany
          </button>
        </form>

        <br />

        <button
          className="btn btn-danger"
          onClick={deactivateJob}
        >
          Dezaktywuj ofertę
        </button>
      </div>
    </div>
  );
}