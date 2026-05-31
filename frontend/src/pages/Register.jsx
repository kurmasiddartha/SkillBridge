import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
    skillsKnown: "",
    skillsWanted: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toArray = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        ...form,
        year: Number(form.year),
        skillsKnown: toArray(form.skillsKnown),
        skillsWanted: toArray(form.skillsWanted)
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <span className="auth-badge">Join SkillBridge</span>
          <h1>Create your account</h1>
          <p>Share what you know, find mentors, and grow with student-led learning.</p>
        </div>
        {error && <p className="alert error">{error}</p>}
        <div className="form-grid">
          <div className="field">
            <label>Name</label>
            <input placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input placeholder="Minimum 6 characters" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="field">
            <label>Branch</label>
            <input placeholder="Computer Science" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
          </div>
          <div className="field">
            <label>Year</label>
            <input placeholder="3" type="number" min="1" max="6" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="field">
            <label>Skills Known</label>
            <input placeholder="React, Java, DSA" value={form.skillsKnown} onChange={(e) => setForm({ ...form, skillsKnown: e.target.value })} />
          </div>
          <div className="field full-field">
            <label>Skills Wanted</label>
            <input placeholder="DP, Aptitude, Resume" value={form.skillsWanted} onChange={(e) => setForm({ ...form, skillsWanted: e.target.value })} />
          </div>
        </div>
        <button className="button full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default Register;
