// panel uzytkownika dostosowany do roli

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProfile(data);

    if (data.role === "candidate") {
      const { data: applicationsData } = await supabase
        .from("applications")
        .select(`
          *,
          job_postings (
            company,
            position
          )
        `)
        .eq("candidate_id", user.id);

      setApplications(applicationsData || []);
    }

    if (data.role === "recruiter") {
      const { data: jobsData } = await supabase
        .from("job_postings")
        .select("*")
        .eq("recruiter_id", user.id);

      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from("applications")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq("job_id", job.id);

          return {
            ...job,
            applicationsCount: count || 0,
          };
        })
      );

      setJobs(jobsWithCounts);
    }
  }

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

function getRoleText(role) {
  switch (role) {
    case "candidate":
      return "Kandydat";
    case "recruiter":
      return "Rekruter";
    default:
      return role;
  }
}
  
  if (!profile) {
    return <h2 style={{ textAlign: "center" }}>Ładowanie...</h2>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Dashboard</h1>

        <h2>Witaj {profile.full_name}</h2>

        <p>
          <strong>Rola:</strong> {getRoleText(profile.role)}
        </p>
      </div>

      {profile.role === "candidate" && (
        <>
          <div className="card">
            <h3>Panel kandydata</h3>

            <br />

            <Link to="/jobs">
              <button className="btn">
                Przeglądaj oferty pracy
              </button>
            </Link>
          </div>

          <h2 style={{ marginBottom: "15px" }}>
            Moje aplikacje
          </h2>

          {applications.length === 0 ? (
            <div className="card">
              Nie wysłano jeszcze żadnej aplikacji.
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="card"
              >
                <h3>
                  {app.job_postings?.position}
                </h3>

                <p>
                  Firma:{" "}
                  {app.job_postings?.company}
                </p>

                <p>
                  Status:{" "}
                  <span
                    className={`status ${app.status}`}
                  >
                    {getStatusText(app.status)}
                  </span>
                </p>

                <p>
                  Data aplikacji:{" "}
                  {new Date(
                    app.applied_at
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </>
      )}

      {profile.role === "recruiter" && (
        <>
          <div className="card">
            <h3>Panel rekrutera</h3>

            <br />

            <Link to="/jobs/new">
              <button className="btn">
                Dodaj ofertę pracy
              </button>
            </Link>

            <br />
            <br />

            <Link to="/jobs">
              <button className="btn">
                Wszystkie oferty
              </button>
            </Link>
          </div>

          <h2 style={{ marginBottom: "15px" }}>
            Moje oferty
          </h2>

          {jobs.length === 0 ? (
            <div className="card">
              Nie masz jeszcze żadnych ofert.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="card"
              >
                <h3>{job.position}</h3>

                <p>
                  Firma: {job.company}
                </p>

                <p>
                  Lokalizacja: {job.location}
                </p>

                <p>
                  Liczba aplikacji:{" "}
                  <strong>
                    {job.applicationsCount}
                  </strong>
                </p>

                <br />

                <Link to={`/jobs/${job.id}`}>
                  <button className="btn">
                    Szczegóły oferty
                  </button>
                </Link>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}