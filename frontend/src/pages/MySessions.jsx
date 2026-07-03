import { useEffect, useState } from "react";
import api from "../api/axios";
import AddReviewModal from "../components/AddReviewModal";
import Sidebar from "../components/Sidebar";
import "./MySessions.css";

const statusClass = (status) => `status-badge ${status.toLowerCase()}`;

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [reviewSession, setReviewSession] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      const { data } = await api.get("/sessions/my");
      setSessions(data.sessions);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load sessions");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const cancelSession = async (id) => {
    setMessage("");
    setError("");

    try {
      await api.put(`/sessions/${id}/cancel`);
      setMessage("Session cancelled successfully.");
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel session");
    }
  };

  const canCancel = (status) => status === "PENDING" || status === "ACCEPTED";

  return (
    <main className="layout my-sessions-page">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>My Sessions</h1>
          <p>Track your learning sessions, cancel active requests, and review completed sessions.</p>
        </div>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}
        <div className="session-list">
          {sessions.map((session) => (
            <article className="session-card" key={session._id}>
              <div className="session-main">
                <div>
                  <h3>{session.skill}</h3>
                  <p>{new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}</p>
                  <p>Mentor: {session.mentorId?.name} | Mode: {session.mode}</p>
                  {session.meetingLink && <a href={session.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a>}
                </div>
                <span className={statusClass(session.status)}>{session.status}</span>
              </div>
              <div className="session-actions">
                {canCancel(session.status) && (
                  <button className="button secondary" onClick={() => cancelSession(session._id)}>Cancel Session</button>
                )}
                {session.status === "COMPLETED" && !session.isReviewed && (
                  <button className="button" onClick={() => setReviewSession(session)}>Add Review</button>
                )}
              </div>
            </article>
          ))}
        </div>
        {sessions.length === 0 && <div className="empty-state">You have not booked any sessions yet.</div>}
        {reviewSession && (
          <AddReviewModal
            session={reviewSession}
            onClose={() => setReviewSession(null)}
            onSuccess={(successMessage) => {
              setMessage(successMessage);
              setError("");
              loadSessions();
            }}
            onError={(errorMessage) => {
              setError(errorMessage);
              setMessage("");
            }}
          />
        )}
      </section>
    </main>
  );
};

export default MySessions;
