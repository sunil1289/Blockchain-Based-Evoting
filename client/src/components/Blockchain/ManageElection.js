// client/src/pages/ManageElections.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Layouts/Navbar";
import Web3 from "web3";
import ElectionFactoryABI from "../../contracts/ElectionFactory.json";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";
import { MdHowToVote } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import {
  FaUserEdit,
  FaVoteYea,
  FaClipboardList,
  FaEye,
  FaEyeSlash,
  FaSearch,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const ManageElections = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [elections, setElections] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const connectWalletAndContract = async () => {
    setLoading(true);
    if (!window.ethereum) {
      setMessage("Please install MetaMask");
      setLoading(false);
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const networkData = ElectionFactoryABI.networks[networkId];
      if (!networkData) throw new Error("Contract not deployed");
      const ctr = new web3.eth.Contract(
        ElectionFactoryABI.abi,
        networkData.address
      );
      setContract(ctr);
    } catch (err) {
      setMessage("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const loadElections = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const ids = await contract.methods.getAllElectionIdsAdmin().call();
      const now = Math.floor(Date.now() / 1000);
      const list = [];

      for (const id of ids) {
        try {
          const e = await contract.methods.getElection(id).call();
          const endDate = Number(e.endDate || e[2]);
          const gracePeriod = Number(e.gracePeriod || e[3] || 0);
          const candidateCount = Number(e.candidateCount || e[4] || 0);
          const hidden =
            e.hidden === true || (e[7] !== undefined && e[7] === true);

          const votingDeadline = endDate + gracePeriod;
          const isVotingOpen = now <= votingDeadline;
          const inGracePeriod = now > endDate && now <= votingDeadline;

          let status = "Results Published";
          let badgeClass = "bg-info";
          if (isVotingOpen) {
            status = inGracePeriod ? "Grace Period" : "Voting Open";
            badgeClass = inGracePeriod ? "bg-warning text-dark" : "bg-success";
          }

          list.push({
            id: Number(id),
            name: e.name || e[0],
            endDate,
            gracePeriod,
            candidateCount,
            status,
            badgeClass,
            hidden,
            votingOpen: isVotingOpen,
            inGracePeriod,
          });
        } catch (err) {
          console.warn("Skip election", id);
        }
      }
      setElections(list);
      setFiltered(list);
    } catch (err) {
      setMessage("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  const toggleHideElection = async (id, currentHidden) => {
    if (!contract) return;
    try {
      const method = currentHidden ? "unhideElection" : "hideElection";
      await contract.methods[method](id).send({ from: account, gas: 200000 });

      loadElections();
    } catch (err) {
      setMessage("Failed: " + (err.message || "Rejected"));
    }
  };

  // Filter & Search Logic
  useEffect(() => {
    let result = elections;

    // Search
    if (search) {
      result = result.filter(
        (e) =>
          e.id.toString().includes(search) ||
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.status.toLowerCase().includes(search.toLowerCase()) ||
          e.candidateCount.toString().includes(search)
      );
    }

    // Dropdown Filter
    if (filter !== "all") {
      if (filter === "active")
        result = result.filter((e) => e.votingOpen && !e.inGracePeriod);
      if (filter === "grace") result = result.filter((e) => e.inGracePeriod);
      if (filter === "ended") result = result.filter((e) => !e.votingOpen);
      if (filter === "hidden") result = result.filter((e) => e.hidden);
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, filter, elections]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    connectWalletAndContract();
  }, []);

  useEffect(() => {
    if (contract) loadElections();
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

        {/* MAIN */}
        <div className="col p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-success btn-lg w-auto"
              onClick={() => navigate("/admin/addElection")}
            >
              + Create New Election
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group input-group-lg">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select form-select-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Elections</option>
                <option value="active">Voting Open</option>
                <option value="ended">Ended</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="col-md-2 text-end">
              <span className="badge bg-primary fs-6">
                {filtered.length} Total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <p className="fs-4 mt-3">Loading elections...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-info text-center p-5 fs-3">
              No elections match your filter
            </div>
          ) : (
            <>
              <div className="table-responsive shadow-lg rounded">
                <table className="table table-hover align-middle">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Ends On</th>
                      <th>Candidates</th>
                      <th>Status</th>
                      <th>Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((e) => (
                      <tr
                        key={e.id}
                        className={e.hidden ? "table-secondary opacity-75" : ""}
                      >
                        <td>
                          <strong>#{e.id}</strong>
                        </td>
                        <td className="fw-bold">{e.name}</td>
                        <td>
                          {formatDate(e.endDate)}
                          {e.gracePeriod > 0 && (
                            <small className="text-muted d-block">
                              +{Math.round(e.gracePeriod / 3600)}h grace
                            </small>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-info fs-5">
                            {e.candidateCount}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${e.badgeClass} fs-5`}>
                            {e.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleHideElection(e.id, e.hidden)}
                            className={`btn btn-sm ${
                              e.hidden ? "btn-success" : "btn-warning"
                            }`}
                          >
                            {e.hidden ? (
                              <>
                                Show <FaEye />
                              </>
                            ) : (
                              <>
                                Hide <FaEyeSlash />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageElections;
