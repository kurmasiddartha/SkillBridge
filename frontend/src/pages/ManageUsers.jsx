import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    const shouldDelete = window.confirm("Delete this user and related data?");

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await api.delete(`/admin/users/${id}`);
      setMessage("User deleted successfully.");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete user");
    }
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>Manage Users</h1>
          <p>View users and remove accounts when required.</p>
        </div>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}
        {loading ? (
          <div className="empty-state">Loading users...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Role</th>
                  <th>Skill Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.branch || "-"}</td>
                    <td>{user.year || "-"}</td>
                    <td><span className="role-pill">{user.role}</span></td>
                    <td>{user.skillPoints}</td>
                    <td>
                      <button className="button danger" onClick={() => deleteUser(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="empty-state">No users found.</div>}
          </div>
        )}
      </section>
    </main>
  );
};

export default ManageUsers;
