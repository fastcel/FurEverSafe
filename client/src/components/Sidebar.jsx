import { useState } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";

// Define paths for your items
const navItems = [
  { name: "Home", path: "/dashboard" },
  { name: "Adoptions", path: "/adoptions" },
  { name: "Report Abuse", path: "/report-abuse" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

    const handleLogout = () => {
      // remove auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // optional: clear anything else
      sessionStorage.clear();

      // redirect to login
      navigate("/login");
    };

  return (
    <div className="w-64 min-h-screen bg-secondary font-bold flex flex-col justify-between">
      {/* Logo */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <img
          src={logo}
          alt="FurEver Safe"
          className="w-35 h-35 object-contain mb-2"
        />
      </div>

      {/* Nav - Swapped buttons for Links */}
      <nav className="flex-1 flex font-bold flex-col mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={
                isActive
                  ? "w-full py-3.5 text-center text-[20px] font-bold border-none cursor-pointer bg-primary text-white no-underline block"
                  : "w-full py-3.5 text-center text-[20px] font-semibold border-none cursor-pointer bg-transparent text-[#4a3f35] hover:bg-[#b8ae9e] no-underline block"
              }
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="bg-secondary flex flex-col items-center text-center">
        <div className="flex flex-col items-center mb-3 text-base font-bold text-[#3a3028]">
          <span className="text-3xl">🏅</span>
          <span className="text-xl">190 pts</span>
        </div>

        <div className="w-full h-2.5 bg-[#d9d2c5] rounded-full overflow-hidden mb-3">
          <div className="h-full w-[62%] bg-success rounded-full" />
        </div>

        {/* Change this to a Link or keep as button for a logout function */}
        <button
        onClick={handleLogout}
        className="w-full py-3.5 text-[20px] font-bold cursor-pointer bg-red-600 text-white hover:bg-red-700 transition rounded-none border-none"
      >
        Logout
      </button>
      </div>
    </div>
  );
}
