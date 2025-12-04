import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/Homepage/HomePage";
import Login from "./components/Login/login";
import RegistrationForm from "./components/RegistrationForm/registrationForm";
import OtpVerification from "./components/OtpVerification/OtpVerification";
import VoterDashboard from "./screens/Voter/VoterDashboard";
import CandidateDashboard from "./screens/Candidate/CandidateDashboard";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import AdminChatbotManager from "./screens/Admin/AdminChatbotManager";
import ChatBot from "./screens/chatbot/ChatBot";
import Vote from "./components/Vote/Vote";
import Verification from "./components/Face-Recognition/verification";
import CandidateManifesto from "./components/Candidate/CandidateManifesto";
import AddCandidate from "./components/Blockchain/AddCandidate";
import ManageCandidates from "./components/Blockchain/ManageCandidates";
import LiveData from "./components/Blockchain/LiveData";
import GetMetaId from "./components/GetMetaId/GetMetaId";
import ViewManifestos from "./components/Manifestos/ViewManifestos";
import ComingSoon from "./components/Layouts/ComingSoon";
import ViewProfile from "./components/ViewProfile/ViewProfile";
import AddElection from "./components/Blockchain/AddElection";
import ManageElection from "./components/Blockchain/ManageElection";

const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <RegistrationForm /> },
    { path: "/verify", element: <OtpVerification /> },
    { path: "/voter/dashboard", element: <VoterDashboard /> },
    { path: "/voter/manifestos", element: <ViewManifestos /> },
    { path: "/candidate/dashboard", element: <CandidateDashboard /> },
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/manifesto", element: <CandidateManifesto /> },
    { path: "/chatbot", element: <ChatBot /> },
    { path: "/voter/vote", element: <Vote /> },
    { path: "/livedata", element: <LiveData /> },
    { path: "/facial-verification", element: <Verification /> },
    { path: "/admin/addElection", element: <AddElection /> },
    { path: "/admin/addCandidate", element: <AddCandidate /> },
    { path: "/admin/manageElection", element: <ManageElection /> },
    { path: "/admin/manageCandidates", element: <ManageCandidates /> },
    { path: "/walletid", element: <GetMetaId /> },
    { path: "/comingsoon", element: <ComingSoon /> },
    { path: "/profile", element: <ViewProfile /> },
    { path: "/voter/profile", element: <ViewProfile /> }, //change
    { path: "/admin/ChatbotManager", element: <AdminChatbotManager /> },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
