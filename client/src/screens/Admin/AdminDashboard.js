import React from "react";
import Navbar from "./Navbar";
import "../Voter/voterDashboard.css";
import { Link } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { RiQuestionnaireFill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import { FaVoteYea, FaClipboardList } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
const AdminDashboard = () => {
  document.title = "Admin Dashboard";

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

        <div className="dashboard col-12 col-lg-9 col-md-7 col-sm-6">
          <div className="row m-3">
            <h1 className="dashboard-title mb-4">Admin Dashboard</h1>
            <div className="vote-div">
              <div className="card card-vote w-100 h-100">
                <div
                  className="card-body text-center"
                  style={{
                    backgroundColor: "#007BFF",
                    padding: "20px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <h2
                    className="text-white py-3"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Show Live Results
                  </h2>
                </div>
                <Link
                  className="card-footer text-white"
                  to="/livedata"
                  style={{
                    backgroundColor: "#0056b3",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "0 0 10px 10px",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: "500" }}>
                    View Realtime Results ❯
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="row m-3 row-features">
            <div className="col-12 col-lg-3 col-md-12 col-sm-12 sub-col-first my-3">
              <div className="card card-result w-100 h-100">
                <div className="card-body text-center">
                  <h2 className="text-white py-3">Add Candidates</h2>
                </div>
                <Link
                  className="card-footer text-white"
                  to="/admin/addCandidate"
                >
                  <span className="float-left">Add New Candidate ❯</span>
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-md-12 col-sm-12 my-3">
              <div className="card card-chat w-100 h-100">
                <div className="card-body text-center">
                  <h2 className="text-white py-3">Manage Candidates</h2>
                </div>
                <Link
                  className="card-footer text-white"
                  to="/admin/manageCandidates"
                >
                  <span className="float-left">
                    Manage Existing Candidates ❯
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-md-12 col-sm-12 my-3">
              <div className="card card-info w-100 h-100">
                <div className="card-body text-center">
                  <h2 className="text-white py-3">Manage Chatbot</h2>
                </div>
                <Link
                  className="card-footer text-white"
                  to="/admin/ChatbotManager"
                >
                  <span className="float-left">Manage Chatbot Questions ❯</span>
                </Link>
                <Link className="card-footer text-white" to="/admin/manifesto">
                  <span className="float-left">Manage Manifestos ❯</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
