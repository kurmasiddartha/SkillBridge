import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const statusClass = (status) => `status-badge ${status.toLowerCase()}`;

const MentorSessionRequests = () => {
  const [sessions, setSessions] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      const { data } = await api.get("/sessions/mentor");
      setSessions(data.sessions);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load mentor requests");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const updateSession = async (id, action, body = {}) => {
    setMessage("");
    setError("");

    try {
      await api.put(`/sessions/${id}/${action}`, body);
      setMessage(`Session ${action}ed successfully.`);
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || `Could not ${action} session`);
    }
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Mentor Session Requests</h1>
          <p>Accept, reject, or complete sessions requested by learners.</p>
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
                  <p>Learner: {session.learnerId?.name} | Mode: {session.mode}</p>
                  {session.message && <p className="session-note">{session.message}</p>}
                </div>
                <span className={statusClass(session.status)}>{session.status}</span>
              </div>
              {session.status === "PENDING" && (
                <div className="session-actions">
                  <input
                    placeholder="Optional meeting link"
                    value={meetingLinks[session._id] || ""}
                    onChange={(e) => setMeetingLinks({ ...meetingLinks, [session._id]: e.target.value })}
                  />
                  <button className="button" onClick={() => updateSession(session._id, "accept", { meetingLink: meetingLinks[session._id] })}>Accept</button>
                  <button className="button danger" onClick={() => updateSession(session._id, "reject")}>Reject</button>
                </div>
              )}
              {session.status === "ACCEPTED" && (
                <div className="session-actions">
                  {session.meetingLink && <a href={session.meetingLink} target="_blank" rel="noreferrer">Meeting Link</a>}
                  <button className="button" onClick={() => updateSession(session._id, "complete")}>Mark Completed</button>
                </div>
              )}
            </article>
          ))}
        </div>
        {sessions.length === 0 && <div className="empty-state">No mentor requests yet.</div>}
      </section>
    </main>
  );
};

export default MentorSessionRequests;
