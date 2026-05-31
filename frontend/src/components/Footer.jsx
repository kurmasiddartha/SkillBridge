import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="footer-brand">SkillBridge</Link>
          <p>AI-powered student skill exchange for learning, mentoring, and placement preparation.</p>
        </div>
        <div className="footer-links">
          <Link to="/mentors">Find Mentors</Link>
          <Link to="/ai">AI Suggestions</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Built for students who learn better together.</span>
        <span>SkillBridge © 2026</span>
      </div>
    </footer>
  );
};

export default Footer;
