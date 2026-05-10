import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportAbuse from "./pages/ReportAbuse";
import NGOAbuseReports from "./pages/NGOAbuseReports";
import NGOAbuseReportDetails from "./pages/NGOAbuseReportDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Citizen Dashboard */}
        <Route
          path="/citizen-dashboard"
          element={<CitizenDashboard />}
        />
        <Route
          path="/report-abuse"
          element={<ReportAbuse />}
        />
        {/* NGO Routes */}
        <Route
          path="/ngo-abuse-reports"
          element={<NGOAbuseReports />}
        />
        <Route
          path="/ngo-abuse-reports/:id"
          element={<NGOAbuseReportDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}