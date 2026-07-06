import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import BookSession from "../components/BookSession";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const MentorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const loadMentorDetails = async () => {
      try {
        const mentorResult = await api.get(`/mentors/${id}`);
        const reviewResult = await api.get(`/reviews/mentor/${id}`);

        setMentor(mentorResult.data.mentorProfile);
        setReviews(reviewResult.data.reviews);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load mentor details");
      }
    };

    loadMentorDetails();
  }, [id]);

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="mentor-detail-hero">
          <div className="profile-avatar">{mentor?.userId?.name?.charAt(0)?.toUpperCase() || "M"}</div>
          <div>
            <h1>{mentor?.userId?.name || "Mentor Details"}</h1>
            <p>{mentor?.userId?.branch || "Branch not added"} {mentor?.userId?.year ? `| Year ${mentor.userId.year}` : ""}</p>
          </div>
          {user?.role === "ADMIN" ? null : mentor?.userId?._id?.toString() !== user?._id?.toString() ? (
            <button className="button" onClick={() => setBookingOpen(true)}>Book Session</button>
          ) : (
            <button className="button secondary" disabled>Your Profile</button>
          )}
        </div>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}
        <div className="panel mentor-detail-grid">
          <div>
            <h2>About</h2>
            <p>{mentor?.bio}</p>
            <div className="tag-row">
              {mentor?.skills?.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
            </div>
          </div>
          <div className="detail-stats">
            <span><strong>{mentor?.rating || 0}/5</strong>Average Rating</span>
            <span><strong>{mentor?.totalReviews || 0}</strong>Total Reviews</span>
            <span><strong>{mentor?.mode}</strong>Mode</span>
            <span><strong>{mentor?.experienceLevel}</strong>Level</span>
          </div>
          <div>
            <h2>Availability</h2>
            {mentor?.availableSlots?.length ? mentor.availableSlots.map((slot) => (
              <p key={`${slot.day}-${slot.startTime}`}>{slot.day}: {slot.startTime} - {slot.endTime}</p>
            )) : <p>No slots listed.</p>}
            <p><strong>Location:</strong> {mentor?.location || "Not specified"}</p>
          </div>
        </div>
        <div className="panel reviews-panel">
          <div className="reviews-summary">
            <div>
              <h2>Reviews</h2>
              <p>Feedback from students who completed sessions with this mentor.</p>
            </div>
            <div className="rating-summary">
              <strong>{mentor?.rating || 0}/5</strong>
              <span>{mentor?.totalReviews || 0} total reviews</span>
            </div>
          </div>
          {reviews.length ? reviews.map((review) => (
            <article className="review-item" key={review._id}>
              <div className="review-topline">
                <strong>{review.rating}/5</strong>
                <span>{review.learnerId?.name || "Student"}</span>
              </div>
              <p>{review.comment || "No comment added."}</p>
            </article>
          )) : <div className="empty-state">No reviews yet.</div>}
        </div>
        {bookingOpen && (
          <BookSession
            mentorProfileId={id}
            mentorSkills={mentor?.skills || []}
            onClose={() => setBookingOpen(false)}
            onBooked={(msg) => setMessage(msg)}
          />
        )}
      </section>
    </main>
  );
};

export default MentorDetails;
