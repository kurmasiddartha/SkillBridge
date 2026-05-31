import { useState } from "react";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const availableSlots = form.day && form.startTime && form.endTime
        ? [{ day: form.day, startTime: form.startTime, endTime: form.endTime }]
        : [];

      await api.post("/mentors/profile", {
        bio: form.bio,
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        experienceLevel: form.experienceLevel,
        mode: form.mode,
        location: form.location,
        availableSlots
      });

      await fetchCurrentUser();
      setMessage("Mentor profile created successfully. Your profile is pending admin verification.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create mentor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Create Mentor Profile</h1>
          <p>Describe what you can teach and when students can reach you.</p>
        </div>
        <form className="panel mentor-form" onSubmit={handleSubmit}>
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
          <button className="button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Mentor Profile"}</button>
        </form>
      </section>
    </main>
  );
};

export default CreateMentorProfile;
