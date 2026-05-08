import { useState } from "react";
import logo from "../assets/logo.png";

const navItems = ["Home", "Adoptions", "Report Abuse", "Notifications", "Profile"];

export default function Sidebar() {
  const [active, setActive] = useState("Home");

  return (
    <div className="w-64 h-screen bg-secondary font-bold flex flex-col justify-between sticky top-0">

      {/* Logo */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <img src={logo} alt="FurEver Safe" className="w-35 h-35 object-contain mb-2" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex font-bold flex-col mt-2">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={
              active === item
                ? "w-full py-3.5 text-center text-[20px] font-bold border-none cursor-pointer bg-primary text-white"
                : "w-full py-3.5 text-center text-[20px] font-semibold border-none cursor-pointer bg-transparent text-[#4a3f35] hover:bg-[#b8ae9e]"
            }
          >
            {item}
          </button>
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