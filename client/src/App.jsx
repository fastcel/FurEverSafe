import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserNotifications from "./pages/UserNotifications";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import AdoptionForm from "./pages/Citizen/AdoptionForm";
import AdoptionsPage from "./pages/Citizen/AdoptionsPage";
import NGODashboard from "./pages/ngo/NGODashboard";
import NGOAdoptions from "./pages/ngo/NGOAdoptions";
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
import AdminUsers from "./pages/AdminUsers";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import ReportAbuse from "./pages/ReportAbuse";
import NGOAbuseReports from "./pages/NGOAbuseReports";
import NGOAbuseReportDetails from "./pages/NGOAbuseReportDetails";
import NGONotifications from "./pages/NGONotifications";

const getRole = () => {
  const raw = JSON.parse(localStorage.getItem("user"))?.role?.toLowerCase().trim();
  return raw === "citizen" ? "user" : raw || "user";
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/adopt/:petName" element={<AdoptionForm />} />
        <Route path="/adoptions" element={<AdoptionsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/help-and-support" element={<HelpAndSupport />} />
        {/* Citizen Dashboard */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/faq" element={<FAQ />} />
        {/* User Profile Flow */}
        
        <Route path="/profile" element={<UserProfile role={getRole()} />} />
        <Route path="/edit-profile" element={<EditProfile role={getRole()} />} />
        <Route path="/ngo-profile" element={<UserProfile role={getRole()} />} />
        <Route path="/ngo-edit-profile" element={<EditProfile role={getRole()} />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/ngo-delete-account" element={<NGODeleteAccount />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/forgot-password" element={<ForgotPassword1 />} />
        <Route
          path="/forgot-password/email-sent"
          element={<ForgotPassword2 />}
        />
        <Route path="/forgot-password/reset" element={<ForgotPassword3 />} />
        <Route path="/notifications" element={<UserNotifications />} />
        <Route path="/report-abuse" element={<ReportAbuse />} />
        <Route path="/ngo-abuse-reports" element={<NGOAbuseReports />} />
        <Route
          path="/ngo-abuse-reports/:id"
          element={<NGOAbuseReportDetails />}
        />
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/ngo-adoptions" element={<NGOAdoptions />} />
        <Route path="/ngo-notifications/" element={<NGONotifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
