import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loadingMentor, setLoadingMentor] = useState(false);

  const [form, setForm] = useState({
    name: "",
    branch: "",
    year: "",
    skillsKnown: "",
    skillsWanted: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Populate form whenever user data changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        branch: user.branch || "",
        year: user.year || "",
        skillsKnown: user.skillsKnown?.join(", ") || "",
        skillsWanted: user.skillsWanted?.join(", ") || ""
      });
    }
  }, [user]);

  // Fetch mentor profile if user is a mentor
  useEffect(() => {
    if (!user?.isMentor) return;
    setLoadingMentor(true);
    api.get("/mentors/my-profile")
      .then(({ data }) => setMentorProfile(data.mentorProfile))
      .catch(() => setMentorProfile(null))
      .finally(() => setLoadingMentor(false));
  }, [user?.isMentor]);

  const handleEdit = () => {
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to current user values
    setForm({
      name: user.name || "",
      branch: user.branch || "",
      year: user.year || "",
      skillsKnown: user.skillsKnown?.join(", ") || "",
      skillsWanted: user.skillsWanted?.join(", ") || ""
    });
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        branch: form.branch.trim(),
        year: form.year ? Number(form.year) : undefined,
        skillsKnown: form.skillsKnown.split(",").map((s) => s.trim()).filter(Boolean),
        skillsWanted: form.skillsWanted.split(",").map((s) => s.trim()).filter(Boolean)
      };

      await api.put("/auth/profile", payload);
      await fetchCurrentUser();
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>View and manage your personal information and skills.</p>
        </div>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        {/* ── View Mode ── */}
        {!isEditing && (
          <>
            <div className="panel profile-panel">
              <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || "S"}</div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-list">
                  <span><strong>Branch:</strong> {user?.branch || "Not added"}</span>
                  <span><strong>Year:</strong> {user?.year || "Not added"}</span>
                  <span><strong>Skill Points:</strong> {user?.skillPoints}</span>
                  <span><strong>Role:</strong> {user?.role}</span>
                  {user?.isMentor && (
                    <span className="tag" style={{ background: "var(--primary)", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.78rem" }}>
                      Mentor
                    </span>
                  )}
                </div>
                <div className="profile-actions" style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button className="button" onClick={handleEdit}>
                    ✏️ Edit Profile
                  </button>
                  {user?.isMentor ? (
                    <button className="button secondary" onClick={() => navigate("/mentor-profile")}>
                      🎓 Edit Mentor Profile
                    </button>
                  ) : user?.role !== "ADMIN" ? (
                    <button className="button secondary" onClick={() => navigate("/mentor-profile")}>
                      🎓 Become Mentor
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="panel">
              <h2>Skills Known</h2>
              <div className="tag-row">
                {user?.skillsKnown?.length
                  ? user.skillsKnown.map((skill) => <span className="tag" key={skill}>{skill}</span>)
                  : <p>No skills added.</p>}
              </div>
            </div>

            <div className="panel">
              <h2>Skills Wanted</h2>
              <div className="tag-row">
                {user?.skillsWanted?.length
                  ? user.skillsWanted.map((skill) => <span className="tag" key={skill}>{skill}</span>)
                  : <p>No skills added.</p>}
              </div>
            </div>

            {/* Mentor Profile Summary */}
            {user?.isMentor && (
              <div className="panel">
                <div className="section-heading">
                  <h2>Mentor Profile</h2>
                  {mentorProfile?.isVerified
                    ? <span className="tag" style={{ background: "#16a34a", color: "#fff" }}>✓ Verified</span>
                    : <span className="tag" style={{ background: "#d97706", color: "#fff" }}>⏳ Pending</span>}
                </div>
                {loadingMentor ? (
                  <p>Loading mentor profile...</p>
                ) : mentorProfile ? (
                  <>
                    <p style={{ marginBottom: "0.75rem" }}>{mentorProfile.bio}</p>
                    <div className="tag-row" style={{ marginBottom: "0.75rem" }}>
                      {mentorProfile.skills?.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                    </div>
                    <div className="meta-grid">
                      <span><strong>Level</strong>{mentorProfile.experienceLevel}</span>
                      <span><strong>Mode</strong>{mentorProfile.mode}</span>
                      <span><strong>Rating</strong>{mentorProfile.rating || 0}/5</span>
                      {mentorProfile.location && <span><strong>Location</strong>{mentorProfile.location}</span>}
                    </div>
                  </>
                ) : (
                  <p>Mentor profile not loaded.</p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Edit Mode ── */}
        {isEditing && (
          <form className="panel mentor-form" onSubmit={handleSave}>
            <h2 style={{ marginBottom: "1.25rem" }}>Edit Profile</h2>

            <div className="form-grid">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="field">
                <label>Branch</label>
                <input
                  type="text"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div className="field">
                <label>Year of Study</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                >
                  <option value="">-- Select Year --</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Skills Known <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(comma-separated)</span></label>
              <input
                type="text"
                value={form.skillsKnown}
                onChange={(e) => setForm({ ...form, skillsKnown: e.target.value })}
                placeholder="e.g. React, DSA, Java"
              />
            </div>

            <div className="field">
              <label>Skills Wanted <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(comma-separated)</span></label>
              <input
                type="text"
                value={form.skillsWanted}
                onChange={(e) => setForm({ ...form, skillsWanted: e.target.value })}
                placeholder="e.g. Machine Learning, DBMS"
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button className="button" type="submit" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button className="button secondary" type="button" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default Profile;
