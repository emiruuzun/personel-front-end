import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { leaveGet } from "../../../services/leave";
import { useNotifications } from "../../../context/NotificationContext";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const LeaveRequestsPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setLeaveNotifications } = useNotifications();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await leaveGet();
        if (response.success) {
          setLeaveRequests(response.data);
          setLeaveNotifications([]);
        }
      } catch (error) {
        console.error("İzin talepleri alınırken hata oluştu:", error);
        toast.error("İzin talepleri alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [setLeaveNotifications]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socket.on("leaveStatusUpdated", (newLeave) => {
      setLeaveRequests((prevLeave) => [newLeave, ...prevLeave]);
    });

    return () => {
      socket.off("leaveStatusUpdated");
    };
  }, []);

  const LeaveCard = ({ leave }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{leave.leaveType}</h3>
        <span
          className={`py-1 px-3 rounded-full text-xs font-semibold ${
            leave.status === "Onaylandı"
              ? "bg-green-200 text-green-700"
              : leave.status === "Reddedildi"
              ? "bg-red-200 text-red-700"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {leave.status || "Beklemede"}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        Başlangıç: {new Date(leave.startDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        Bitiş: {new Date(leave.endDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">İzin Günleri: {leave.leaveDays}</p>
      {leave.status === "Reddedildi" && leave.rejectionReason && (
        <p className="text-sm text-red-600 mt-2">
          Reddetme Nedeni: {leave.rejectionReason}
        </p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl font-semibold text-gray-700">Yükleniyor...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold border-b-2 border-gray-200 pb-4 text-indigo-500 text-center mb-6">
            İzin Taleplerim
          </h2>
          {leaveRequests.length === 0 ? (
            <div className="text-center text-gray-500">
              Henüz bir izin talebiniz yok.
            </div>
          ) : (
            <>
              {/* Mobile view */}
              <div className="md:hidden">
                {leaveRequests.map((leave) => (
                  <LeaveCard key={leave._id} leave={leave} />
                ))}
              </div>

              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b text-left">
                        İzin Türü
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        Başlangıç Tarihi
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        Bitiş Tarihi
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        İzin Günleri
                      </th>
                      <th className="py-3 px-4 border-b text-left">Durum</th>
                      <th className="py-3 px-4 border-b text-left">
                        Reddetme Nedeni
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((leave) => (
                      <tr
                        key={leave._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="py-2 px-4 border-b">
                          {leave.leaveType}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {leave.leaveDays}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-semibold ${
                              leave.status === "Onaylandı"
                                ? "bg-green-200 text-green-700"
                                : leave.status === "Reddedildi"
                                ? "bg-red-200 text-red-700"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {leave.status || "Beklemede"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">
                          {leave.status === "Reddedildi" &&
                          leave.rejectionReason
                            ? leave.rejectionReason
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaveRequestsPage;
