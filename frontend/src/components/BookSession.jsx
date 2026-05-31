import { useState } from "react";
import api from "../api/axios";

const initialForm = {
  skill: "",
  date: "",
  startTime: "",
  endTime: "",
  mode: "Online",
  message: ""
};

const BookSession = ({ mentorProfileId, onClose, onBooked }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/sessions/book", {
        ...form,
        mentorProfileId
      });
      onBooked?.("Session request sent. The mentor can now accept or reject it.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not book session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card form-stack" onSubmit={handleSubmit}>
        <div className="modal-head">
          <h2>Book Session</h2>
          <button className="link-button" type="button" onClick={onClose}>Close</button>
        </div>
        {error && <p className="alert error">{error}</p>}
        <div className="field">
          <label>Skill</label>
          <input placeholder="Skill to learn" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} required />
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="field">
            <label>Start Time</label>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
          </div>
          <div className="field">
            <label>End Time</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
          </div>
        </div>
        <div className="field">
          <label>Mode</label>
          <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            <option>Online</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="field">
          <label>Message</label>
          <textarea placeholder="Share what you want help with." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="button" type="submit" disabled={loading}>{loading ? "Booking..." : "Request Session"}</button>
      </form>
    </div>
  );
};

export default BookSession;
