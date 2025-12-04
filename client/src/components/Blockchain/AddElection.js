// client/src/pages/AddElection.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Web3 from "web3";
import ElectionABI from "../../contracts/ElectionFactory.json";
import Navbar from "../Layouts/Navbar";

// Icons
import { MdHowToVote } from "react-icons/md";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import { FaUserEdit, FaVoteYea, FaClipboardList } from "react-icons/fa";

const AddElection = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("23:59");
  const [graceHours, setGraceHours] = useState("0");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const networkData = ElectionABI.networks[networkId];

      if (!networkData) {
        alert(`Contract not deployed on network ID: ${networkId}`);
        return;
      }

      const ctr = new web3.eth.Contract(ElectionABI.abi, networkData.address);
      setContract(ctr);
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return alert("Connect wallet first");

    const endDateTime = new Date(`${endDate}T${endTime}`);
    const endTimestamp = Math.floor(endDateTime.getTime() / 1000);

    if (endTimestamp <= Date.now() / 1000) {
      return alert("End date & time must be in the future");
    }

    setLoading(true);
    try {
      await contract.methods
        .createElection(
          name,
          endTimestamp,
          Number(graceHours) * 3600 // convert hours → seconds
        )
        .send({ from: account });

      alert("Election created successfully! Fully automated & trustless.");
      navigate("/admin/manageElection");
    } catch (err) {
      console.error(err);
      alert(
        err.message.includes("reverted")
          ? "Transaction failed. Check inputs."
          : err.message
      );
    } finally {
      setLoading(false);
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

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="col-12 col-lg-9 p-5">
          <div className="bg-white shadow-lg rounded p-5">
            <h2 className="mb-4">
              <MdHowToVote className="me-2" />
              Create Election
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold">Election Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Student Council Election 2025"
                  required
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Voting End Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">End Time</label>
                  <input
                    type="time"
                    className="form-control form-control-lg"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Grace Period After End (in hours)
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-lg"
                  value={graceHours}
                  onChange={(e) => setGraceHours(e.target.value)}
                  placeholder="0"
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg px-5"
                disabled={loading || !name || !endDate}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating Election...
                  </>
                ) : (
                  "Create Election"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddElection;
