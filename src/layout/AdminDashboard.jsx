import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { adminItem } from "../utils/AdminItem";
import { logoutUser } from "../services/auth";
import {
  FaSignOutAlt,
  FaBars,
  FaAngleRight,
  FaUserCircle,
  FaUsersCog,
  FaClipboardList,
  FaBuilding,
  FaChartBar,
  FaBullhorn,
  FaHome,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Kategori ikonlarını tanımlayalım
const categoryIcons = {
  Profil: FaUserCircle,
  "Personel Yönetimi": FaUsersCog,
  "İş Yönetimi": FaClipboardList,
  "Firma Yönetimi": FaBuilding,
  Analizler: FaChartBar,
  İletişim: FaBullhorn,
};

function AdminDashboardLayout({ children }) {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      setIsSidebarOpen(!smallScreen);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button for Small Screens */}
      {isSmallScreen && !isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 bg-gray-900 text-white p-2 rounded-md"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isSidebarOpen ? (isSmallScreen ? "100%" : "16rem") : "0rem",
          x: isSidebarOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-30 bg-gray-900 text-white shadow-lg overflow-hidden ${
          isSmallScreen ? "w-full" : "md:relative"
        }`}
      >
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <NavLink
                    to="/"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    <FaHome size={24} />
                  </NavLink>
                  <h1 className="text-xl font-bold text-indigo-400 hidden md:block">
                    Admin Panel
                  </h1>
                </div>
                {isSmallScreen && (
                  <button onClick={toggleSidebar} className="text-white">
                    <FaTimes size={24} />
                  </button>
                )}
              </div>
              <nav className="flex-grow space-y-6">
                {adminItem.map((section) => (
                  <div key={section.name} className="mb-4">
                    <button
                      onClick={() => toggleSection(section.name)}
                      className="flex items-center justify-between w-full text-left font-semibold text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-md hover:bg-gray-800"
                    >
                      <span className="flex items-center">
                        {categoryIcons[section.name] &&
                          React.createElement(categoryIcons[section.name], {
                            className: "mr-3",
                            size: 20,
                          })}
                        {section.name}
                      </span>
                      <FaAngleRight
                        className={`transform transition-transform duration-200 ${
                          expandedSections[section.name] ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedSections[section.name] && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 space-y-2 ml-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.slug}>
                              <NavLink
                                to={`/${item.slug}`}
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    isActive
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                  }`
                                }
                              >
                                {item.icon && <item.icon className="mr-3" />}
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;