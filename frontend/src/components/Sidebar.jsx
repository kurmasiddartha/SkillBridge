import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard">Overview</NavLink>
      <NavLink to="/mentors">Find Mentors</NavLink>
      <NavLink to="/sessions">My Sessions</NavLink>
      {user?.isMentor && (
        <>
          <NavLink to="/mentor-dashboard">Mentor Dashboard</NavLink>
          <NavLink to="/mentor-requests">Mentor Requests</NavLink>
        </>
      )}
      <NavLink to="/ai">AI Suggestions</NavLink>
      {user?.role === "ADMIN" && (
        <>
          <NavLink to="/admin">Admin Dashboard</NavLink>
          <NavLink to="/admin/verify-mentors">Verify Mentors</NavLink>
          <NavLink to="/admin/users">Manage Users</NavLink>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
