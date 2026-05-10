import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function NGOSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="w-64 bg-[#dcd3c1] flex flex-col font-bold">
      <div className="flex flex-col items-center pt-6 pb-6">
        <img src={logo} alt="FurEver Safe" className="w-32 h-32 object-contain" />
      </div>

      <nav className="flex flex-col gap-6 mt-4 flex-1">
        <Link 
          to="/ngo-home" 
          className={`w-full py-3 text-center text-xl font-bold block ${path === '/ngo-home' ? 'bg-[#c6287c] text-white' : 'bg-[#b5b5b5] text-[#c6287c]'}`}
        >
          Home
        </Link>
        <Link 
          to="/ngo-adoption-requests" 
          className={`w-full py-3 text-center text-xl font-bold block ${path === '/ngo-adoption-requests' ? 'bg-[#c6287c] text-white' : 'bg-[#b5b5b5] text-[#c6287c]'}`}
        >
          Adoption Requests
        </Link>
        <Link 
          to="/ngo-abuse-reports" 
          className={`w-full py-3 text-center text-xl font-bold block ${path.includes('/ngo-abuse-reports') ? 'bg-[#c6287c] text-white' : 'bg-[#b5b5b5] text-[#c6287c]'}`}
        >
          Abuse Reports
        </Link>
        <Link 
          to="/ngo-notifications" 
          className={`w-full py-3 text-center text-xl font-bold block ${path === '/ngo-notifications' ? 'bg-[#c6287c] text-white' : 'bg-[#b5b5b5] text-[#c6287c]'}`}
        >
          Notifications
        </Link>
      </nav>

      <div className="mb-8 mt-auto">
        <button className="w-full py-3 bg-[#b5b5b5] text-[#d32f2f] text-xl font-bold">
          Logout
        </button>
      </div>
    </div>
  );
}
