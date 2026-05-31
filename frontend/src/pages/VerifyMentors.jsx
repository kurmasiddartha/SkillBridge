import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const VerifyMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMentors = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/mentors");
      setMentors(data.mentors || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch mentor profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const updateMentor = async (id, action) => {
    setMessage("");
    setError("");

    try {
      await api.put(`/admin/mentors/${id}/${action}`);
      setMessage(action === "verify" ? "Mentor verified successfully." : "Mentor rejected successfully.");
      loadMentors();
    } catch (err) {
      setError(err.response?.data?.message || `Could not ${action} mentor`);
    }
  };

  const pendingMentors = mentors.filter((mentor) => !mentor.isVerified);

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Verify Mentors</h1>
          <p>Review pending mentor profiles and approve or reject them.</p>
        </div>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}
        {loading ? (
          <div className="empty-state">Loading mentor profiles...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Level</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingMentors.map((mentor) => (
                  <tr key={mentor._id}>
                    <td>{mentor.userId?.name}</td>
                    <td>{mentor.userId?.email}</td>
                    <td>{mentor.skills?.join(", ")}</td>
                    <td>{mentor.experienceLevel}</td>
                    <td>{mentor.mode}</td>
                    <td><span className="status-badge pending">PENDING</span></td>
                    <td className="actions">
                      <button className="button" onClick={() => updateMentor(mentor._id, "verify")}>Verify</button>
                      <button className="button danger" onClick={() => updateMentor(mentor._id, "reject")}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingMentors.length === 0 && <div className="empty-state">No pending mentor profiles.</div>}
          </div>
        )}
      </section>
    </main>
  );
};

export default VerifyMentors;
