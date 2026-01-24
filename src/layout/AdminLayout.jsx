import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import Cookies from "js-cookie";
import { 
  LayoutDashboard, Home, Layers, Briefcase, Phone, 
  FolderRoot, Info, Cpu, Users, Presentation, 
  FileText, HelpCircle, MessageSquare, UserCircle, 
  Settings, LogOut, ChevronLeft, Menu, X, Inbox
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const session = Cookies.get("adminSession");
    if (!session) navigate("/admin");
  }, [navigate]);

  // Organized by Operational Priority
  const menuGroups = [
    {
      group: "Core",
      items: [
        // { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
        { name: "Feedback", icon: <Inbox size={20} />, path: "/admin/feedback-page" },
      ]
    },
    {
      group: "Page Management",
      items: [
        { name: "Home Page", icon: <Home size={20} />, path: "/admin/home-page" },
        { name: "About Us", icon: <Info size={20} />, path: "/admin/aboutus-page" },
        { name: "Service Page", icon: <Layers size={20} />, path: "/admin/service-page" },
        { name: "Industry Page", icon: <Briefcase size={20} />, path: "/admin/industry-page" },
        { name: "Contact Page", icon: <Phone size={20} />, path: "/admin/contact-page" },
      ]
    },
    {
      group: "Content & Media",
      items: [
        { name: "Projects", icon: <Presentation size={20} />, path: "/admin/projects-page" },
        // { name: "Our Work", icon: <FolderRoot size={20} />, path: "/admin/ourwork-page" },
        { name: "Case Study", icon: <FileText size={20} />, path: "/admin/casestudy-page" },
        { name: "Technology", icon: <Cpu size={20} />, path: "/admin/technology-page" },
      ]
    },
    {
      group: "Engagement",
      items: [
        { name: "Staff", icon: <Users size={20} />, path: "/admin/staff-page" },
        { name: "Team", icon: <UserCircle size={20} />, path: "/admin/team-page" },
        { name: "Testimonials", icon: <MessageSquare size={20} />, path: "/admin/testimonial-page" },
        { name: "FAQS", icon: <HelpCircle size={20} />, path: "/admin/faqs-page" },
      ]
    },
    {
      group: "Configuration",
      items: [
        { name: "Footer", icon: <Settings size={20} />, path: "/admin/footer" },
      ]
    }
  ];

  const activeLinkClass = "bg-[#003eb3] text-white shadow-md shadow-blue-200";
  const normalLinkClass = "text-slate-600 hover:bg-slate-100 hover:text-[#003eb3]";

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-[Quicksand]">
      {/* Desktop Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 hidden md:flex flex-col z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
          {sidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-[#002b80] to-[#0056ff] bg-clip-text text-transparent">
              Hexa Admin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-[#002b80] transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              {sidebarOpen && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group ${
                        isActive ? activeLinkClass : normalLinkClass
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <span className="text-xl font-bold text-[#002b80]">Hexa Admin</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-slate-500"><X /></button>
            </div>
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">{group.group}</p>
                {group.items.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl mb-1 ${isActive ? activeLinkClass : normalLinkClass}`
                    }
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {menuGroups.flatMap(g => g.items).find(i => i.path === location.pathname)?.name || "Hexa Insights"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">Admin User</span>
              <span className="text-[10px] text-green-500 font-medium">System Online</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-bold transition-all border border-slate-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}