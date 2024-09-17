import React, { useState, useEffect, useCallback } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getWorkRecordsByDateRange } from "../../../services/admin";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";

import { FaCalendarAlt, FaUserTie, FaBuilding } from "react-icons/fa";

function JobAssignmentsList() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [assignedRecords, setAssignedRecords] = useState([]);
  const [unassignedRecords, setUnassignedRecords] = useState([]);

  registerLocale("tr", tr);

  const fetchWorkRecords = useCallback(async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await getWorkRecordsByDateRange(
        formattedStartDate,
        formattedEndDate
      );

      if (response) {
        setAssignedRecords(response.assigned);
        setUnassignedRecords(response.unassigned);
      }
    } catch (error) {
      console.error("İş kayıtları alınamadı:", error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchWorkRecords();
  }, [fetchWorkRecords]);

  const handleDateChange = () => {
    fetchWorkRecords();
  };

  function calculateWorkingHours(startTime, endTime) {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff.toFixed(2) + " saat";
  }

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            İş Atamaları
          </h1>
          <p className="text-gray-600">
            Personel iş atamalarını ve çalışma saatlerini görüntüleyin.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-indigo-600" />
            Tarih Aralığı Seçin
          </h2>
          <div className="flex flex-wrap items-end space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                locale="tr"
                className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                locale="tr"
                className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleDateChange}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kayıtları Getir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUserTie className="mr-2 text-green-600" />
              Atanmış İş Kayıtları
            </h2>
            <div className="overflow-x-auto">
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
                      Başlangıç
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bitiş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Süre
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.personnel_id.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.company_id?.name || "Belirtilmedi"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.job_start_time || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.job_end_time || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {calculateWorkingHours(
                          record.job_start_time,
                          record.job_end_time
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBuilding className="mr-2 text-yellow-600" />
              Atanmamış İş Kayıtları
            </h2>
            <div className="overflow-x-auto">
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
                        {record.personnel_id.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default JobAssignmentsList;
