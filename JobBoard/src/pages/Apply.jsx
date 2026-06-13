// formularz aplikowania na oferte pracy

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Apply() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");

  // pobranie danych uzytkownika, profilu i oferty po zaladowaniu
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // przekierowanie do logowania jesli uzytkownik nie jest zalogowany
    if (!user) {
      navigate("/login");
      return;
    }

    setEmail(user.email);

    // pobieranie profilu uzytkownika i sprawdzenie jego roli
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData || profileData.role !== "candidate") {
      navigate("/jobs");
      return;
    }

    // pobieranie szczegolow wybranej oferty pracy
    const { data: jobData } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single();

    // sprawdzenie czy uzytkownik wczesniej aplikowal na te oferte
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", id)
      .eq("candidate_id", user.id);

    if (existingApplication && existingApplication.length > 0) {
      setAlreadyApplied(true);
    }

    setProfile(profileData);
    setJob(jobData);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // zabezpieczenie przed wielokrotnym wyslaniem aplikacji
    if (alreadyApplied) {
      alert("Już aplikowałeś na tę ofertę.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // zapisanie aplikacji w bazie danych
    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: id,
        candidate_id: user.id,
        applicant_name: profile.full_name,
        applicant_email: user.email,
        cover_letter: coverLetter,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Aplikacja wysłana");

    // powrot do szczegolow oferty po wyslaniu aplikacji
    navigate(`/jobs/${id}`);
  }

  // wyswietlenie komunikatu podczas ladowania danych
  if (!job || !profile) {
    return <h2>Ładowanie...</h2>;
  }

  // informacja o wczesniej wyslanej aplikacji
  if (alreadyApplied) {
    return (
      // formularz aplikacyjny wraz z danymi kandydata
      <div style={{ padding: "20px" }}>
        <h1>{job.position}</h1>

        <p>Na tę ofertę została już wysłana aplikacja.</p>

        <button onClick={() => navigate(`/jobs/${id}`)}>
          Powrót do oferty
        </button>
      </div>
    );
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
      <h1 style={{ marginBottom: "10px" }}>
        Aplikacja
      </h1>

      <h2 style={{ marginBottom: "5px" }}>
        {job.position}
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "25px",
        }}
      >
        {job.company}
      </p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>Imię:</strong> {profile.full_name}
          </p>

          <p>
            <strong>Email:</strong> {email}
          </p>
        </div>

        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          List motywacyjny
        </label>

        <textarea
          className="input"
          rows="10"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Opisz swoje doświadczenie, umiejętności oraz powody aplikowania na to stanowisko..."
          required
        />

        <br />
        <br />

        <button
          type="submit"
          className="btn"
        >
          Wyślij aplikację
        </button>
      </form>
    </div>
  </div>
);
}