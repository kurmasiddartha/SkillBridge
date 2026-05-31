import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Welcome = () => {
  const { user } = useAuth();

  return (
    <main className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-copy">
          <span className="auth-badge">AI-Powered Student Skill Exchange</span>
          <h1>Learn from classmates. Teach what you know. Grow faster together.</h1>
          <p>
            SkillBridge helps college students find verified peer mentors, book learning sessions with
            skill points, review mentors, and get AI-generated learning paths for placements and projects.
          </p>
          <div className="welcome-actions">
            {user ? (
              <Link className="button" to="/dashboard">Go to Dashboard</Link>
            ) : (
              <>
                <Link className="button" to="/register">Get Started</Link>
                <Link className="button secondary" to="/login">Login</Link>
              </>
            )}
          </div>
        </div>
        <div className="welcome-panel">
          <div className="welcome-card primary-card">
            <span>AI Goal</span>
            <strong>“dp recursion placement”</strong>
            <p>Dynamic Programming, Recursion, DSA, Placement Preparation</p>
          </div>
          <div className="welcome-card">
            <span>Mentor Match</span>
            <strong>Verified peer mentors</strong>
            <p>Search by skill, mode, experience, rating, and availability.</p>
          </div>
          <div className="welcome-card">
            <span>Skill Points</span>
            <strong>Learn with fair exchange</strong>
            <p>Points transfer only when sessions are completed.</p>
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <div className="section-heading standalone">
          <h2>What You Can Do</h2>
          <span>Student friendly</span>
        </div>
        <div className="feature-grid">
          <article className="card feature-card">
            <h3>Find Mentors</h3>
            <p>Search verified mentors for MERN, DSA, Java, aptitude, English, DBMS, OS, CN, and more.</p>
          </article>
          <article className="card feature-card">
            <h3>Become a Mentor</h3>
            <p>Create your mentor profile, list your skills, add availability, and help other students learn.</p>
          </article>
          <article className="card feature-card">
            <h3>Book Sessions</h3>
            <p>Request sessions, track status, cancel when needed, and complete learning with skill points.</p>
          </article>
          <article className="card feature-card">
            <h3>Use AI Suggestions</h3>
            <p>Enter goals like “mern” or “os dbms cn” and get skills, a 5-day plan, and mentor questions.</p>
          </article>
        </div>
      </section>

      <section className="welcome-band">
        <div>
          <h2>Ready to bridge your next skill gap?</h2>
          <p>Start as a learner today, become a mentor tomorrow, and keep improving with every session.</p>
        </div>
        <Link className="button" to={user ? "/mentors" : "/register"}>
          {user ? "Find Mentors" : "Create Account"}
        </Link>
      </section>
    </main>
  );
};

export default Welcome;
