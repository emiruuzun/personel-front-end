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

  return (
    <DashboardLayout>
      {loading ? ( // Loading kontrolünü DashboardLayout içinde tutarak kullanıcıya daha iyi bir geri bildirim sağlarız
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl font-semibold text-gray-700">Yükleniyor...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-extrabold border-b-2 border-gray-200 pb-4 text-indigo-500 text-center mb-6">
            İzin Taleplerim
          </h2>
          {leaveRequests.length === 0 ? (
            <div className="text-center text-gray-500">
              Henüz bir izin talebiniz yok.
            </div>
          ) : (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left">İzin Türü</th>
                  <th className="py-3 px-4 border-b text-left">
                    Başlangıç Tarihi
                  </th>
                  <th className="py-3 px-4 border-b text-left">Bitiş Tarihi</th>
                  <th className="py-3 px-4 border-b text-left">İzin Günleri</th>
                  <th className="py-3 px-4 border-b text-left">Durum</th>
                  <th className="py-3 px-4 border-b text-left">
                    Reddetme Nedeni
                  </th>{" "}
                  {/* Yeni sütun eklendi */}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-2 px-4 border-b">{leave.leaveType}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{leave.leaveDays}</td>
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
                      {leave.status === "Reddedildi" && leave.rejectionReason
                        ? leave.rejectionReason
                        : "-"}{" "}
                      {/* Reddetme nedeni */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaveRequestsPage;
