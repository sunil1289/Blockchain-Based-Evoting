import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BodyContainer,
  FormWrap,
  FormLabel,
  InputField,
  SubmitButton,
} from "./AddCandidateElements";
import Navbar from "../Layouts/Navbar";
import ElectionFactoryABI from "../../contracts/ElectionFactory.json";
import Web3 from "web3";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Icons
import { MdHowToVote, MdAddAPhoto } from "react-icons/md";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import {
  FaUserEdit,
  FaVoteYea,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";

// Animations
const fadeIn = keyframes`
from { opacity: 0; transform: scale(0.9); }
to { opacity: 1; transform: scale(1); }
`;
const bounce = keyframes`
0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
40% { transform: translateY(-20px); }
60% { transform: translateY(-10px); }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.4s ease-out;
`;

const IconSuccess = styled(FaCheckCircle)`
  font-size: 5rem;
  color: #01bf71;
  animation: ${bounce} 1s ease;
`;

const IconError = styled(FaTimesCircle)`
  font-size: 5rem;
  color: #ef4444;
  animation: ${bounce} 1s ease;
`;

// Circular Image Upload
const ImageUploadContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 1rem auto;
`;

const ImageCircle = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 4px dashed #01bf71;
  background: ${(props) => (props.preview ? "transparent" : "#f8f9fa")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #019055;
    background: #f0fdf4;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const PlusIcon = styled(MdAddAPhoto)`
  font-size: 3.5rem;
  color: #01bf71;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const AddCandidate = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidateDOB, setCandidateDOB] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateCitizenNo, setCandidateCitizenNo] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Load wallet & contract
  const loadBlockchain = async () => {
    if (!window.ethereum) {
      setErrorMsg("Please install MetaMask!");
      setShowError(true);
      return false;
    }
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      const netId = await web3.eth.net.getId();
      const networkData = ElectionFactoryABI.networks[netId];
      if (!networkData) {
        setErrorMsg(`Contract not deployed on this network (ID: ${netId})`);
        setShowError(true);
        return false;
      }

      const instance = new web3.eth.Contract(
        ElectionFactoryABI.abi,
        networkData.address
      );
      setContract(instance);
      return true;
    } catch (err) {
      setErrorMsg("Wallet connection failed");
      setShowError(true);
      return false;
    }
  };

  // Fetch elections
  const fetchElections = async () => {
    if (!contract) return;
    try {
      const ids = await contract.methods.getAllElectionIds().call();
      const now = Math.floor(Date.now() / 1000);
      const list = [];

      for (const id of ids) {
        const e = await contract.methods.getElection(id).call();
        const deadline =
          Number(e.endDate || e[2]) + Number(e.gracePeriod || e[3] || 0);
        if (now < deadline) {
          list.push({ id: Number(id), name: e.name || e[0] });
        }
      }
      setElections(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Image upload
  useEffect(() => {
    if (!image) {
      setPreview(null);
      setImageUrl("");
      return;
    }
    setPreview(URL.createObjectURL(image));

    const upload = async () => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Uploads");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dynbrzezs/image/upload",
          data
        );
        setImageUrl(res.data.secure_url);
      } catch (err) {
        setErrorMsg("Image upload failed");
        setShowError(true);
      }
    };
    upload();
  }, [image]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedElection || !imageUrl) return;

    setLoading(true);
    try {
      const gasEstimate = await contract.methods
        .addCandidate(
          selectedElection,
          candidateName.trim(),
          candidateParty.trim(),
          candidateCitizenNo.trim(),
          candidateDOB,
          imageUrl,
          candidateEmail.trim()
        )
        .estimateGas({ from: account });

      await contract.methods
        .addCandidate(
          selectedElection,
          candidateName.trim(),
          candidateParty.trim(),
          candidateCitizenNo.trim(),
          candidateDOB,
          imageUrl,
          candidateEmail.trim()
        )
        .send({
          from: account,
          gas: Math.floor(gasEstimate * 1.5),
        });

      // Optional backend save
      try {
        await axios.post("http://localhost:4000/api/candidate/register", {
          name: candidateName,
          email: candidateEmail,
          citizenship_no: candidateCitizenNo,
          photo: imageUrl,
          election_id: selectedElection,
          party: candidateParty,
        });
      } catch (be) {
        /* ignore */
      }

      setShowSuccess(true);
      setTimeout(() => navigate("/admin/manageCandidates"), 3000);
    } catch (err) {
      console.error(err);
      let msg = "Transaction failed";
      if (err.code === 4001) msg = "You cancelled the transaction";
      else if (err.message.includes("only owner"))
        msg = "Only admin can add candidates";
      else if (err.message.includes("already exists"))
        msg = "Candidate already registered";
      setErrorMsg(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchain().then((ok) => ok && fetchElections());
  }, []);

  useEffect(() => {
    if (contract) fetchElections();
  }, [contract]);

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

        {/* Main Form */}
        <div className="col-12 col-lg-9">
          <BodyContainer>
            <FormWrap onSubmit={handleSubmit}>
              <h3 className="text-center mb-4">Add New Candidate</h3>

              {/* Election */}
              <FormLabel>Select Election *</FormLabel>
              <select
                className="form-control mb-4"
                value={selectedElection}
                onChange={(e) => setSelectedElection(e.target.value)}
                required
              >
                <option value="">-- Choose Election --</option>
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>

              {/* Circular Image Upload */}
              <FormLabel>Candidate Photo *</FormLabel>
              <ImageUploadContainer>
                <ImageCircle
                  preview={preview}
                  onClick={() => fileInputRef.current.click()}
                >
                  {preview ? (
                    <PreviewImage src={preview} alt="Candidate" />
                  ) : (
                    <PlusIcon />
                  )}
                </ImageCircle>
                {preview && (
                  <DeleteBtn
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPreview(null);
                      setImageUrl("");
                      fileInputRef.current.value = "";
                    }}
                  >
                    <FaTrashAlt size={16} />
                  </DeleteBtn>
                )}
              </ImageUploadContainer>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files[0] && setImage(e.target.files[0])
                }
                required
              />
              <small className="text-muted d-block text-center mb-4">
                {imageUrl
                  ? "Image uploaded successfully"
                  : "Click to upload photo"}
              </small>

              <div className="row">
                <div className="col-md-6">
                  <FormLabel>Name *</FormLabel>
                  <InputField
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                  />
                  <FormLabel>Party *</FormLabel>
                  <InputField
                    value={candidateParty}
                    onChange={(e) => setCandidateParty(e.target.value)}
                    required
                  />
                  <FormLabel>Email *</FormLabel>
                  <InputField
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    required
                  />
                  <FormLabel>Citizenship No *</FormLabel>
                  <InputField
                    value={candidateCitizenNo}
                    onChange={(e) => setCandidateCitizenNo(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormLabel>Date of Birth *</FormLabel>
                  <InputField
                    type="date"
                    value={candidateDOB}
                    onChange={(e) => setCandidateDOB(e.target.value)}
                    required
                  />
                </div>
              </div>

              <SubmitButton
                type="submit"
                disabled={loading || !imageUrl || !selectedElection}
              >
                {loading ? "Adding Candidate..." : "Add Candidate"}
              </SubmitButton>
            </FormWrap>
          </BodyContainer>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <ModalOverlay onClick={() => setShowSuccess(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <IconSuccess />
            <h3 style={{ margin: "1rem 0", color: "#065f46" }}>Success!</h3>
            <p>Candidate added successfully</p>
            <button
              className="btn btn-success px-4"
              onClick={() => navigate("/admin/manageCandidates")}
            >
              Go to Candidates
            </button>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ERROR MODAL */}
      {showError && (
        <ModalOverlay onClick={() => setShowError(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <IconError />
            <h3 style={{ margin: "1rem 0", color: "#991b1b" }}>Error</h3>
            <p>{errorMsg}</p>
            <button
              className="btn btn-danger px-4"
              onClick={() => setShowError(false)}
            >
              Close
            </button>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default AddCandidate;
