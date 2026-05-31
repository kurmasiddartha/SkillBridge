import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const MentorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/mentor");
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load mentor dashboard");
      }
    };

    loadDashboard();
  }, []);

  const chartData = [
    { name: "Pending", value: dashboard?.pendingRequests || 0 },
    { name: "Accepted", value: dashboard?.acceptedSessions || 0 },
    { name: "Completed", value: dashboard?.completedSessions || 0 }
  ];

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Mentor Dashboard</h1>
          <p>Monitor requests, reviews, rating, and points earned from completed sessions.</p>
        </div>
        {error && <p className="alert error">{error}</p>}

        <div className="stats dashboard-stats">
          <div className="stat"><span>Rating</span><strong>{dashboard?.rating || 0}/5</strong></div>
          <div className="stat"><span>Total Reviews</span><strong>{dashboard?.totalReviews || 0}</strong></div>
          <div className="stat"><span>Pending Requests</span><strong>{dashboard?.pendingRequests || 0}</strong></div>
          <div className="stat"><span>Earned Points</span><strong>{dashboard?.earnedPoints || 0}</strong></div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <h2>Session Activity</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="panel">
            <h2>Mentor Profile</h2>
            <p>{dashboard?.mentorProfile?.bio || "No mentor bio available."}</p>
            <div className="tag-row">
              {dashboard?.mentorProfile?.skills?.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="section-heading">
            <h2>Recent Reviews</h2>
            <span>{dashboard?.recentReviews?.length || 0} latest</span>
          </div>
          <div className="mini-list">
            {dashboard?.recentReviews?.length ? dashboard.recentReviews.map((review) => (
              <article className="mini-list-item" key={review._id}>
                <div>
                  <strong>{review.rating}/5 from {review.learnerId?.name || "Student"}</strong>
                  <p>{review.comment || "No comment added."}</p>
                </div>
              </article>
            )) : <div className="empty-state">No reviews yet.</div>}
          </div>
        </section>
      </section>
    </main>
  );
};

export default MentorDashboard;
