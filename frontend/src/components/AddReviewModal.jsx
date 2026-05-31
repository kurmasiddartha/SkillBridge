import { useState } from "react";
import api from "../api/axios";

const AddReviewModal = ({ session, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/reviews", {
        sessionId: session._id,
        rating: Number(form.rating),
        comment: form.comment
      });
      onSuccess?.("Review added successfully.");
      onClose();
    } catch (err) {
      onError?.(err.response?.data?.message || "Could not add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card form-stack" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <h2>Add Review</h2>
            <p>Rate your session with {session.mentorId?.name || "your mentor"}.</p>
          </div>
          <button className="link-button" type="button" onClick={onClose}>Close</button>
        </div>
        <div className="field">
          <label>Rating</label>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Needs improvement</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        <div className="field">
          <label>Comment</label>
          <textarea
            placeholder="Share what helped, what could improve, and what you learned."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewModal;
