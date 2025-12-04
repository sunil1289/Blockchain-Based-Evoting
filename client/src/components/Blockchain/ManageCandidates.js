// client/src/pages/ManageCandidates.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Layouts/Navbar";
import Web3 from "web3";
import ElectionFactoryABI from "../../contracts/ElectionFactory.json";
import {
  FaEye,
  FaEyeSlash,
  FaUserEdit,
  FaVoteYea,
  FaClipboardList,
  FaSearch,
} from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import { RiDashboardLine, RiQuestionnaireFill } from "react-icons/ri";

const ITEMS_PER_PAGE = 10;

const ManageCandidates = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const netId = await web3.eth.net.getId();
      const deployed = ElectionFactoryABI.networks[netId];
      if (!deployed) throw new Error("Contract not deployed");
      const instance = new web3.eth.Contract(
        ElectionFactoryABI.abi,
        deployed.address
      );
      setContract(instance);
    } catch (err) {
      alert("Connection failed");
    }
  };

  const loadAllCandidates = async () => {
    if (!contract) return;
    setLoading(true);
    setMsg("");
    const allCandidates = [];

    try {
      const electionIds = await contract.methods
        .getAllElectionIdsAdmin()
        .call();

      for (const id of electionIds) {
        const election = await contract.methods.getElection(id).call();
        const electionName = election.name || election[0];
        const electionHidden = election.hidden === true || election[7] === true;

        try {
          const batch = await contract.methods
            .getCandidatesForElectionAdmin(id)
            .call();
          const ids = batch[0];
          const names = batch[1];
          const parties = batch[2];
          const citizenshipNos = batch[3];
          const dobs = batch[4];
          const imgs = batch[5];
          const emails = batch[6];
          const voteCounts = batch[7];
          const hiddenFlags = batch[8];

          for (let i = 0; i < ids.length; i++) {
            allCandidates.push({
              electionId: Number(id),
              electionName,
              electionHidden,
              candidateId: Number(ids[i]),
              name: names[i] || "Unknown",
              party: parties[i] || "Independent",
              citizenshipNo: citizenshipNos[i] || "-",
              dob: dobs[i] || "-",
              img: imgs[i] || "/default-candidate.png",
              email: emails[i] || "-",
              voteCount: Number(voteCounts[i] || 0),
              hidden: hiddenFlags[i] === true,
            });
          }
        } catch (err) {
          console.warn(`Election ${id} has no candidates or failed`);
        }
      }

      setCandidates(allCandidates);
      setFiltered(allCandidates);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (electionId, candidateId, isHidden) => {
    if (!contract || !account) return;
    setMsg("Please confirm in MetaMask...");
    try {
      const method = isHidden ? "unhideCandidate" : "hideCandidate";
      await contract.methods[method](electionId, candidateId).send({
        from: account,
        gas: 300000,
      });
      setMsg(
        isHidden
          ? "Candidate now VISIBLE to public"
          : "Candidate now HIDDEN from public"
      );
      loadAllCandidates();
    } catch (err) {
      setMsg(
        err.code === 4001
          ? "Transaction rejected"
          : "Failed: " + (err.message || "")
      );
    }
  };

  // Filter & Search
  useEffect(() => {
    let result = candidates;

    if (search) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.party.toLowerCase().includes(search.toLowerCase()) ||
          c.electionName.toLowerCase().includes(search.toLowerCase()) ||
          c.citizenshipNo.includes(search) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "visible") result = result.filter((c) => !c.hidden);
    if (filter === "hidden") result = result.filter((c) => c.hidden);
    if (filter === "hidden-election")
      result = result.filter((c) => c.electionHidden);

    setFiltered(result);
    setCurrentPage(1);
  }, [search, filter, candidates]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract) loadAllCandidates();
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
        {/* MAIN CONTENT */}
        <div className="col p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="badge bg-primary fs-5">
              {filtered.length} Candidates
            </span>
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
                <option value="all">All Candidates</option>
                <option value="visible">Visible to Public</option>
                <option value="hidden">Hidden from Public</option>
                <option value="hidden-election">In Hidden Elections</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <p className="fs-4 mt-3">Loading all candidates...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-info text-center p-5 fs-3">
              No candidates match your filter
            </div>
          ) : (
            <>
              <div className="table-responsive shadow-lg rounded">
                <table className="table table-hover align-middle">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Election</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Party</th>
                      <th>Votes</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((c) => (
                      <tr
                        key={`${c.electionId}-${c.candidateId}`}
                        className={
                          c.hidden || c.electionHidden
                            ? "table-secondary opacity-75"
                            : ""
                        }
                      >
                        <td>
                          <div>
                            <strong>{c.electionName}</strong>
                            {c.electionHidden && (
                              <div className="badge bg-danger mt-1">
                                Hidden Election
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <img
                            src={c.img}
                            alt={c.name}
                            className="rounded-circle"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td className="fw-bold">{c.name}</td>
                        <td>{c.party}</td>
                        <td>
                          <span className="badge bg-success fs-5">
                            {c.voteCount}
                          </span>
                        </td>
                        <td>
                          {c.hidden ? (
                            <span className="text-danger">Hidden</span>
                          ) : c.electionHidden ? (
                            <span className="text-warning">
                              Election Hidden
                            </span>
                          ) : (
                            <span className="text-success">Visible</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              toggleVisibility(
                                c.electionId,
                                c.candidateId,
                                c.hidden
                              )
                            }
                            className={`btn btn-lg ${
                              c.hidden ? "btn-success" : "btn-warning"
                            }`}
                            disabled={c.electionHidden}
                            title={
                              c.electionHidden
                                ? "Cannot show: Election is hidden"
                                : ""
                            }
                          >
                            {c.hidden ? (
                              <>
                                Show Publicly <FaEye />
                              </>
                            ) : (
                              <>
                                Hide from Public <FaEyeSlash />
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
                    {Array.from({ length: totalPages }, (_, i) => (
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

export default ManageCandidates;
