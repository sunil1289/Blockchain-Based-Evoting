import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaClipboardList, FaUserEdit, FaTrashAlt } from "react-icons/fa";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import Navbar from "../Layouts/Navbar";
import "../../styles/ManifestoForm.css";
import "react-toastify/dist/ReactToastify.css";
import { FaVoteYea } from "react-icons/fa";

import { MdHowToVote } from "react-icons/md";
const CandidateManifesto = () => {
  const BASE_API_URL =
    "http://localhost:4000/api/candidate/manifesto/61eeaefcbd6e8e008157ae53";
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    images: [],
    partyName: "",
    partySymbol: "",
    manifestoFocus: "",
    manifestoDescription: "",
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    } else {
      toast.error("Please upload valid image files.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      images,
      partyName,
      partySymbol,
      manifestoFocus,
      manifestoDescription,
    } = formData;

    if (
      !images.length ||
      !partyName ||
      !partySymbol ||
      !manifestoFocus ||
      !manifestoDescription
    ) {
      toast.error("Please fill all fields and upload at least one image.");
      return;
    }

    const data = new FormData();
    // Append all images under a single field name 'partyImages'
    images.forEach((image) => {
      data.append("partyImages", image);
    });
    data.append("partyName", partyName);
    data.append("partySymbol", partySymbol);
    data.append("manifestoFocus", manifestoFocus); // Changed to match frontend field name
    data.append("manifestoDescription", manifestoDescription);

    try {
      const response = await axios.post(BASE_API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toast.success("Manifesto submitted successfully!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error submitting manifesto:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit manifesto. Please try again."
      );
    }
  };

  return (
    <>
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
        <div className="main-content">
          <div className="manifesto-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h2>New Manifesto</h2>

                {/* Image Upload */}
                <div className="form-group">
                  <label htmlFor="partyImages" className="form-label">
                    Party Images
                  </label>
                  <button
                    type="button"
                    className="img-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse
                  </button>
                  <input
                    type="file"
                    id="partyImages"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <ul className="mt-2 image-list">
                    {formData.images.map((file, index) => (
                      <li
                        key={index}
                        className="image-item d-flex justify-content-between align-items-center"
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          className="delete-icon-btn"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Party Name */}
                <div className="form-group">
                  <label htmlFor="partyName" className="form-label">
                    Party Name
                  </label>
                  <input
                    id="partyName"
                    name="partyName"
                    type="text"
                    className="form-control"
                    value={formData.partyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Party Symbol */}
                <div className="form-group">
                  <label htmlFor="partySymbol" className="form-label">
                    Party Symbol
                  </label>
                  <input
                    id="partySymbol"
                    name="partySymbol"
                    type="text"
                    className="form-control"
                    value={formData.partySymbol}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Focus Areas */}
                <div className="form-group">
                  <label htmlFor="manifestoFocus" className="form-label">
                    Manifesto Focus Areas
                  </label>
                  <input
                    id="manifestoFocus"
                    name="manifestoFocus"
                    type="text"
                    className="form-control"
                    value={formData.manifestoFocus}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="manifestoDescription" className="form-label">
                    Manifesto Detail Description
                  </label>
                  <textarea
                    id="manifestoDescription"
                    name="manifestoDescription"
                    className="form-control"
                    value={formData.manifestoDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CandidateManifesto;
