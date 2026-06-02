import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [salarySort, setSalarySort] = useState("newest");

  useEffect(() => {
    loadJobs();
  }, [locationFilter, salarySort]);

  async function loadJobs() {
    let query = supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true);

    if (locationFilter !== "") {
      query = query.eq("location", locationFilter);
    }

    if (salarySort === "salary_desc") {
      query = query.order("salary_max", {
        ascending: false,
      });
    } else if (salarySort === "salary_asc") {
      query = query.order("salary_max", {
        ascending: true,
      });
    } else {
      query = query.order("posted_at", {
        ascending: false,
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    setJobs(data);
  }

  const locations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>
        Oferty pracy
      </h1>

      <div className="card">
        <label>Lokalizacja: </label>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Wszystkie</option>

          {locations.map((location) => (
            <option
              key={location}
              value={location}
            >
              {location}
            </option>
          ))}
        </select>

        <span style={{ marginLeft: "20px" }}>
          Sortowanie:
        </span>

        <select
          value={salarySort}
          onChange={(e) => setSalarySort(e.target.value)}
        >
          <option value="newest">
            Najnowsze
          </option>

          <option value="salary_desc">
            Najwyższa pensja
          </option>

          <option value="salary_asc">
            Najniższa pensja
          </option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <p>Brak ofert pracy</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="card"
          >
            <h2>
              <Link to={`/jobs/${job.id}`}>
                {job.position}
              </Link>
            </h2>

            <p>
              <strong>Firma:</strong>{" "}
              {job.company}
            </p>

            <p>
              <strong>Lokalizacja:</strong>{" "}
              {job.location}
            </p>

            <p>
              <strong>Pensja:</strong>{" "}
              {job.salary_min} zł -{" "}
              {job.salary_max} zł
            </p>
          </div>
        ))
      )}
    </div>
  );
}