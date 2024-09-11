import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { chartOptions, generateChartSeries } from "../../../utils/apexChart";
import { getAllLeave, getAllUsers } from "../../../services/admin";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminLeaveUsageChart = () => {
  const [users, setUsers] = useState([]); // Kullanıcıları tutar
  const [selectedUser, setSelectedUser] = useState(""); // Seçili kullanıcı ID'sini tutar
  const [leaveData, setLeaveData] = useState(null); // Seçilen kullanıcının izin verilerini tutar

  // Kullanıcının izin verilerini güncelleme fonksiyonu
  const fetchUserLeaveData = useCallback(
    async (userId) => {
      try {
        const response = await getAllLeave(); // Tüm izin taleplerini getir
        if (response.success && response.data.length > 0) {
          const userLeaves = response.data.filter(
            (leave) => leave.userId._id === userId
          ); // Sadece seçilen kullanıcıya ait izinleri filtrele

          const leaveTypes = {
            "Yıllık İzin": 0,
            "Mazeret İzni": 0,
            "Hastalık İzni": 0,
          };

          userLeaves.forEach((leave) => {
            if (leave.status === "Onaylandı") {
              leaveTypes[leave.leaveType] += leave.leaveDays;
            }
          });

          setLeaveData(leaveTypes);
        } else {
          toast.info("Henüz herhangi bir izin talebi bulunmuyor.");
        }
      } catch (error) {
        console.error("İzin verileri alınırken hata oluştu:", error);
        toast.error("İzin verileri alınamadı.");
      }
    },
    [] // Bağımlılık dizisi boş çünkü her çağrıldığında API'den veri çekecek
  );

  // Tüm kullanıcıları getiren ve select box'ı dolduran fonksiyon
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(); // Tüm kullanıcıları getir
      if (response.success && response.data.length > 0) {
        setUsers(response.data); // Kullanıcıları state'e kaydet
      } else {
        toast.info("Henüz kullanıcı bulunmuyor.");
      }
    } catch (error) {
      console.error("Kullanıcıları alırken hata oluştu:", error);
      toast.error("Kullanıcılar alınamadı.");
    }
  };

  // İlk sayfa yüklemesinde kullanıcıları getir
  useEffect(() => {
    fetchUsers();
  }, []);

  // Kullanıcı seçildiğinde izin verilerini getiren useEffect
  useEffect(() => {
    if (selectedUser) {
      fetchUserLeaveData(selectedUser); // Kullanıcı seçildiğinde izin verilerini getir
    }
  }, [selectedUser, fetchUserLeaveData]);
  const chartSeries = generateChartSeries(leaveData);
  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Kullanıcı İzin Dağılımı
        </h2>
        <div className="mb-4">
          <label
            htmlFor="userSelect"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kullanıcı Seçin
          </label>
          <div className="relative">
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="">Kullanıcı seçin</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaUserCircle className="fill-current h-4 w-4" />
            </div>
          </div>
        </div>
        {leaveData ? (
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        ) : (
          <p className="text-center text-gray-600">
            Lütfen bir kullanıcı seçin
          </p>
        )}
      </div>
    </AdminDashboardlayout>
  );
};

export default AdminLeaveUsageChart;
