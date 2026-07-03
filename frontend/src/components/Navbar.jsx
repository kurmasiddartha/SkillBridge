import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">SkillBridge</Link>
      <nav className="nav-links">
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {user.role === "ADMIN" && <NavLink to="/admin">Admin</NavLink>}
            <button className="link-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="login-link">Login</NavLink>
            <NavLink to="/register" className="register-btn">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
