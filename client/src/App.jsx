import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import DeleteAccount from "./pages/DeleteAccount";
import ForgotPassword1 from "./pages/ForgotPassword1";
import ForgotPassword2 from "./pages/ForgotPassword2";
import ForgotPassword3 from "./pages/ForgotPassword3";
import HelpAndSupport from "./pages/HelpAndSupport";
import FAQ from "./pages/FAQ";
import NGOProfile from "./pages/NGOProfile";
import NGOEditProfile from "./pages/NGOEditProfile";
import NGODeleteAccount from "./pages/NGODeleteAccount";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help-and-support" element={<HelpAndSupport />} />
        {/* Citizen Dashboard */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/faq" element={<FAQ />} />
        {/* User Profile Flow */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/ngo-profile" element={<NGOProfile />} />
        <Route path="/ngo-edit-profile" element={<NGOEditProfile />} />
        <Route path="/ngo-delete-account" element={<NGODeleteAccount />} />
        {/* Forgot Password Flow */}
        <Route path="/forgot-password" element={<ForgotPassword1 />} />
        <Route path="/forgot-password/email-sent" element={<ForgotPassword2 />} />
        <Route path="/forgot-password/reset" element={<ForgotPassword3 />} />
      </Routes>
    </BrowserRouter>
  );
}
