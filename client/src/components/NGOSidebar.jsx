import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const NAV_ITEMS = [
  { name: "Home", path: "/ngo-dashboard", isActive: (p) => p === "/ngo-dashboard" },
  { name: "Adoption Requests", path: "/ngo-adoptions", isActive: (p) => p === "/ngo-adoptions" },
  {
    name: "Abuse Reports",
    path: "/ngo-abuse-reports",
    isActive: (p) => p === "/ngo-abuse-reports" || p.startsWith("/ngo-abuse-reports/"),
  },
  {
    name: "Notifications",
    path: "/ngo-notifications",
    isActive: (p) => p === "/ngo-notifications" || p.startsWith("/ngo-notifications/"),
  },
  {
    name: "Profile",
    path: "/profile",
    isActive: (p) =>
      p === "/profile" ||
      p === "/ngo-profile" ||
      p === "/edit-profile" ||
      p === "/ngo-edit-profile" ||
      p === "/delete-account" ||
      p === "/ngo-delete-account",
  },
];

export default function NGOSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-secondary font-bold flex flex-col justify-between">
      <div className="flex flex-col items-center pt-6 pb-2">
        <img src={logo} alt="FurEver Safe" className="w-35 h-35 object-contain mb-2" />
      </div>

      <nav className="flex-1 flex flex-col mt-2">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(path);
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              className={
                active
                  ? "w-full py-3.5 text-center text-[20px] font-bold bg-primary text-white"
                  : "w-full py-3.5 text-center text-[20px] font-semibold text-[#4a3f35] hover:bg-[#b8ae9e]"
              }
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="bg-secondary flex flex-col items-center text-center">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 text-[20px] font-bold cursor-pointer bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
