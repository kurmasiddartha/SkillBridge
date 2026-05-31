import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AISuggestions from "./pages/AISuggestions";
import CreateMentorProfile from "./pages/CreateMentorProfile";
import Dashboard from "./pages/Dashboard";
import FindMentors from "./pages/FindMentors";
import Login from "./pages/Login";
import ManageUsers from "./pages/ManageUsers";
import MentorDetails from "./pages/MentorDetails";
import MentorDashboard from "./pages/MentorDashboard";
import MentorSessionRequests from "./pages/MentorSessionRequests";
import MySessions from "./pages/MySessions";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VerifyMentors from "./pages/VerifyMentors";
import Welcome from "./pages/Welcome";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><FindMentors /></ProtectedRoute>} />
        <Route path="/mentors/:id" element={<ProtectedRoute><MentorDetails /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
        <Route path="/mentor-requests" element={<ProtectedRoute><MentorSessionRequests /></ProtectedRoute>} />
        <Route path="/mentor-profile" element={<ProtectedRoute><CreateMentorProfile /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AISuggestions /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/verify-mentors" element={<ProtectedRoute adminOnly><VerifyMentors /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
