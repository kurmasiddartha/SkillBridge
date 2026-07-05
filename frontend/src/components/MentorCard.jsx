import { Link } from "react-router-dom";

const MentorCard = ({ mentor }) => {
  const user = mentor.userId || {};

  return (
    <article className="card mentor-card" style={{ 
      background: 'white', borderRadius: '12px', padding: '1.5rem', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
      border: '1px solid #f3f4f6', transition: 'transform 0.2s',
    }}>
      <div className="mentor-card-head" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div className="profile-avatar small" style={{ 
          width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', 
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 'bold' 
        }}>
          {user.name?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>{user.name || "Mentor"}</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            {user.branch || "Branch not added"} {user.year ? `· Year ${user.year}` : ""}
          </p>
        </div>
      </div>
      
      <p className="mentor-bio" style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1rem', flexGrow: 1, minHeight: '3em' }}>
        {mentor.bio}
      </p>
      
      <div className="tag-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {mentor.skills?.map((skill) => (
          <span className="tag" key={skill} style={{ 
            backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500' 
          }}>
            {skill}
          </span>
        ))}
      </div>
      
      <div className="meta-grid" style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
        padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>Level</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>{mentor.experienceLevel}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>Mode</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>{mentor.mode}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>Rating</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>{mentor.rating || 0}/5</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>Reviews</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>{mentor.totalReviews || 0}</span>
        </div>
      </div>
      
      <Link 
        className="button secondary" 
        to={`/mentors/${mentor._id}`}
        style={{ 
          display: 'block', textAlign: 'center', padding: '0.75rem', 
          backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '8px', 
          fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.2s'
        }}
      >
        View Profile
      </Link>
    </article>
  );
};

export default MentorCard;
