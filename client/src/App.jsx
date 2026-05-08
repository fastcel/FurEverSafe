import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";

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
      </Routes>
    </BrowserRouter>
  );
}