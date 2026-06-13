// szczegolowe informacje o wybranej ofercie pracy

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [userApplication, setUserApplication] = useState(null);

  // pobieranie danych oferty, uzytkownika oraz aplikacji po otwarciu strony
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // pobieranie profilu zalogowanego uzytkownika
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // sprawdzenie czy kandydat aplikowal juz na te oferte
      if (profileData?.role === "candidate") {
        const { data: applicationData } = await supabase
          .from("applications")
          .select("*")
          .eq("job_id", id)
          .eq("candidate_id", user.id)
          .maybeSingle();

        setUserApplication(applicationData);
      }
    }

    // pobieranie szczegolow wybranej oferty pracy
    const { data: jobData, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setJob(jobData);

    // pobieranie wszystkich aplikacji dla wlasciciela oferty
    if (
      user &&
      jobData.recruiter_id === user.id
    ) {
      const { data: applicationsData } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", id);

      setApplications(applicationsData || []);
    }
  }

  async function updateStatus(applicationId, newStatus) {
    // aktualizacja statusu aplikacji przez rekrutera
    const { error } = await supabase
      .from("applications")
      .update({
        status: newStatus,
      })
      .eq("id", applicationId);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  // zmiana statusow aplikacji na czytelne nazwy
  function getStatusText(status) {
    switch (status) {
      case "pending":
        return "Oczekuje";
      case "reviewed":
        return "Przejrzana";
      case "accepted":
        return "Zaakceptowana";
      case "rejected":
        return "Odrzucona";
      default:
        return status;
    }
  }

  // wyswietlenie komunikatu podczas ladowania oferty
  if (!job) {
    return <h2>Ładowanie...</h2>;
  }

  return (
    <div className="container">
      <div className="card">
        {/* wyswietlenie podstawowych informacji o ofercie pracy */}
        <h1>{job.position}</h1>

        <p>
          <strong>Firma:</strong> {job.company}
        </p>

        <p>
          <strong>Lokalizacja:</strong> {job.location}
        </p>

        <p>
          <strong>Pensja:</strong>{" "}
          {job.salary_min} zł - {job.salary_max} zł
        </p>

        <br />

        <h3>Opis stanowiska</h3>

      {/* prezentacja opisu stanowiska */}
      <div
        style={{
          marginTop: "15px",
          lineHeight: "1.8",
        }}
>
      {job.description
        ?.split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, index) => (
        <p
        key={index}
        style={{
          marginBottom: "12px",
        }}
      >
        {line}
      </p>
    ))}
</div>

        <p>{job.description}</p>

        <br />

        {/* sekcja aplikowania dla kandydatow */}
        {profile?.role === "candidate" && (
          <>
            {userApplication ? (
              <div className="card">
                <strong>
                  Status Twojej aplikacji:
                </strong>{" "}
                <span
                  className={`status ${userApplication.status}`}
                >
                  {getStatusText(
                    userApplication.status
                  )}
                </span>
              </div>
            ) : (
              <Link to={`/jobs/${job.id}/apply`}>
                <button className="btn">
                  Aplikuj
                </button>
              </Link>
            )}
          </>
        )}

        {/* mozliwosc edycji oferty dla jej wlasciciela */}
        {profile?.role === "recruiter" &&
          job.recruiter_id === profile.id && (
            <Link to={`/jobs/${job.id}/edit`}>
              <button className="btn">
                Edytuj ofertę
              </button>
            </Link>
          )}
      </div>

      {/* panel zarzadzania aplikacjami dostepny dla rekrutera */}
      {profile?.role === "recruiter" &&
        job.recruiter_id === profile.id && (
          <>
            <h2
              style={{
                marginTop: "20px",
                marginBottom: "15px",
              }}
            >
              Aplikacje
            </h2>

            {/* lista kandydatow wraz z mozliwoscia zmiany statusu aplikacji */}
            {applications.length === 0 ? (
              <div className="card">
                Brak aplikacji.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="card"
                >
                  <p>
                    <strong>Imię:</strong>{" "}
                    {app.applicant_name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {app.applicant_email}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`status ${app.status}`}
                    >
                      {getStatusText(
                        app.status
                      )}
                    </span>
                  </p>

                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(
                      app.applied_at
                    ).toLocaleDateString()}
                  </p>

                  <details>
                    <summary>
                      Dodana wiadomość 
                    </summary>

                    <p
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      {app.cover_letter}
                    </p>
                  </details>

                  <br />

                  <button
                    className="btn"
                    onClick={() =>
                      updateStatus(
                        app.id,
                        "reviewed"
                      )
                    }
                  >
                    Przejrzana
                  </button>

                  <button
                    className="btn"
                    style={{
                      marginLeft: "10px",
                    }}
                    onClick={() =>
                      updateStatus(
                        app.id,
                        "accepted"
                      )
                    }
                  >
                    Zaakceptuj
                  </button>

                  <button
                    className="btn btn-danger"
                    style={{
                      marginLeft: "10px",
                    }}
                    onClick={() =>
                      updateStatus(
                        app.id,
                        "rejected"
                      )
                    }
                  >
                    Odrzuć
                  </button>
                </div>
              ))
            )}
          </>
        )}
    </div>
  );
}