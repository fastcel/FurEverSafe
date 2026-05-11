import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { name: "Home", path: "/citizen-dashboard" },
  { name: "Adoptions", path: "/adoptions" },
  { name: "Report Abuse", path: "/report-abuse" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
];

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-secondary font-bold flex flex-col justify-between">

      {/* Logo */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <img src={logo} alt="FurEver Safe" className="w-35 h-35 object-contain mb-2" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex font-bold flex-col mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "w-full py-3.5 text-center text-[20px] font-bold border-none cursor-pointer bg-primary text-white"
                : "w-full py-3.5 text-center text-[20px] font-semibold border-none cursor-pointer bg-transparent text-[#4a3f35] hover:bg-[#b8ae9e]"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
        {/* Bottom */}
        <div className="bg-secondary flex flex-col items-center text-center">
        
        <div className="flex flex-col items-center mb-3 text-base font-bold text-[#3a3028]">
            <span className="text-3xl">🏅</span>
            <span className="text-xl">190 pts</span>
        </div>

        <div className="w-full h-2.5 bg-[#d9d2c5] rounded-full overflow-hidden mb-3">
          <div className="h-full w-[62%] bg-success rounded-full" />
        </div>

        <button className="w-full py-3.5 text-[20px] font-bold cursor-pointer bg-red-600 text-white hover:bg-red-700 transition rounded-none">
        Logout
        </button>
      </div>

    </div>
  );
}