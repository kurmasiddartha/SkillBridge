import { useState } from "react";
import api from "../api/axios";
import BookSession from "../components/BookSession";
import Sidebar from "../components/Sidebar";

const examples = [
  "mern",
  "dp recursion placement",
  "java full stack",
  "communication interview english",
  "os dbms cn"
];

const AISuggestions = () => {
  const [goalText, setGoalText] = useState("");
  const [result, setResult] = useState(null);
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post("/ai/recommend", { goalText });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useExample = (example) => {
    setGoalText(example);
  };

  return (
    <main className="layout">
      <Sidebar />
      <section className="content">
        <div className="page-header">
          <h1>AI Recommendations</h1>
          <p>Enter a goal or short form like MERN, DP, OS DBMS CN, or communication interview English.</p>
        </div>

        <form className="panel ai-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Learning Goal</label>
            <textarea
              placeholder="I am weak in dynamic programming and recursion. I want to prepare for placements."
              value={goalText}
              onChange={(event) => setGoalText(event.target.value)}
              required
            />
          </div>
          <div className="example-buttons">
            {examples.map((example) => (
              <button className="button secondary" type="button" key={example} onClick={() => useExample(example)}>
                {example}
              </button>
            ))}
          </div>
          <div className="ai-actions">
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Generating recommendations..." : "Generate Recommendations"}
            </button>
          </div>
        </form>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        {result && (
          <div className="ai-results">
            <section className="panel">
              <div className="section-heading">
                <h2>Extracted Skills</h2>
                <span>{result.extractedSkills.length} skills</span>
              </div>
              <div className="tag-row">
                {result.extractedSkills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>5-Day Learning Path</h2>
                <span>Practical plan</span>
              </div>
              <div className="learning-path">
                {result.learningPath.map((item, index) => (
                  <article className="path-step" key={`${item}-${index}`}>
                    <strong>Day {index + 1}</strong>
                    <p>{item.replace(/^Day\s*\d+:\s*/i, "")}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <h2>Mentor Questions</h2>
                <span>{result.mentorQuestions.length} prompts</span>
              </div>
              <div className="mini-list">
                {result.mentorQuestions.map((question) => (
                  <article className="mini-list-item" key={question}>
                    <strong>{question}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="section-heading standalone">
                <h2>Recommended Mentors</h2>
                <span>{result.recommendedMentors.length} matches</span>
              </div>
              <div className="card-grid">
                {result.recommendedMentors.map((mentor) => {
                  const user = mentor.userId || {};

                  return (
                    <article className="card ai-mentor-card" key={mentor._id}>
                      <div className="mentor-card-head">
                        <div className="profile-avatar small">{user.name?.charAt(0)?.toUpperCase() || "M"}</div>
                        <div>
                          <h3>{user.name || "Mentor"}</h3>
                          <p>Match score: {mentor.matchScore || mentor.skillMatchCount || 0}</p>
                        </div>
                      </div>
                      <div className="tag-row">
                        {mentor.skills?.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                      </div>
                      <div className="meta-grid">
                        <span><strong>Rating</strong>{mentor.rating || 0}/5</span>
                        <span><strong>Mode</strong>{mentor.mode}</span>
                      </div>
                      <button className="button" onClick={() => setSelectedMentorId(mentor._id)}>
                        Book Session
                      </button>
                    </article>
                  );
                })}
              </div>
              {result.recommendedMentors.length === 0 && (
                <div className="empty-state">
                  No matching verified mentors found for these skills. You can still use the learning path or search mentors manually.
                </div>
              )}
            </section>
          </div>
        )}

        {selectedMentorId && (
          <BookSession
            mentorProfileId={selectedMentorId}
            onClose={() => setSelectedMentorId(null)}
            onBooked={(successMessage) => setMessage(successMessage)}
          />
        )}
      </section>
    </main>
  );
};

export default AISuggestions;
