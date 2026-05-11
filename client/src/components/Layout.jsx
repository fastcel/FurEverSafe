import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f4f1ea]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}