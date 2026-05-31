import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <h1>Profile</h1>
        <div className="panel profile-panel">
          <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || "S"}</div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <div className="profile-list">
              <span>Branch: {user?.branch || "Not added"}</span>
              <span>Year: {user?.year || "Not added"}</span>
              <span>Skill Points: {user?.skillPoints}</span>
              <span>Role: {user?.role}</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <h2>Skills Known</h2>
          <div className="tag-row">
            {user?.skillsKnown?.length ? user.skillsKnown.map((skill) => <span className="tag" key={skill}>{skill}</span>) : <p>No skills added.</p>}
          </div>
        </div>
        <div className="panel">
          <h2>Skills Wanted</h2>
          <div className="tag-row">
            {user?.skillsWanted?.length ? user.skillsWanted.map((skill) => <span className="tag" key={skill}>{skill}</span>) : <p>No skills added.</p>}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
