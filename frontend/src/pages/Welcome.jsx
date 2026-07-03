import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Welcome.css";

const Welcome = () => {
  const { user } = useAuth();

  return (
    <main className="welcome-page-new">
      {/* Super-heading */}
      <h1 className="super-heading">Skill exchange solutions for high-performing students</h1>

      <section className="welcome-hero">
        <div className="welcome-copy">
          {/* Teaser card like Lumen */}
          <div className="teaser-card">
            <div className="teaser-icon">★</div>
            <p className="teaser-text">
              <strong>Over 5,000+ sessions</strong> completed by verified student mentors.{" "}
              <Link to={user ? "/dashboard" : "/register"}>Join them today.</Link>
            </p>
          </div>

          <div>
            <div className="feature-heading">
              <span>✦</span> AI-Powered Exchange
            </div>
            <h2 className="feature-title">SkillBridge. Create, teach, and learn.</h2>
            <p className="feature-desc">
              Build and connect study plans, find verified peer mentors, and exchange skills with
              context-aware AI. Gain placement preparation tips and master tricky concepts together.
            </p>
          </div>

          <div className="welcome-actions">
            {user ? (
              <Link className="btn-pill-primary" to="/dashboard">Go to Dashboard</Link>
            ) : (
              <>
                <Link className="btn-pill-primary" to="/register">Get Started Free</Link>
                <Link className="btn-text-link" to="/login">
                  Login to your account <span className="arrow">→</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right side Showcase with 3D Offset Background and mock browser */}
        <div className="welcome-showcase">
          <div className="showcase-wrapper">
            <div className="showcase-offset-bg"></div>
            <article className="showcase-mockup">
              <div className="mockup-header">
                <span className="mockup-dot dot-red"></span>
                <span className="mockup-dot dot-yellow"></span>
                <span className="mockup-dot dot-green"></span>
                <div className="mockup-url">localhost:5173/dashboard</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-section">
                  <span className="mockup-badge">AI SUGGESTION</span>
                  <h4>dp recursion placement</h4>
                  <div className="mockup-progress-bar">
                    <div className="mockup-progress" style={{ width: "70%" }}></div>
                  </div>
                  <div className="mockup-steps">
                    <div className="mockup-step checked">✓ Day 1: Recursion Basics</div>
                    <div className="mockup-step checked">✓ Day 2: Backtracking & DP</div>
                    <div className="mockup-step active">→ Day 3: Knapsack Problem</div>
                  </div>
                </div>

                <div className="mockup-section">
                  <span className="mockup-badge">MENTOR MATCH</span>
                  <div className="mentor-avatar-row">
                    <div className="mentor-avatar">SM</div>
                    <div className="mentor-info">
                      <h5>Siddartha Kurma</h5>
                      <p>Verified Peer Mentor • Rating 4.9★</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* SVG Decorative Arrow 1 (Pointing to top right corner of mockup) */}
            <svg
              className="decorative-arrow arrow-right-up"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 50C25 45 45 35 48 12M48 12L38 18M48 12L45 25"
                stroke="#172b4d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* SVG Decorative Arrow 2 (Pointing to bottom left corner of mockup) */}
            <svg
              className="decorative-arrow arrow-left-down"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 10C35 15 15 25 12 48M12 48L22 42M12 48L15 35"
                stroke="#172b4d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="welcome-section">
        <div className="section-heading">
          <h2>What You Can Do</h2>
          <p>Student-friendly peer learning ecosystem</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Find Mentors</h3>
            <p>Search verified mentors for MERN, DSA, Java, DBMS, OS, CN, and more.</p>
          </article>
          <article className="feature-card">
            <h3>Become a Mentor</h3>
            <p>Create your mentor profile, list your skills, add availability, and help other students.</p>
          </article>
          <article className="feature-card">
            <h3>Book Sessions</h3>
            <p>Request sessions, track status, cancel when needed, and complete learning with points.</p>
          </article>
          <article className="feature-card">
            <h3>Use AI Suggestions</h3>
            <p>Enter goals like “mern” or “os dbms cn” and get active 5-day study pathways.</p>
          </article>
        </div>
      </section>

      {/* Band Call-to-action */}
      <section className="welcome-band">
        <div>
          <h2>Ready to bridge your next skill gap?</h2>
          <p>Start as a learner today, become a mentor tomorrow, and keep improving with every session.</p>
        </div>
        <Link className="btn-pill-primary" to={user ? "/mentors" : "/register"}>
          {user ? "Find Mentors" : "Create Account"}
        </Link>
      </section>
    </main>
  );
};

export default Welcome;
