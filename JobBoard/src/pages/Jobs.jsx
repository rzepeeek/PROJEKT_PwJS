// wyswietlanie listy aktualnych ofert pracy

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [salarySort, setSalarySort] = useState("newest");

  // ponowne pobranie ofert po zmianie filtrow lub sortowania
  useEffect(() => {
    loadJobs();
  }, [locationFilter, salarySort]);

  async function loadJobs() {
    // pobranie aktywnych ofert pracy z bazy danych
    let query = supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true);

    // filtrowanie ofert wedlug wybranej lokalizacji
    if (locationFilter !== "") {
      query = query.eq("location", locationFilter);
    }

    // sortowanie ofert wedlug wynagrodzenia lub daty dodania
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

  // utworzenie listy dostepnych lokalizacji do filtrowania
  const locations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>
        Oferty pracy
      </h1>

      {/* panel filtrowania i sortowania ofert */}
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

      {/* wyswietlenie listy ofert pracy lub komunikatu o ich braku */}
      {jobs.length === 0 ? (
        <p>Brak ofert pracy</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="card"
          >
            {/* podstawowe informacje o ofercie wraz z linkiem do szczegolow */}
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