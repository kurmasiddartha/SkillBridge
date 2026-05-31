import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load admin dashboard");
      }
    };

    loadDashboard();
  }, []);

  const sessionData = [
    { name: "Total", value: dashboard?.totalSessions || 0 },
    { name: "Completed", value: dashboard?.completedSessions || 0 }
  ];

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>View platform totals, mentor verification status, sessions, and top skills.</p>
        </div>
        {error && <p className="alert error">{error}</p>}

        <div className="stats dashboard-stats admin-stats">
          <div className="stat"><span>Total Users</span><strong>{dashboard?.totalUsers || 0}</strong></div>
          <div className="stat"><span>Total Mentors</span><strong>{dashboard?.totalMentors || 0}</strong></div>
          <div className="stat"><span>Verified Mentors</span><strong>{dashboard?.verifiedMentors || 0}</strong></div>
          <div className="stat"><span>Pending Mentors</span><strong>{dashboard?.pendingMentors || 0}</strong></div>
          <div className="stat"><span>Total Sessions</span><strong>{dashboard?.totalSessions || 0}</strong></div>
          <div className="stat"><span>Completed Sessions</span><strong>{dashboard?.completedSessions || 0}</strong></div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <h2>Top Skills</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard?.topSkills || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="panel">
            <h2>Sessions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
