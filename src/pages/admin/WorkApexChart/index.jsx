import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { generateChartOptions2 } from "../../../utils/apexChart"; // Dinamik chart options fonksiyonu
import {
  getWorkRecordsByDateRange,
  getAllUsers,
} from "../../../services/admin";
import { FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminWorkUsageChart = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [workData, setWorkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Çalışma ve mesai saatlerini hesaplayan fonksiyon
  function calculateTimeDifference(startTime, endTime) {
    if (!startTime || !endTime) return "0 saat 0 dakika";

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end - start;

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs} saat ${diffMins} dakika`;
  }

  // Kullanıcı iş verilerini getiren fonksiyon
  const fetchUserWorkData = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        const response = await getWorkRecordsByDateRange(
          formattedStartDate,
          formattedEndDate
        );

        if (response && response.assigned) {
          const userJobs = response.assigned.filter(
            (assignment) => assignment.personnel_id._id === userId
          );

          if (userJobs.length > 0) {
            const jobDetails = userJobs.map((job) => ({
              companyName: job.company_id.name,
              jobName:
                job.company_id.jobs.find((j) => j._id === job.job_id)
                  ?.jobName || "Bilinmeyen İş",
              workHours: calculateTimeDifference(
                job.job_start_time,
                job.job_end_time
              ),
              overtimeHours: calculateTimeDifference(
                job.overtime_hours?.start_time,
                job.overtime_hours?.end_time
              ),
            }));

            setWorkData(jobDetails);
          } else {
            toast.info("Seçilen kullanıcı için iş ataması bulunmuyor.");
            setWorkData(null);
          }
        } else {
          toast.error("Geçersiz API yanıtı alındı.");
          setWorkData(null);
        }
      } catch (error) {
        console.error("İş verileri alınırken hata oluştu:", error);
        toast.error("İş verileri alınamadı.");
        setWorkData(null);
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate]
  );

  // Kullanıcıları getiren fonksiyon
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success && response.data.length > 0) {
        setUsers(response.data);
      } else {
        toast.info("Henüz kullanıcı bulunmuyor.");
      }
    } catch (error) {
      console.error("Kullanıcıları alırken hata oluştu:", error);
      toast.error("Kullanıcılar alınamadı.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserWorkData(selectedUser);
    }
  }, [selectedUser, fetchUserWorkData]);

  // Grafik verilerini hazırlama
  const chartSeries = workData
    ? [
        {
          name: "Çalışma Saatleri",
          data: workData.map((job) => parseFloat(job.workHours.split(" ")[0])), // Sadece saat değerini alıp grafikte kullanıyoruz
        },
        {
          name: "Mesai Saatleri",
          data: workData.map((job) =>
            parseFloat(job.overtimeHours.split(" ")[0])
          ), // Sadece saat değerini alıp grafikte kullanıyoruz
        },
      ]
    : [];

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b-2 border-indigo-300 pb-2">
          <FaChartBar className="inline-block mr-2" />
          Kullanıcı İş Atamaları Analizi
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Kullanıcı Seçme */}
          <div className="bg-white p-4 rounded-lg shadow">
            <label
              htmlFor="userSelect"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Kullanıcı Seçin
            </label>
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition duration-150 ease-in-out"
            >
              <option value="">Kullanıcı seçin</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tarih Aralığı Seçme */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tarih Aralığı
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Başlangıç
                </label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition duration-150 ease-in-out"
                    dateFormat="yyyy-MM-dd"
                  />
                  <FaCalendarAlt className="absolute right-3 top-2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bitiş
                </label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition duration-150 ease-in-out"
                    dateFormat="yyyy-MM-dd"
                  />
                  <FaCalendarAlt className="absolute right-3 top-2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Gösterimi */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : workData ? (
            <ReactApexChart
              options={generateChartOptions2(workData)}
              series={chartSeries}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-center text-gray-600 py-16">
              Lütfen bir kullanıcı ve tarih aralığı seçin
            </p>
          )}
        </div>
      </div>
    </AdminDashboardlayout>
  );
};

export default AdminWorkUsageChart;
