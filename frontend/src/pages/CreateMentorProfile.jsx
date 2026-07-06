import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const CreateMentorProfile = () => {
  const { fetchCurrentUser } = useAuth();
  const [form, setForm] = useState({
    bio: "",
    skills: "",
    experienceLevel: "Beginner",
    mode: "Online",
    location: "",
    day: "",
    startTime: "",
    endTime: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/mentors/my-profile");
        if (data.mentorProfile) {
          const profile = data.mentorProfile;
          setForm({
            bio: profile.bio || "",
            skills: profile.skills ? profile.skills.join(", ") : "",
            experienceLevel: profile.experienceLevel || "Beginner",
            mode: profile.mode || "Online",
            location: profile.location || "",
            day: profile.availableSlots?.[0]?.day || "",
            startTime: profile.availableSlots?.[0]?.startTime || "",
            endTime: profile.availableSlots?.[0]?.endTime || ""
          });
          setIsEdit(true);
          setIsVerified(profile.isVerified);
        }
      } catch (err) {
        // If 404, it means no profile exists yet, which is expected for new mentors
        setIsEdit(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const availableSlots = form.day && form.startTime && form.endTime
        ? [{ day: form.day, startTime: form.startTime, endTime: form.endTime }]
        : [];

      const payload = {
        bio: form.bio,
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        experienceLevel: form.experienceLevel,
        mode: form.mode,
        location: form.location,
        availableSlots
      };

      if (isEdit) {
        await api.put("/mentors/profile", payload);
        setMessage("Mentor profile updated successfully.");
      } else {
        await api.post("/mentors/profile", payload);
        await fetchCurrentUser();
        setIsEdit(true);
        setMessage("Mentor profile created successfully. Your profile is pending admin verification.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not save mentor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>{isEdit ? "Edit Mentor Profile" : "Create Mentor Profile"}</h1>
          <p>{isEdit ? "Update your tutoring details and slot availability." : "Describe what you can teach and when students can reach you."}</p>
        </div>
        <form className="panel mentor-form" onSubmit={handleSubmit}>
          {isEdit && (
            <p className={`alert ${isVerified ? "success" : "warning"}`} style={{ marginBottom: "1rem" }}>
              {isVerified
                ? "✓ Your profile is verified and active on the platform."
                : "⏳ Your profile is currently pending admin verification."}
            </p>
          )}
          {message && <p className="alert success">{message}</p>}
          {error && <p className="alert error">{error}</p>}
          <div className="field">
            <label>Bio</label>
            <textarea placeholder="Tell learners about your strengths, teaching style, and achievements." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
          </div>
          <div className="field">
            <label>Skills</label>
            <input placeholder="React, DSA, Java" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} required />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="field">
              <label>Mode</label>
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                <option>Online</option>
                <option>Offline</option>
                <option>Both</option>
              </select>
            </div>
            <div className="field">
              <label>Location</label>
              <input placeholder="Campus library, online, hostel block" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <h2>Available Slot</h2>
          <div className="form-grid">
            <div className="field">
              <label>Day</label>
              <input placeholder="Monday" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
            </div>
            <div className="field">
              <label>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="field">
              <label>End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Submitting..." : (isEdit ? "Update Mentor Profile" : "Create Mentor Profile")}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateMentorProfile;
