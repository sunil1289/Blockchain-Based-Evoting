import React, { useState, useEffect } from "react";
import Navbar from "../Admin/Navbar";
import { Link } from "react-router-dom";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";

import { AiFillFileAdd } from "react-icons/ai";
import { MdHowToVote } from "react-icons/md";
import { FaClipboardList, FaVoteYea } from "react-icons/fa";
import "./AdminChatbotManager.css";

const AdminChatbotManager = () => {
  const [faqList, setFaqList] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedFaq = JSON.parse(localStorage.getItem("faq")) || [];
    setFaqList(storedFaq);
  }, []);

  const addQA = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("Please enter both a question and an answer.");
      return;
    }
    const updated = [
      ...faqList,
      { question: question.trim(), answer: answer.trim() },
    ];
    setFaqList(updated);
    localStorage.setItem("faq", JSON.stringify(updated));
    setQuestion("");
    setAnswer("");
    setError(null);
  };

  const deleteQA = (index) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    const updated = faqList.filter((_, i) => i !== index);
    setFaqList(updated);
    localStorage.setItem("faq", JSON.stringify(updated));
  };

  return (
    <div>
      <Navbar />
      <div className="row dashboard-container">
        <div className="sidebar col-12 col-lg-3 col-md-5 col-sm-6">
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/dashboard" className="link d-block">
                <RiDashboardLine />
                <span className="mx-3 py-2">Dashboard</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/addElection" className="link d-block">
                <MdHowToVote />
                <span className="mx-3 py-2">Add Election</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/manageElection" className="link d-block">
                <FaVoteYea />
                <span className="mx-3 py-2">Manage Election</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/addCandidate" className="link d-block">
                <AiFillFileAdd />
                <span className="mx-3 py-2">Add Candidate</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/manageCandidates" className="link d-block">
                <FaUserEdit />
                <span className="mx-3 py-2">Manage Candidates</span>
              </Link>
            </div>
          </div>

          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/ChatbotManager" className="link d-block">
                <RiQuestionnaireFill />
                <span className="mx-3 py-2">Manage Chatbot Questions</span>
              </Link>
            </div>
          </div>

          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/admin/manifesto" className="link d-block text-white">
                <FaClipboardList />
                <span className="mx-3 py-2">Manage Manifestos</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard col-12 col-lg-9 col-md-7 col-sm-6 p-0">
          <div className="chatbot-manager-container m-4">
            <h2>Manage Chatbot Questions</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={addQA} className="form-container">
              <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Enter answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="textarea-field"
              />
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Add Question
                </button>
              </div>
            </form>

            <div className="questions-list">
              <h3>Existing Questions</h3>
              {faqList.length === 0 && (
                <p>No questions available. Add a new question above.</p>
              )}
              <ul>
                {faqList.map((item, index) => (
                  <li key={index} className="question-item">
                    <div className="question-content">
                      <strong>{item.question}</strong>
                      <p>{item.answer}</p>
                    </div>
                    <div className="question-actions">
                      <button
                        onClick={() => deleteQA(index)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatbotManager;
