import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import "./AICareerMentor.css";

export default function AICareerMentor() {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openStep, setOpenStep] = useState(null);

  const handleGenerate = async () => {
    if (!goal.trim()) return alert("Please enter a career goal!");
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/mentor/roadmap?goal=${encodeURIComponent(goal)}`
      );
      setRoadmap(res.data);
      setOpenStep(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (idx) => {
    setOpenStep(openStep === idx ? null : idx);
  };

  return (
    <div className="mentor-container">
      <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        🧭 AI Career Mentor
      </motion.h2>
      <p className="mentor-subtitle">
        Enter your dream career — Nova will generate a personalized roadmap 📚 with resources!
      </p>

      <div className="mentor-input-section">
        <input
          type="text"
          placeholder="e.g. DevOps, AI Engineer, Web Developer, Data Scientist"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </div>

      {roadmap && (
        <motion.div className="roadmap-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>🎯 {roadmap.career}</h3>
          <p>{roadmap.summary}</p>

          {/* === Main Steps === */}
          {roadmap.steps && roadmap.steps.length > 0 && (
            <div className="roadmap-steps">
              {roadmap.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="roadmap-card"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleStep(idx)}
                >
                  <div className="roadmap-header">
                    <h4>
                      Step {idx + 1}: {step.title}
                    </h4>
                    {openStep === idx ? (
                      <ChevronUp size={18} color="#a78bfa" />
                    ) : (
                      <ChevronDown size={18} color="#a78bfa" />
                    )}
                  </div>

                  <p>{step.description}</p>

                  <AnimatePresence>
                    {openStep === idx && (
                      <motion.div
                        className="roadmap-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul>
                          {step.resources.map((res, i) => (
                            <li key={i}>
                              <a href={res} target="_blank" rel="noreferrer">
                                <ExternalLink size={14} />{" "}
                                {res.includes("youtube")
                                  ? "🎥 Video"
                                  : res.includes("github")
                                  ? "💻 GitHub"
                                  : res.includes("coursera")
                                  ? "🎓 Course"
                                  : res.includes("docs") ||
                                    res.includes("developer") ||
                                    res.includes("guide")
                                  ? "📘 Docs"
                                  : "🔗 Resource"}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* === Extra Detailed Guide (Optional Section) === */}
          {roadmap.detailedGuide && (
            <div className="extra-section">
              <h3 className="mt-6">💼 Explore More Career Paths</h3>
              <div className="guide-lists">
                <div>
                  <h4>⚙️ Technical Roles</h4>
                  <ul>
                    {roadmap.detailedGuide.technicalRoles?.map((r, i) => (
                      <li key={i}>
                        <b>{r.title}</b> — {r.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>🎨 Non-Technical Roles</h4>
                  <ul>
                    {roadmap.detailedGuide.nonTechnicalRoles?.map((r, i) => (
                      <li key={i}>
                        <b>{r.title}</b> — {r.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>🏗️ Engineering Branches</h4>
                  <ul>
                    {roadmap.detailedGuide.engineeringBranches?.map((b, i) => (
                      <li key={i}>
                        <b>{b.branch}</b> — {b.focus}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>💡 Extra Tips</h4>
                  <ul>
                    {roadmap.detailedGuide.extras?.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
