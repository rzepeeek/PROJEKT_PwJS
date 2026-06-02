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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setEmail(user.email);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // tylko kandydaci mogą aplikować
    if (!profileData || profileData.role !== "candidate") {
      navigate("/jobs");
      return;
    }

    const { data: jobData } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single();

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

    if (alreadyApplied) {
      alert("Już aplikowałeś na tę ofertę.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    navigate(`/jobs/${id}`);
  }

  if (!job || !profile) {
    return <h2>Ładowanie...</h2>;
  }

  if (alreadyApplied) {
    return (
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
    <div style={{ padding: "20px" }}>
      <h1>Aplikacja</h1>

      <h2>{job.position}</h2>

      <p>{job.company}</p>

      <form onSubmit={handleSubmit}>
        <p>
          <strong>Imię:</strong> {profile.full_name}
        </p>

        <p>
          <strong>Email:</strong> {email}
        </p>

        <label>Cover Letter</label>
        <br />

        <textarea
          rows="8"
          cols="60"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Wyślij aplikację
        </button>
      </form>
    </div>
  );
}