import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie } from "./utils/cookie-manager";
import { decodeToken } from "./utils/decoded-token";
import PropTypes from "prop-types";
import { useNotifications } from "./context/NotificationContext";
import { useUser } from "./context/UserContext";

// User Pages
import Anasayfa from "./pages/Anasayfa";
import Giris from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import ProfilePage from "./pages/Dashboard/Profile/index";
import FeedPage from "./pages/Dashboard/Feed";
import LeaveRequestForm from "./pages/Dashboard/LevaRequest";
import LeaveRequestsPage from "./pages/Dashboard/LeaveGet";

// Admin Pages
import AdminAnasayfa from "./pages/admin/anasayfa";
import PersonelRegister from "./pages/admin/PersonelRegister";
import AdminProfilePage from "./pages/admin/profile";
import GetAllUsers from "./pages/admin/UserDelete";
import AnnouncementPage from "./pages/admin/Announcement";
import AdminLeaveRequests from "./pages/admin/AllLeave";
import AdminLeaveUsageChart from "./pages/admin/ApexChartLeave";
import CompanyRegisterPage from "./pages/admin/CompanyRegister";
import PersonnelJobTrackingPage from "./pages/admin/PersonnelJobTracking";
import JobAssignmentsList from "./pages/admin/JobAssignmentsList";
import AdminWorkUsageChart from "./pages/admin/WorkApexChart";
import JobReport from "./pages/admin/JobReport";

// Socket.IO
import { io } from "socket.io-client";

// Asenkron `userRole` Fonksiyonu
const userRole = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = getCookie("access_token");
      if (!token) {
        console.warn("access_token bulunamadı");
        resolve(null);
        return;
      }
      const decodedToken = decodeToken(token);
      resolve(decodedToken ? decodedToken.role : null);
    }, 100); // 100ms gecikme
  });
};


// Private Route
function PrivateRoute({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      const role = await userRole();
      setRole(role);
      setIsLoading(false);
    };
    fetchRole();
  }, []);

  if (isLoading) {
    return <div>Yükleniyor...</div>; // Bir yükleniyor ekranı gösterebilirsiniz
  }

  if (!role) {
    return <Navigate to="/giris" replace state={{ from: location }} />;
  }

  return children;
}

// Public Route
function PublicRoute({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      const role = await userRole();
      setRole(role);
      setIsLoading(false);
    };
    fetchRole();
  }, []);

  if (isLoading) {
    return <div>Yükleniyor...</div>; // Bir yükleniyor ekranı gösterebilirsiniz
  }

  if (role) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
}

// Admin Route
function AdminRoute({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      const role = await userRole();
      setRole(role);
      setIsLoading(false);
    };
    fetchRole();
  }, []);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (role !== "admin") {
    return <Navigate to="/giris" replace state={{ from: location }} />;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { setNotifications, setLeaveNotifications } = useNotifications();
  const { user } = useUser();

  // Duyurular için socket.io bağlantısı
  useEffect(() => {
    const { REACT_APP_SOCKET_URL } = process.env;
    const socket = io(REACT_APP_SOCKET_URL);

    socket.on("announcement", (announcement) => {
      setNotifications((prev) => [...prev, announcement]);
    });

    return () => {
      socket.off("announcement");
    };
  }, [setNotifications]);

  // Kullanıcı izin bildirimleri için socket.io
  useEffect(() => {
    const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

    if (userId) {
      const { REACT_APP_SOCKET_URL } = process.env;
      const socket = io(REACT_APP_SOCKET_URL, {
        query: { userId },
      });

      socket.on("leaveStatusUpdated", (data) => {
        setLeaveNotifications((prev) => [...prev, data]);
        toast.info(data.message);
      });

      return () => {
        socket.off("leaveStatusUpdated");
      };
    }
  }, [user, setLeaveNotifications]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Anasayfa />
            </PublicRoute>
          }
        />
        <Route
          path="/giris"
          element={
            <PublicRoute>
              <Giris />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/feed"
          element={
            <PrivateRoute>
              <FeedPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/leave"
          element={
            <PrivateRoute>
              <LeaveRequestForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/leave-get"
          element={
            <PrivateRoute>
              <LeaveRequestsPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminAnasayfa />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personel-register"
          element={
            <AdminRoute>
              <PersonelRegister />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/company-register"
          element={
            <AdminRoute>
              <CompanyRegisterPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personel-job"
          element={
            <AdminRoute>
              <PersonnelJobTrackingPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personnel-assignments"
          element={
            <AdminRoute>
              <JobAssignmentsList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/getallusers"
          element={
            <AdminRoute>
              <GetAllUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/Announcement"
          element={
            <AdminRoute>
              <AnnouncementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/allLeave"
          element={
            <AdminRoute>
              <AdminLeaveRequests />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/job-reports"
          element={
            <AdminRoute>
              <JobReport />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usage-chart"
          element={
            <AdminRoute>
              <AdminLeaveUsageChart />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/work-chart"
          element={
            <AdminRoute>
              <AdminWorkUsageChart />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
