import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { adminItem } from "../utils/AdminItem";
import { logoutUser } from "../services/auth";
import {
  FaBox,
  FaSignOutAlt,
  FaUserCircle,
  FaUserCog,
  FaBars,
  FaBuilding,
  FaClipboardList,
  FaChartBar,
  FaBullhorn,
  FaCalendarCheck,
  FaUserPlus,
} from "react-icons/fa";

function AdminDashboardLayout({ children }) {
  const navigate = useNavigate();
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
      case "Profil":
        return <FaUserCircle className="mr-2" />;
      case "Kullanıcı Kaydı":
        return <FaUserPlus className="mr-2" />;
      case "Firma Kaydı":
        return <FaBuilding className="mr-2" />;
      case "Personel İş Takibi":
        return <FaClipboardList className="mr-2" />;
      case "İş Atama Listesi":
        return <FaClipboardList className="mr-2" />;
      case "Kullanıcı Ayarları":
        return <FaUserCog className="mr-2" />;
      case "Kullanıcı İzin Listesi":
        return <FaCalendarCheck className="mr-2" />;
      case "Duyuru":
        return <FaBullhorn className="mr-2" />;
      case "Kullanım Grafiği":
        return <FaChartBar className="mr-2" />;
      default:
        return <FaBox className="mr-2" />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">Admin Menü</h1>
        <button onClick={toggleSidebar} className="text-white">
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-full md:w-64 bg-gray-900 text-white shadow-lg ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-indigo-400 hidden md:block">
            Admin Menü
          </h1>
          <ul className="space-y-4 mt-6">
            {adminItem.map((section) => (
              <li key={section.name} className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {section.name}
                </div>
                <ul className="space-y-2 mt-2">
                  {section.items.map((item) => (
                    <li
                      key={item.slug}
                      className="flex items-center bg-gray-800 p-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                      {getIcon(item.name)}
                      <NavLink
                        to={`/${item.slug}`}
                        className={({ isActive }) =>
                          `block text-gray-200 hover:text-gray-300 transition-colors duration-200 ${
                            isActive ? "text-indigo-400" : ""
                          }`
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
            className="flex items-center mt-8 md:mt-20 text-gray-200 hover:text-gray-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 rounded-lg overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;
