import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[260px] h-screen fixed left-0 top-0 overflow-hidden">
        <Sidebar />
      </aside>

      <main className="flex-1 ml-[260px] h-screen overflow-y-auto overflow-x-hidden bg-[#f0ebe0]">
        {children}
      </main>
    </div>
  );
}
