import { useEffect, useState } from "react";
import api from "../api/axios";
import MentorCard from "../components/MentorCard";
import Sidebar from "../components/Sidebar";

const FindMentors = () => {
  const [filters, setFilters] = useState({ skill: "", mode: "", experienceLevel: "", minRating: "" });
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMentors = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/mentors/search", { params: filters });
      setMentors(data.mentors);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Find Mentors</h1>
          <p>Search verified mentors by skill, learning mode, experience, and rating.</p>
        </div>
        <form className="panel filters mentor-search" onSubmit={(event) => { event.preventDefault(); fetchMentors(); }}>
          <div className="field">
            <label>Skill</label>
            <input placeholder="React, DP, DBMS" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
          </div>
          <div className="field">
            <label>Mode</label>
            <select value={filters.mode} onChange={(e) => setFilters({ ...filters, mode: e.target.value })}>
              <option value="">Any mode</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Both</option>
            </select>
          </div>
          <div className="field">
            <label>Experience</label>
            <select value={filters.experienceLevel} onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}>
              <option value="">Any level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="field">
            <label>Minimum Rating</label>
            <input placeholder="4" min="0" max="5" type="number" value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} />
          </div>
          <button className="button" type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
        </form>
        {error && <p className="alert error">{error}</p>}
        <div className="card-grid">
          {mentors.map((mentor) => <MentorCard mentor={mentor} key={mentor._id} />)}
        </div>
        {!loading && mentors.length === 0 && <div className="empty-state">No verified mentors found for these filters.</div>}
      </section>
    </main>
  );
};

export default FindMentors;
