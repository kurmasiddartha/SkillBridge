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
      <section className="content" style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <div className="page-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Find Mentors</h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Discover and connect with verified mentors based on your learning preferences.</p>
        </div>
        
        <form 
          className="panel filters" 
          onSubmit={(event) => { event.preventDefault(); fetchMentors(); }}
          style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end', 
            background: 'white', padding: '1.5rem', borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' 
          }}
        >
          <div className="field" style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>What do you want to learn?</label>
            <input 
              placeholder="e.g., React, System Design..." 
              value={filters.skill} 
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })} 
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>
          
          <div className="field" style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>Learning Mode</label>
            <select 
              value={filters.mode} 
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
            >
              <option value="">Any Mode</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Both</option>
            </select>
          </div>
          
          <div className="field" style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>Mentor Experience</label>
            <select 
              value={filters.experienceLevel} 
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
            >
              <option value="">Any Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          
          <div className="field" style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>Min. Rating</label>
            <input 
              placeholder="0-5" 
              min="0" max="5" 
              type="number" 
              value={filters.minRating} 
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} 
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>
          
          <button 
            className="button" 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem 2rem', backgroundColor: '#3b82f6', color: 'white', 
              fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer',
              flex: '1 1 100px', transition: 'background-color 0.2s'
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
        
        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {mentors.map((mentor) => <MentorCard mentor={mentor} key={mentor._id} />)}
        </div>
        
        {!loading && mentors.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Mentors Found</h3>
            <p>Try adjusting your filters to find the right mentor for you.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default FindMentors;
