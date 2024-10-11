import React, { useState, useEffect, useCallback } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getWorkRecordsByDateRange } from "../../../services/admin";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import {
  FaCalendarAlt,
  FaUserTie,
  FaBuilding,
  FaSearch,
  FaChevronDown,
  FaSpinner,
} from "react-icons/fa";

function JobAssignmentsList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignedRecords, setAssignedRecords] = useState([]);
  const [unassignedRecords, setUnassignedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  registerLocale("tr", tr);

  const fetchWorkRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const response = await getWorkRecordsByDateRange(
        formattedDate,
        formattedDate
      );

      if (response) {
        setAssignedRecords(response.assigned);
        setUnassignedRecords(response.unassigned);
      }
    } catch (error) {
      console.error("İş kayıtları alınamadı:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchWorkRecords();
  }, [fetchWorkRecords]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function calculateTotalWorkingHoursWithBreak(record) {
    const startTime = record.job_start_time;
    const endTime = record.job_end_time;

    if (!startTime || !endTime) return "0 saat 0 dakika";

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    let workingHours = calculateTimeDifference(startTime, endTime);

    if (startHour < 13 && endHour > 12) {
      // Öğle molası ekleniyor
      const [workHrs, workMins] = workingHours
        .split(" saat ")
        .map((v) => parseInt(v) || 0);
      const totalMinutes = workHrs * 60 + workMins;
      const adjustedMinutes = totalMinutes - 60; // 1 saat yemek molası çıkarılıyor

      const adjustedHrs = Math.floor(adjustedMinutes / 60);
      const adjustedMins = adjustedMinutes % 60;

      workingHours = `${adjustedHrs} saat ${adjustedMins} dakika (1 saat yemek molası)`;
    }

    return workingHours;
  }

  function calculateTimeDifference(startTime, endTime) {
    if (!startTime || !endTime) return "0 saat 0 dakika";

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end - start;

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs} saat ${diffMins} dakika`;
  }

  function calculateTotalHours(record) {
    const startTime = record.job_start_time;
    const endTime = record.job_end_time;

    if (!startTime || !endTime) return "0 saat 0 dakika";

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    let workingHours = calculateTimeDifference(startTime, endTime);

    if (startHour < 13 && endHour > 12) {
      const [workHrs, workMins] = workingHours
        .split(" saat ")
        .map((v) => parseInt(v) || 0);
      const totalMinutes = workHrs * 60 + workMins;
      const adjustedMinutes = totalMinutes - 60; // 1 saat yemek molası düşülüyor

      const adjustedHrs = Math.floor(adjustedMinutes / 60);
      const adjustedMins = adjustedMinutes % 60;

      workingHours = `${adjustedHrs} saat ${adjustedMins} dakika`;
    }

    const overtimeHours = calculateTimeDifference(
      record.overtime_hours?.start_time,
      record.overtime_hours?.end_time
    );

    const [workHrs, workMins] = workingHours
      .split(" saat ")
      .map((v) => parseInt(v) || 0);
    const [overtimeHrs, overtimeMins] = overtimeHours
      .split(" saat ")
      .map((v) => parseInt(v) || 0);

    let totalHours = workHrs + overtimeHrs;
    let totalMinutes = workMins + overtimeMins;

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
    }

    return `${totalHours} saat ${totalMinutes} dakika`;
  }

  const filteredAssignedRecords = assignedRecords.filter(
    (record) =>
      record.personnel_id.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.company_id?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminDashboardlayout>
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      </AdminDashboardlayout>
    );
  }

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            İş Atamaları
          </h1>
          <p className="text-gray-600">
            Personel iş atamalarını ve çalışma saatlerini görüntüleyin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-indigo-600" />
            Tarih Seçin
          </h2>
          <div className="flex items-center space-x-4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="tr"
              className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Personel veya firma ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaUserTie className="mr-2" />
                  Atanmış İş Kayıtları
                </h2>
                <span className="text-sm bg-indigo-700 px-2 py-1 rounded">
                  Toplam: {filteredAssignedRecords.length}
                </span>
              </div>
              {/* Masaüstü için tablo görünümü */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Firma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam Süre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detaylar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssignedRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.personnel_id.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.company_id?.name || "Belirtilmedi"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {calculateTotalHours(record)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            Detaylar <FaChevronDown className="ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobil için kart görünümü */}
              <div className="md:hidden">
                {filteredAssignedRecords.map((record) => (
                  <div key={record._id} className="p-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {record.personnel_id.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.company_id?.name || "Belirtilmedi"}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                      >
                        Detaylar <FaChevronDown className="ml-1" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>Toplam Süre: {calculateTotalHours(record)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-yellow-500 text-white flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaBuilding className="mr-2" />
                  Atanmamış İş Kayıtları
                </h2>
                <span className="text-sm bg-yellow-600 px-2 py-1 rounded">
                  Toplam: {unassignedRecords.length}
                </span>
              </div>
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unassignedRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">
                            {record.personnel_id.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString("tr-TR")}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {selectedRecord && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-xl leading-6 font-bold text-indigo-700 mb-4">
                  {selectedRecord.personnel_id.name}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Firma:
                    </p>
                    <p className="text-lg text-indigo-600">
                      {selectedRecord.company_id?.name || "Belirtilmedi"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      İş:
                    </p>
                    <p className="text-lg text-indigo-600">
                      {selectedRecord.company_id?.jobs.find(
                        (job) => job._id === selectedRecord.job_id
                      )?.jobName || "Belirtilmedi"}
                    </p>
                  </div>

                  {/* Çalışma Saatleri */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Çalışma Saatleri:
                    </p>
                    <p className="text-lg text-indigo-600">
                      {selectedRecord.job_start_time} -{" "}
                      {selectedRecord.job_end_time}
                    </p>
                    <p className="text-md font-bold text-gray-800 mt-1">
                      Toplam:{" "}
                      {calculateTotalWorkingHoursWithBreak(selectedRecord)}
                    </p>
                  </div>

                  {/* Mesai Saatleri */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Mesai Saatleri:
                    </p>
                    {selectedRecord.overtime_hours?.start_time &&
                    selectedRecord.overtime_hours?.end_time ? (
                      <>
                        <p className="text-lg text-indigo-600">
                          {selectedRecord.overtime_hours.start_time} -{" "}
                          {selectedRecord.overtime_hours.end_time}
                        </p>
                        <p className="text-md font-bold text-gray-800 mt-1">
                          Toplam Mesai:{" "}
                          {calculateTimeDifference(
                            selectedRecord.overtime_hours.start_time,
                            selectedRecord.overtime_hours.end_time
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-gray-500">0 saat 0 dakika</p>
                    )}
                  </div>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    onClick={() => setSelectedRecord(null)}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardlayout>
  );
}

export default JobAssignmentsList;
