import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { menuItem } from "../utils/MenuItem";
import { useNotifications } from "../context/NotificationContext";
import { logoutUser } from "../services/auth";
import {
  FaBox,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { notifications, leaveNotifications } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getIcon = (name) => {
    switch (name) {
      case "Profile":
        return <FaUserCircle className="mr-2" />;
      case "Feed":
        return (
          <div className="relative mr-2">
            <FaBell />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
        );
      case "All Leave":
        return (
          <div className="relative mr-2">
            <FaBell />
            {leaveNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {leaveNotifications.length}
              </span>
            )}
          </div>
        );
      default:
        return <FaBox className="mr-2" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-indigo-500">Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-80 bg-gray-900 text-white shadow-lg overflow-y-auto`}
      >
        <div className="p-6">
          <h1 className="hidden md:block text-3xl font-extrabold mb-8 border-b border-gray-700 pb-4 text-indigo-500">
            Dashboard
          </h1>
          <ul className="space-y-6">
            {menuItem.map((section) => (
              <li key={section.name} className="mb-6">
                <div className="text-lg font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  {section.name}
                </div>
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item.slug} className="flex items-center mb-2">
                      {getIcon(item.name)}
                      <NavLink
                        to={`/${item.slug}`}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-indigo-600 text-indigo-100 py-2 px-4 rounded-lg w-full"
                            : "text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 w-full"
                        }
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-gray-400 transition-colors duration-200 mt-4 w-full py-2 px-4 rounded-lg hover:bg-gray-800"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 p-4 md:m-6 md:p-10 rounded-xl shadow-xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
