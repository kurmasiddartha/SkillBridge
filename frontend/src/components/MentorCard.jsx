import { Link } from "react-router-dom";

const MentorCard = ({ mentor }) => {
  const user = mentor.userId || {};

  return (
    <article className="card mentor-card">
      <div className="mentor-card-head">
        <div className="profile-avatar small">{user.name?.charAt(0)?.toUpperCase() || "M"}</div>
        <div>
          <h3>{user.name || "Mentor"}</h3>
          <p>{user.branch || "Branch not added"} {user.year ? `· Year ${user.year}` : ""}</p>
        </div>
      </div>
      <p className="mentor-bio">{mentor.bio}</p>
      <div className="tag-row">
        {mentor.skills?.map((skill) => (
          <span className="tag" key={skill}>{skill}</span>
        ))}
      </div>
      <div className="meta-grid">
        <span><strong>Level</strong>{mentor.experienceLevel}</span>
        <span><strong>Mode</strong>{mentor.mode}</span>
        <span><strong>Rating</strong>{mentor.rating || 0}/5</span>
        <span><strong>Reviews</strong>{mentor.totalReviews || 0}</span>
      </div>
      <Link className="button secondary" to={`/mentors/${mentor._id}`}>View Profile</Link>
    </article>
  );
};

export default MentorCard;
