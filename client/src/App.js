// src/App.js
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage/HomePage";
import Login from "./components/Login/login";
import RegistrationForm from "./components/RegistrationForm/registrationForm";
import OtpVerification from "./components/OtpVerification/OtpVerification";
import VoterDashboard from "./screens/Voter/VoterDashboard";
import CandidateDashboard from "./screens/Candidate/CandidateDashboard";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import Report from "./screens/Admin/Report";
import AdminChatbotManager from "./screens/Admin/AdminChatbotManager";
import ChatBot from "./screens/chatbot/ChatBot";
import Vote from "./components/Vote/Vote";
import Verification from "./components/Face-Recognition/verification";
import CandidateManifesto from "./components/Candidate/CandidateManifesto";
import AddElection from "./components/Blockchain/AddElection";
import AddCandidate from "./components/Blockchain/AddCandidate";
import ManageCandidates from "./components/Blockchain/ManageCandidates";
import ManageElection from "./components/Blockchain/ManageElection";
import LiveData from "./components/Blockchain/LiveData";
import GetMetaId from "./components/GetMetaId/GetMetaId";
import ViewManifestos from "./components/Manifestos/ViewManifestos";
import ComingSoon from "./components/Layouts/ComingSoon";
import ViewProfile from "./components/ViewProfile/ViewProfile";
import AdminLogin from "./components/Login/AdminLogin";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verify" element={<OtpVerification />} />
        <Route path="/facial-verification" element={<Verification />} />
        <Route path="/walletid" element={<GetMetaId />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/voter/profile" element={<ViewProfile />} />
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/manifestos" element={<ViewManifestos />} />
        <Route path="/voter/vote" element={<Vote />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/admin/manifesto" element={<CandidateManifesto />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/canndidate/candidatedashboard"
          element={<CandidateDashboard />}
        />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/addCandidate" element={<AddCandidate />} />
        <Route path="/admin/manageElection" element={<ManageElection />} />
        <Route path="/admin/addElection" element={<AddElection />} />
        <Route path="/admin/manageCandidates" element={<ManageCandidates />} />
        <Route path="/admin/ChatbotManager" element={<AdminChatbotManager />} />
        <Route path="/livedata" element={<LiveData />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/developers" element={<ComingSoon />} />
        <Route path="/voter/support" element={<ComingSoon />} />
        <Route path="/voter/chat" element={<ComingSoon />} />
      </Routes>
    </>
  );
};

export default App;
