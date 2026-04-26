import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const adminRaw = localStorage.getItem("admin");
  const admin = adminRaw ? JSON.parse(adminRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-transparent text-slate-800">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar admin={admin} onLogout={handleLogout} />

        <main className="flex-1 px-6 pb-6 pt-4 md:px-8 md:pb-8 md:pt-6">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;