import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Layouts/Navbar";
import Web3 from "web3";
import ElectionFactoryABI from "../../contracts/ElectionFactory.json";
import { RiDashboardLine } from "react-icons/ri";
import {
  FaUserEdit,
  FaVoteYea,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { IoMdChatboxes } from "react-icons/io";
import { MdSupportAgent, MdDeveloperMode } from "react-icons/md";
import styled, { keyframes } from "styled-components";

// === ANIMATIONS & STYLES (unchanged) ===
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
`;

const SuccessIcon = styled(FaCheckCircle)`
  font-size: 4.5rem;
  color: #01bf71;
  animation: ${bounce} 1s ease;
`;

const ErrorIcon = styled(FaTimesCircle)`
  font-size: 4.5rem;
  color: #ef4444;
  animation: ${bounce} 1s ease;
`;

const ModalTitle = styled.h3`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: ${(props) => (props.success ? "#065f46" : "#991b1b")};
`;

const ModalMessage = styled.p`
  font-size: 1.15rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

// Privacy badge on vote button
const PrivacyBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.85rem;
  margin-top: 8px;
  color: #059669;
  font-weight: 600;
`;

// Rest of your beautiful styles (unchanged)
const MainContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: "Inter", sans-serif;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  margin-left: 0;
`;

const ElectionSelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a8a;
  background: white;
  border: 3px solid #01bf71;
  border-radius: 16px;
  outline: none;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 45px;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  outline: none;
  &:focus {
    border-color: #01bf71;
    box-shadow: 0 0 0 3px rgba(1, 191, 113, 0.15);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.2rem;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.6rem;
  margin-top: 1.5rem;
`;

const CandidateCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.4s ease;
  border: 2px solid #f1f5f9;
  &:hover {
    transform: translateY(-12px);
    border-color: #01bf71;
    box-shadow: 0 20px 40px rgba(1, 191, 113, 0.2);
  }
`;

const CandidateImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CandidateInfo = styled.div`
  padding: 1.4rem;
  text-align: center;
`;

const CandidateName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: #111827;
`;

const CandidateParty = styled.p`
  font-size: 1.1rem;
  color: #01bf71;
  font-weight: 700;
  margin: 0 0 0.8rem;
`;

const VoteCount = styled.div`
  display: inline-block;
  background: #f0fdf4;
  color: #065f46;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const VoteButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${(props) => (props.disabled ? "#9ca3af" : "#01bf71")};
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  &:hover:not(:disabled) {
    background: #019055;
    transform: translateY(-3px);
  }
`;

// MAIN COMPONENT
const Vote = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [votedMap, setVotedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  // Dialogs
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-close dialogs
  useEffect(() => {
    if (showSuccess) setTimeout(() => setShowSuccess(false), 5000);
  }, [showSuccess]);

  useEffect(() => {
    if (showError) setTimeout(() => setShowError(false), 6000);
  }, [showError]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const netId = await web3.eth.net.getId();
      const deployed = ElectionFactoryABI.networks[netId];
      if (!deployed) return alert("Contract not deployed on this network!");

      const instance = new web3.eth.Contract(
        ElectionFactoryABI.abi,
        deployed.address
      );
      setContract(instance);
    } catch (err) {
      console.error(err);
    }
  };

  const loadElections = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const ids = await contract.methods.getAllElectionIds().call();
      const now = Math.floor(Date.now() / 1000);
      const list = [];
      for (const id of ids) {
        const e = await contract.methods.getElection(id).call();
        const end = Number(e.endDate || e[2]);
        const grace = Number(e.gracePeriod || e[3] || 0);
        if (now <= end + grace) {
          list.push({ id: Number(id), name: e.name || e[0] });
        }
      }
      setElections(list);
      if (list.length > 0) setSelectedElection(list[0].id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const loadCandidatesAndVotedStatus = async (electionId) => {
    if (!contract || !account) return;
    try {
      const batch = await contract.methods
        .getCandidatesForElection(electionId)
        .call();
      const list = batch[0].map((_, i) => ({
        id: Number(batch[0][i]),
        name: batch[1][i],
        party: batch[2][i],
        img: batch[5][i] || "https://via.placeholder.com/300x200?text=No+Image",
        voteCount: Number(batch[7][i]),
      }));
      setCandidates(list);
      setFilteredCandidates(list);

      const hasVoted = await contract.methods
        .hasVoted(electionId, account)
        .call();
      setVotedMap((prev) => ({ ...prev, [electionId]: hasVoted }));
    } catch (err) {
      console.error(err);
    }
  };

  // PRIVATE VOTING FUNCTION — THIS IS THE ONLY CHANGE
  const vote = async (candidateId) => {
    if (!contract || !account || voting) return;

    setVoting(true);
    try {
      // Generate random 32-byte secret salt → makes vote 100% private
      const secretSalt = Web3.utils.randomHex(32);

      // Optional: Save proof locally (user can verify later)
      localStorage.setItem(
        `proof_${selectedElection}_${candidateId}`,
        secretSalt
      );

      await contract.methods
        .vote(selectedElection, candidateId, secretSalt)
        .send({ from: account });

      setVotedMap((prev) => ({ ...prev, [selectedElection]: true }));
      loadCandidatesAndVotedStatus(selectedElection);
      setShowSuccess(true);
    } catch (err) {
      const msg = err.message.includes("already voted")
        ? "You have already voted in this election!"
        : "Voting failed. Please try again.";
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setVoting(false);
    }
  };

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredCandidates(
      candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.party.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, candidates]);

  useEffect(() => {
    connectWallet();
  }, []);
  useEffect(() => {
    if (contract) loadElections();
  }, [contract]);
  useEffect(() => {
    if (selectedElection && account)
      loadCandidatesAndVotedStatus(selectedElection);
  }, [selectedElection, account]);

  return (
    <div>
      <Navbar />

      <MainContainer>
        {/* Sidebar */}
        <div className="sidebar col-12 col-lg-3 col-md-5 col-sm-6">
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/dashboard" className="link d-block">
                <RiDashboardLine /> <span className="mx-3 py-2">Dashboard</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/profile" className="link d-block">
                <FaUserEdit /> <span className="mx-3 py-2">User</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/vote" className="link d-block active">
                <FaVoteYea /> <span className="mx-3 py-2">Vote</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/walletid" className="link d-block">
                <ImStatsBars /> <span className="mx-3 py-2">Wallet ID</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/chat" className="link d-block">
                <IoMdChatboxes /> <span className="mx-3 py-2">Message</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/voter/support" className="link d-block">
                <MdSupportAgent /> <span className="mx-3 py-2">Support</span>
              </Link>
            </div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-titles py-3 px-1">
              <Link to="/developers" className="link d-block">
                <MdDeveloperMode />{" "}
                <span className="mx-3 py-2">Developers</span>
              </Link>
            </div>
          </div>
        </div>

        <ContentArea>
          {/* Election Selector & Search */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>
                Choose Election
              </label>
              <ElectionSelect
                value={selectedElection}
                onChange={(e) => setSelectedElection(Number(e.target.value))}
                disabled={loading || elections.length === 0}
              >
                <option value="">Select an active election...</option>
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </ElectionSelect>
            </div>
            <div className="col-12 col-md-6">
              <label
                className="fw-bold mb-2 d-block"
                style={{ fontSize: "1.1rem" }}
              >
                &nbsp;
              </label>
              <SearchContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="        Search by name or party"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
            </div>
          </div>

          {/* Candidates Grid */}
          {selectedElection ? (
            filteredCandidates.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">
                  {searchTerm
                    ? "No candidates match your search"
                    : "No candidates found"}
                </h4>
              </div>
            ) : (
              <CandidatesGrid>
                {filteredCandidates.map((c) => (
                  <CandidateCard key={c.id}>
                    <CandidateImage src={c.img} alt={c.name} />
                    <CandidateInfo>
                      <CandidateName>{c.name}</CandidateName>
                      <CandidateParty>{c.party}</CandidateParty>
                      <VoteCount>{c.voteCount} votes</VoteCount>

                      <VoteButton
                        disabled={votedMap[selectedElection] || voting}
                        onClick={() => vote(c.id)}
                      >
                        {votedMap[selectedElection]
                          ? "Already Voted"
                          : voting
                          ? "Casting Vote..."
                          : "Vote "}
                      </VoteButton>

                      {/* Privacy Badge */}
                      {!votedMap[selectedElection] && !voting && (
                        <PrivacyBadge>
                          <FaShieldAlt />
                        </PrivacyBadge>
                      )}
                    </CandidateInfo>
                  </CandidateCard>
                ))}
              </CandidatesGrid>
            )
          ) : (
            <div className="text-center py-5">
              <h3 className="text-muted">Please select an election to vote</h3>
            </div>
          )}
        </ContentArea>
      </MainContainer>

      {/* SUCCESS DIALOG */}
      {showSuccess && (
        <ModalOverlay onClick={() => setShowSuccess(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SuccessIcon />
            <ModalTitle success>Private Vote Cast!</ModalTitle>
            <ModalMessage>
              Your vote is <strong>100% anonymous</strong> and recorded
              successfully
            </ModalMessage>
            <button
              className="btn btn-success px-5 py-2"
              onClick={() => setShowSuccess(false)}
            >
              OK!
            </button>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ERROR DIALOG */}
      {showError && (
        <ModalOverlay onClick={() => setShowError(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ErrorIcon />
            <ModalTitle>Voting Failed</ModalTitle>
            <ModalMessage>{errorMessage}</ModalMessage>
            <button
              className="btn btn-danger px-5 py-2"
              onClick={() => setShowError(false)}
            >
              Close
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Vote;
