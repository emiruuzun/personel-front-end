import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
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

// Sokcet İo
import { io } from "socket.io-client";

const userRole = () => {
  const token = getCookie("access_token");
  if (!token) {
    return null;
  }

  const decodedToken = decodeToken(token);
  return decodedToken ? decodedToken.role : null;
};

function PrivateRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (!role) {
    return <Navigate to="/giris" replace state={{ from }} />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace state={{ from }} />;
  }

  return children;
}

function PublicRoute({ children }) {
  const from = useLocation().state;

  if (userRole()) {
    return <Navigate to="/dashboard" replace state={{ from }} />;
  }

  return children;
}

function AdminRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (role !== "admin") {
    return <Navigate to="/giris" replace state={{ from }} />;
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
  const { setNotifications } = useNotifications();
  const { setLeaveNotifications } = useNotifications();
  const { user } = useUser();

  useEffect(() => {
    const { REACT_APP_SOCKET_URL } = process.env;
    const socket = io(REACT_APP_SOCKET_URL);
    socket.on("announcement", (announcement) => {
      setNotifications((prev) => [...prev, announcement]);
      // Bildirimleri başka bir komponentte göstermek için state'i güncelliyoruz.
    });

    return () => {
      socket.off("announcement");
    };
  }, [setNotifications]);

  useEffect(() => {
    let userId;

    if (user) {
      userId = user.id;
    } else {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser && JSON.parse(storedUser);
      userId = parsedUser ? parsedUser.id : null;
    }

    if (userId) {
      const { REACT_APP_SOCKET_URL } = process.env;
      const socket = io(REACT_APP_SOCKET_URL, {
        query: { userId: userId },
      });

      socket.on("leaveStatusUpdated", (data) => {
        console.log("appJs Data", data);

        // Bildirimi backend'den gelen mesaj ile güncelleyin
        setLeaveNotifications((prev) => [...prev, data]);

        // Gelen data.message'ı kullanarak bildirim mesajını göster
        toast.info(data.message);
      });

      return () => {
        socket.off("leaveStatusUpdated");
      };
    }
  }, [user, setLeaveNotifications]); //

  return (
    <>
      <Routes>
        {/* Public Route */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <Anasayfa></Anasayfa>
            </PublicRoute>
          }
        />
        <Route
          path="/giris"
          element={
            <PublicRoute>
              <Giris></Giris>
            </PublicRoute>
          }
        />

        {/* Private Route */}
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
              <ProfilePage></ProfilePage>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/feed"
          element={
            <PrivateRoute>
              <FeedPage></FeedPage>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/leave"
          element={
            <PrivateRoute>
              <LeaveRequestForm></LeaveRequestForm>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/leave-get"
          element={
            <PrivateRoute>
              <LeaveRequestsPage></LeaveRequestsPage>
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminAnasayfa></AdminAnasayfa>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage></AdminProfilePage>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personel-register"
          element={
            <AdminRoute>
              <PersonelRegister></PersonelRegister>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/company-register"
          element={
            <AdminRoute>
              <CompanyRegisterPage></CompanyRegisterPage>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personel-job"
          element={
            <AdminRoute>
              <PersonnelJobTrackingPage></PersonnelJobTrackingPage>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/personnel-assignments"
          element={
            <AdminRoute>
              <JobAssignmentsList></JobAssignmentsList>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/getallusers"
          element={
            <AdminRoute>
              <GetAllUsers></GetAllUsers>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/Announcement"
          element={
            <AdminRoute>
              <AnnouncementPage></AnnouncementPage>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/allLeave"
          element={
            <AdminRoute>
              <AdminLeaveRequests></AdminLeaveRequests>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/job-reports"
          element={
            <AdminRoute>
              <JobReport></JobReport>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usage-chart"
          element={
            <AdminRoute>
              <AdminLeaveUsageChart></AdminLeaveUsageChart>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/work-chart"
          element={
            <AdminRoute>
              <AdminWorkUsageChart></AdminWorkUsageChart>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
