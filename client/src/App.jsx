import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import AdoptionForm from "./pages/Citizen/AdoptionForm";
import AdoptionsPage from "./pages/Citizen/AdoptionsPage";
import NGODashboard from "./pages/ngo/NGODashboard";
import NGOAdoptions from "./pages/ngo/NGOAdoptions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/adopt/:petName" element={<AdoptionForm />} />
        <Route path="/adoptions" element={<AdoptionsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Citizen Dashboard */}
        <Route
          path="/citizen-dashboard"
          element={<CitizenDashboard />}
        />

        {/* NGO Dashboard */}
        <Route
          path="/ngo-dashboard"
          element={<NGODashboard />}
        />
        <Route path="/ngo-adoptions" element={<NGOAdoptions />} />
      </Routes>

    </BrowserRouter>
  );
}