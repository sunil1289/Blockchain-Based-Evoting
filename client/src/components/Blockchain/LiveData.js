// client/src/pages/LiveData.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import ElectionFactoryABI from "../../contracts/ElectionFactory.json";
import Navbar from "../../screens/Admin/Navbar";

import {
  LiveContainer,
  Wrapper,
  PageTitle,
  HeaderButtons,
  FirstRow,
  LongColumn,
  ShortColumn,
  LastRow,
  SectionTitle,
  BarGraphContainer,
  Card,
  CardImg,
  CardText,
  CardsContainer,
} from "./LiveDataElements";

import PieChart from "../../screens/Voter/Voter-Components/PieChart";
import BarGraph from "../../screens/Voter/Voter-Components/BarGraph";
import LineChart from "../../screens/Voter/Voter-Components/LineChart";

const LiveData = () => {
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Install MetaMask");
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const netId = await web3.eth.net.getId();
        const deployed = ElectionFactoryABI.networks[netId];
        if (!deployed) return alert("Contract not deployed");

        const factory = new web3.eth.Contract(
          ElectionFactoryABI.abi,
          deployed.address
        );
        setContract(factory);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) loadElections();
  }, [contract]);

  const loadElections = async () => {
    try {
      const ids = await contract.methods.getAllElectionIds().call();
      const list = [];
      for (const id of ids) {
        const e = await contract.methods.getElection(id).call();
        list.push({ id: Number(id), name: e.name || e[0] });
      }
      setElections(list);
      if (list.length > 0 && !selectedElection) setSelectedElection(list[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCandidates = async (id) => {
    if (!contract || !id) return;
    try {
      const batch = await contract.methods.getCandidatesForElection(id).call();
      const list = (batch[0] || []).map((_, i) => ({
        id: Number(batch[0][i]),
        name: batch[1][i] || "Unknown",
        party: batch[2][i] || "Independent",
        img: batch[5][i] || "/default-candidate.png",
        votecount: Number(batch[7][i] || 0),
      }));
      const total = list.reduce((s, c) => s + c.votecount, 0);
      setCandidates(list);
      setTotalVotes(total);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setCandidates([]);
      setTotalVotes(0);
    }
  };

  useEffect(() => {
    if (selectedElection && contract) {
      loadCandidates(selectedElection);
      const interval = setInterval(
        () => loadCandidates(selectedElection),
        10000
      );
      return () => clearInterval(interval);
    }
  }, [selectedElection, contract]);

  const sortedCandidates = [...candidates].sort(
    (a, b) => b.votecount - a.votecount
  );
  const leadingParty = candidates.length
    ? Object.entries(
        candidates.reduce(
          (acc, c) => ({
            ...acc,
            [c.party]: (acc[c.party] || 0) + c.votecount,
          }),
          {}
        )
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    : "No votes";

  return (
    <>
      <Navbar />

      {/* Minimal Full-Screen Container */}
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <PageTitle
              style={{ fontSize: "1.8rem", color: "#1f2937", margin: 0 }}
            >
              Live Results
            </PageTitle>
          </div>

          {/* Buttons in Top-Right Corner */}
          <div
            style={{
              position: "absolute",
              top: "100px",
              right: "20px",
              display: "flex",
              gap: "10px",
              zIndex: 10,
            }}
          >
            <HeaderButtons
              onClick={() => loadCandidates(selectedElection)}
              style={{ padding: "8px 16px", fontSize: "0.9rem" }}
            >
              Refresh
            </HeaderButtons>
            <HeaderButtons
              onClick={() => navigate(-1)}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                background: "#6b7280",
              }}
            >
              Back
            </HeaderButtons>
          </div>

          {/* Election Selector - Clean & Small */}
          <div style={{ textAlign: "center", margin: "1rem 0 2rem" }}>
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(Number(e.target.value))}
              style={{
                padding: "10px 14px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                minWidth: "260px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <option value="">Select Election</option>
              {elections.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          {!selectedElection ? (
            <div
              style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}
            >
              <p style={{ fontSize: "1.1rem" }}>Please select an election</p>
            </div>
          ) : candidates.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}
            >
              <p style={{ fontSize: "1.1rem" }}>No votes recorded yet</p>
            </div>
          ) : (
            <Wrapper
              style={{
                padding: "1.5rem",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Stats */}
              <div
                style={{
                  textAlign: "center",
                  padding: "0.8rem",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#4b5563",
                  marginBottom: "1.5rem",
                }}
              >
                Updated {lastUpdate} • Total votes:{" "}
                {totalVotes.toLocaleString()}
              </div>

              <FirstRow style={{ gap: "1.5rem", marginBottom: "2rem" }}>
                <ShortColumn>
                  <SectionTitle
                    style={{ fontSize: "1.1rem", color: "#374151" }}
                  >
                    Vote Share
                  </SectionTitle>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "10px",
                      padding: "1rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <PieChart candidates={candidates} />
                  </div>
                </ShortColumn>
                <LongColumn>
                  <SectionTitle
                    style={{ fontSize: "1.1rem", color: "#374151" }}
                  >
                    Votes by Candidate
                  </SectionTitle>
                  <BarGraphContainer>
                    <BarGraph candidates={candidates} />
                  </BarGraphContainer>
                </LongColumn>
              </FirstRow>

              <LastRow style={{ gap: "1.5rem" }}>
                <LongColumn>
                  <SectionTitle
                    style={{ fontSize: "1.1rem", color: "#374151" }}
                  >
                    Top 3 Candidates
                  </SectionTitle>
                  <CardsContainer style={{ gap: "1rem" }}>
                    {[0, 1, 2].map(
                      (i) =>
                        sortedCandidates[i] && (
                          <Card
                            key={i}
                            style={{
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow:
                                i === 0
                                  ? "0 6px 20px rgba(0,0,0,0.12)"
                                  : "0 4px 12px rgba(0,0,0,0.08)",
                              position: "relative",
                            }}
                          >
                            {i === 0 && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "6px",
                                  right: "-28px",
                                  background: "#1f2937",
                                  color: "white",
                                  padding: "4px 30px",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  transform: "rotate(45deg)",
                                  zIndex: 10,
                                }}
                              >
                                Winner
                              </div>
                            )}
                            <CardImg
                              src={sortedCandidates[i].img}
                              style={{ height: "140px", objectFit: "cover" }}
                            />
                            <CardText
                              style={{ padding: "1rem", fontSize: "0.9rem" }}
                            >
                              <div
                                style={{ fontWeight: "600", color: "#111827" }}
                              >
                                {sortedCandidates[i].name}
                              </div>
                              <div
                                style={{
                                  color: "#6b7280",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {sortedCandidates[i].party}
                              </div>
                              <div
                                style={{
                                  fontSize: "1.2rem",
                                  fontWeight: "bold",
                                  color: "#111827",
                                  marginTop: "8px",
                                }}
                              >
                                {sortedCandidates[i].votecount.toLocaleString()}
                              </div>
                            </CardText>
                          </Card>
                        )
                    )}
                  </CardsContainer>
                </LongColumn>

                <ShortColumn>
                  <SectionTitle
                    style={{ fontSize: "1.1rem", color: "#374151" }}
                  >
                    Leading Party
                  </SectionTitle>
                  <div
                    style={{
                      background: "#f3f4f6",
                      padding: "1.2rem",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#374151",
                      marginBottom: "1rem",
                    }}
                  >
                    {leadingParty}
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "10px",
                      padding: "1rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <LineChart candidates={candidates} />
                  </div>
                </ShortColumn>
              </LastRow>
            </Wrapper>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveData;
