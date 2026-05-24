import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
// We use the exact PascalCase exports that Lucide provides
import {
  BookOpen,
  Bell,
  ChartBar,
  User,
  Shield,
  LogOut,
  Trees,
  BookCopy,
  Menu,
  X
} from "lucide-react";
import "./sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logic for role detection
  const userString = localStorage.getItem("user");
  const userInfo = userString ? JSON.parse(userString) : { role: "admin", name: "emily" }; 
  const isAdmin = userInfo.role?.toLowerCase() === "admin";

  const navItems = isAdmin ? [
    { label: "course management", path: "/admin/courses", icon: BookOpen },
    { label: "park guides", path: "/admin/users", icon: User },
    { label: "training overview", path: "/admin/trainingoverview", icon: ChartBar },
    { label: "guide badges", path: "/admin/badges", icon: BookOpen },
    { label: "alert monitoring", path: "/admin/alerts", icon: Bell },
    { label: "notifications", path: "/admin/notifications", icon: Bell },
    
    { label: "device management", path: "/admin/device", icon: Shield },
    { label: "admin profile", path: "/admin/profile", icon: User },
    
  ] : [
    { label: "courses", path: "/guide/courses", icon: BookCopy },
    { label: "my progress", path: "/guide/progress", icon: ChartBar },
    { label: "alerts", path: "/guide/alerts", icon: Bell },
    { label: "notifications", path: "/guide/notifications", icon: Bell },
    { label: "profile", path: "/guide/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <button className="mobile-burger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div className="sidebar-overlay"></div>}

      <aside 
        ref={sidebarRef}
        className={`sarakway-sidebar ${isOpen ? "open" : ""} ${isAdmin ? "admin-theme" : "guide-theme"}`}
      >
        <div className="sidebar-header">
          <div className="brand-logo">
            <img src={logo} alt="logo" width={24} />
          </div>
          <div className="brand-text">
            <h2>sarakway</h2>
            <p>{isAdmin ? "administration portal" : "park guide portal"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">
            {isAdmin ? "management" : "learning menu"}
          </div>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}