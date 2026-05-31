import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/student");
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard");
      }
    };

    loadDashboard();
  }, []);

  const chartData = [
    { name: "Booked", value: dashboard?.totalBookedSessions || 0 },
    { name: "Pending", value: dashboard?.pendingSessions || 0 },
    { name: "Completed", value: dashboard?.completedSessions || 0 }
  ];

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Student Dashboard</h1>
          <p>Track your learning activity, skill points, upcoming sessions, and AI plans.</p>
        </div>
        {error && <p className="alert error">{error}</p>}

        <div className="stats dashboard-stats">
          <div className="stat"><span>Skill Points</span><strong>{dashboard?.skillPoints || 0}</strong></div>
          <div className="stat"><span>Total Booked</span><strong>{dashboard?.totalBookedSessions || 0}</strong></div>
          <div className="stat"><span>Pending</span><strong>{dashboard?.pendingSessions || 0}</strong></div>
          <div className="stat"><span>Completed</span><strong>{dashboard?.completedSessions || 0}</strong></div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <h2>Session Summary</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="panel">
            <h2>Skills Wanted</h2>
            <div className="tag-row">
              {dashboard?.skillsWanted?.length ? (
                dashboard.skillsWanted.map((skill) => <span className="tag" key={skill}>{skill}</span>)
              ) : (
                <p>No skills wanted added yet.</p>
              )}
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="section-heading">
            <h2>Upcoming Sessions</h2>
            <span>{dashboard?.upcomingSessions?.length || 0} scheduled</span>
          </div>
          <div className="mini-list">
            {dashboard?.upcomingSessions?.length ? dashboard.upcomingSessions.map((session) => (
              <article className="mini-list-item" key={session._id}>
                <div>
                  <strong>{session.skill}</strong>
                  <p>{session.mentorId?.name} | {new Date(session.date).toLocaleDateString()} | {session.startTime}</p>
                </div>
                <span className="status-badge accepted">{session.status}</span>
              </article>
            )) : <div className="empty-state">No upcoming sessions yet.</div>}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Recent AI Recommendations</h2>
            <span>{dashboard?.recentRecommendations?.length || 0} recent</span>
          </div>
          <div className="mini-list">
            {dashboard?.recentRecommendations?.length ? dashboard.recentRecommendations.map((item) => (
              <article className="mini-list-item" key={item._id}>
                <div>
                  <strong>{item.goalText}</strong>
                  <div className="tag-row compact">
                    {item.extractedSkills?.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                  </div>
                </div>
              </article>
            )) : <div className="empty-state">No AI recommendations yet.</div>}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
