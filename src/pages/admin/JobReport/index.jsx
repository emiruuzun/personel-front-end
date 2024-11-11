import React, { useEffect, useState, useCallback } from "react";
import { fetchMonthlyReport } from "../../../services/admin";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  FaClock,
  FaUser,
  FaHourglass,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";

function JobReport() {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Tümü");

  const groups = [
    "Tümü",
    "Mekanik",
    "Boru",
    "Elektrik",
    "Aksaray",
    "Kapı",
    "Ofis",
    "Taşeron",
  ];

  const calculateWorkHours = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return { hours: 0, minutes: 0 };
    }

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    const start = new Date();
    start.setHours(parseInt(startHour), parseInt(startMinute));

    const end = new Date();
    end.setHours(parseInt(endHour), parseInt(endMinute));

    const diffMs = end - start;
    let diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    let diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (parseInt(startHour) < 13 && parseInt(endHour) > 12) {
      diffHrs -= 1;
    }

    return { hours: diffHrs, minutes: diffMins };
  };

  const groupAndSummarizeData = useCallback((data) => {
    const summary = {};

    data.forEach((record) => {
      const personnelId = record.personnel_id?._id;
      const personnelName = record.personnel_id?.name || "Bilinmiyor";
      const personnelGroup = record.personnel_id?.group || "Grup Yok";

      if (!summary[personnelId]) {
        summary[personnelId] = {
          name: personnelName,
          group: personnelGroup,
          totalWorkHours: 0,
          totalWorkMinutes: 0,
          totalOvertimeHours: 0,
          totalOvertimeMinutes: 0,
        };
      }

      const { hours: workHours, minutes: workMinutes } = calculateWorkHours(
        record.job_start_time,
        record.job_end_time
      );
      summary[personnelId].totalWorkHours += workHours;
      summary[personnelId].totalWorkMinutes += workMinutes;

      if (
        record.overtime_hours?.start_time &&
        record.overtime_hours?.end_time
      ) {
        const { hours: overtimeHours, minutes: overtimeMinutes } =
          calculateWorkHours(
            record.overtime_hours.start_time,
            record.overtime_hours.end_time
          );
        summary[personnelId].totalOvertimeHours += overtimeHours;
        summary[personnelId].totalOvertimeMinutes += overtimeMinutes;
      }
    });

    Object.keys(summary).forEach((personnelId) => {
      const extraWorkHours = Math.floor(
        summary[personnelId].totalWorkMinutes / 60
      );
      summary[personnelId].totalWorkHours += extraWorkHours;
      summary[personnelId].totalWorkMinutes %= 60;

      const extraOvertimeHours = Math.floor(
        summary[personnelId].totalOvertimeMinutes / 60
      );
      summary[personnelId].totalOvertimeHours += extraOvertimeHours;
      summary[personnelId].totalOvertimeMinutes %= 60;
    });

    return Object.values(summary);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await fetchMonthlyReport(selectedMonth + 1, selectedYear);
        if (data) {
          const groupedData = groupAndSummarizeData(data);
          setReportData(groupedData);
          setFilteredData(groupedData);
        } else {
          setReportData([]);
          setFilteredData([]);
          toast.info("Gösterilecek rapor verisi yok.");
        }
      } catch (error) {
        console.error("Raporlama verisi çekilemedi:", error);
        toast.error("Raporlama verisi çekilemedi");
        setReportData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [groupAndSummarizeData, selectedMonth, selectedYear]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    filterData(value, selectedGroup);
  };

  const filterData = (searchTerm, group) => {
    let filtered = reportData;

    if (searchTerm) {
      filtered = filtered.filter((record) =>
        record.name.toLowerCase().includes(searchTerm)
      );
    }

    if (group !== "Tümü") {
      filtered = filtered.filter((record) => record.group === group);
    }

    setFilteredData(filtered);
  };

  const handleGroupChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    filterData(searchTerm, group);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  if (loading) {
    return (
      <AdminDashboardlayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminDashboardlayout>
    );
  }

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h1 className="text-3xl font-bold text-white text-center">
                Aylık Raporlama
              </h1>
            </div>
            <div className="p-6">
              <div className="flex justify-center space-x-4 mb-6">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık",
                  ].map((month, index) => (
                    <option
                      key={index}
                      value={index}
                      disabled={
                        selectedYear === currentYear && index > currentMonth
                      }
                    >
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(3)].map((_, i) => {
                    const year = currentYear - 2 + i;
                    return (
                      <option
                        key={i}
                        value={year}
                        disabled={year > currentYear}
                      >
                        {year}
                      </option>
                    );
                  })}
                </select>
                <select
                  value={selectedGroup}
                  onChange={handleGroupChange}
                  className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative w-1/2 max-w-lg">
                  <input
                    type="text"
                    placeholder="Personel adına göre ara..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
                  />
                  <FaSearch className="absolute top-2.5 left-3 text-gray-500" />
                </div>
              </div>

              {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((record, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <FaUser className="text-blue-500 mr-3 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {record.name}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaClock className="text-green-500 mr-2" />
                          <span className="text-gray-600">
                            Çalışma: {record.totalWorkHours} saat{" "}
                            {record.totalWorkMinutes} dk
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaHourglass className="text-orange-500 mr-2" />
                          <span className="text-gray-600">
                            Mesai: {record.totalOvertimeHours} saat{" "}
                            {record.totalOvertimeMinutes} dk
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FaCalendarAlt className="text-6xl mx-auto mb-4 text-blue-500" />
                  <p className="text-xl">Bu ay için rapor verisi bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default JobReport;
