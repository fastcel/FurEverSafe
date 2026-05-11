import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex w-screen min-h-screen bg-[#f0ebe0] overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">{children}</main>
    </div>
  );
}
