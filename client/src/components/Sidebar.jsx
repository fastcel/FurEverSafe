import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const rawRole = user?.role?.toLowerCase().trim();
  const role = rawRole === "citizen" ? "user" : rawRole || "user";
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    if (role !== "user") return;

    const fetchPoints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRewardPoints(data.reward_points || 0);
      } catch (err) {
        console.error("Failed to fetch points:", err);
      }
    };

    fetchPoints();
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  const navItemsByRole = {
    user: [
      {
        name: "Home",
        path: "/citizen-dashboard",
        isActive: (p) =>
          p === "/citizen-dashboard" ||
          p.startsWith("/citizen-dashboard") ||
          p.startsWith("/adopt/"),
      },
      { name: "Adoptions", path: "/adoptions" },
      { name: "Report Abuse", path: "/report-abuse" },
      { name: "Notifications", path: "/notifications" },
      {
        name: "Profile",
        path: "/profile",
        isActive: (p) =>
          p === "/profile" ||
          p.startsWith("/profile") ||
          p.startsWith("/delete-account"),
      },
    ],

    ngo: [
      { name: "Home", path: "/ngo-dashboard" },
      { name: "Adoption Requests", path: "/ngo-adoptions" },
      {
        name: "Abuse Reports",
        path: "/ngo-abuse-reports",
        isActive: (p) =>
          p === "/ngo-abuse-reports" || p.startsWith("/ngo-abuse-reports/"),
      },
      {
        name: "Notifications",
        path: "/ngo-notifications",
        isActive: (p) =>
          p === "/ngo-notifications" || p.startsWith("/ngo-notifications/"),
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
    ],

    admin: [
      { name: "Users", path: "/admin/users" },
      { name: "Audit Log", path: "/admin/audit-logs" },
    ],
  };

  const navItems = navItemsByRole[role] || [];

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

      {/* NAV */}
      <nav className="flex-1 flex flex-col mt-2">
        {navItems.map((item) => {
          const pathname = location.pathname;
          const isActive = item.isActive
            ? item.isActive(pathname)
            : pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={
                isActive
                  ? "w-full py-3.5 text-center text-[20px] font-bold bg-primary text-white"
                  : "w-full py-3.5 text-center text-[20px] font-semibold text-[#4a3f35] hover:bg-[#b8ae9e]"
              }
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* BOTTOM */}
      {role !== "admin" && (
        <div className="bg-secondary flex flex-col items-center text-center">
          {role !== "ngo" && (
            <>
              <div className="flex flex-col items-center mb-3 text-base font-bold text-[#3a3028]">
                <span className="text-3xl">🏅</span>
                <span className="text-xl">{rewardPoints} pts</span>
              </div>
              <div className=" w-full px-3">
                <div className="w-full h-2.5 bg-[#d9d2c5] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{
                      width: `${Math.min((rewardPoints / 400) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-3.5 text-[20px] font-bold cursor-pointer bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* ADMIN LOGOUT */}
      {role === "admin" && (
        <button
          onClick={handleLogout}
          className="w-full py-3.5 text-[20px] font-bold bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </div>
  );
}
