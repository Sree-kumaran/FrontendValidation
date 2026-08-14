import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={closeMobileSidebar} />

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;