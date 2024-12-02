import React, { useEffect, useState, useCallback } from "react";
import { fetchMonthlyReport } from "../../../services/admin";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  FaClock,
  FaUser,
  FaHourglass,
  FaCalendarAlt,
  FaSearch,
  FaCalendarCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// PersonnelCard Bileşeni
const PersonnelCard = ({ record }) => {
  const tabs = [
    { name: "Genel", icon: FaUser },
    { name: "Çalışma", icon: FaClock },
    { name: "İzinler", icon: FaCalendarCheck },
  ];

  return (
    <div
      className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        record.isArchived ? "bg-yellow-100" : "bg-white"
      }`}
    >
      <div className="flex items-center p-4 border-b">
        <FaUser
          className={`mr-3 text-xl ${
            record.isArchived ? "text-yellow-700" : "text-blue-500"
          }`}
        />
        <h3 className="text-lg font-semibold text-gray-800">{record.name}</h3>
        {record.isArchived && (
          <span className="ml-auto px-2 py-1 text-sm text-yellow-700 bg-yellow-200 rounded">
            İşten çıkarılmış
          </span>
        )}
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 p-2 bg-gray-50 border-b">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  "w-full py-2 text-sm font-medium rounded-md flex items-center justify-center",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-blue-200",
                  selected
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:bg-white/[0.5] hover:text-gray-700"
                )
              }
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="p-4">
          {/* Genel Bilgiler Paneli */}
          <Tab.Panel className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Departman</span>
              <span className="font-medium">{record.group}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Toplam Çalışma Günü</span>
              <span className="font-medium">{record.totalWorkingDays} gün</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Hafta İçi</span>
              <span className="font-medium">
                {record.totalWorkingWeekdays} gün
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Hafta Sonu</span>
              <span className="font-medium">
                {record.totalWorkingWeekends} gün
              </span>
            </div>
          </Tab.Panel>

          {/* Çalışma Saatleri Paneli */}
          <Tab.Panel className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center text-green-700 mb-1">
                <FaClock className="mr-2" />
                <span className="font-medium">Normal Mesai</span>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {record.totalWorkHours} saat {record.totalWorkMinutes} dk
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center text-orange-700 mb-1">
                <FaHourglass className="mr-2" />
                <span className="font-medium">Fazla Mesai</span>
              </div>
              <div className="text-2xl font-bold text-orange-800">
                {record.totalOvertimeHours} saat {record.totalOvertimeMinutes}{" "}
                dk
              </div>
            </div>
          </Tab.Panel>

          {/* İzin Bilgileri Paneli */}
          <Tab.Panel className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-blue-700 mb-2">
                <FaCalendarCheck className="mr-2" />
                <span className="font-medium">Toplam İzin</span>
              </div>
              <div className="text-2xl font-bold text-blue-800 mb-3">
                {record.leaveDays.totalLeaveDays} gün
              </div>

              <div className="space-y-2">
                {Object.entries(record.leaveDays.leaveTypes || {}).map(
                  ([type, days], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1 px-2 bg-white/60 rounded"
                    >
                      <span className="text-blue-600">{type}</span>
                      <span className="font-medium text-blue-800">
                        {days} gün
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

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
      const leaveDaysInfo = record.personnel_id?.leaveDays || {
        totalLeaveDays: 0,
        leaveTypes: {},
      };
      const totalWorkingDays = record.personnel_id?.totalWorkingDays || 0;
      const totalWorkingWeekdays =
        record.personnel_id?.totalWorkingWeekdays || 0;
      const totalWorkingWeekends =
        record.personnel_id?.totalWorkingWeekends || 0;
      const isArchived = record.personnel_id?.isArchived || false;

      if (!summary[personnelId]) {
        summary[personnelId] = {
          name: personnelName,
          group: personnelGroup,
          totalWorkHours: 0,
          totalWorkMinutes: 0,
          totalOvertimeHours: 0,
          totalOvertimeMinutes: 0,
          leaveDays: leaveDaysInfo,
          totalWorkingDays,
          totalWorkingWeekdays,
          totalWorkingWeekends,
          isArchived,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pb-32">
          {/* Dekoratif arka plan desenleri */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
            </div>
            <div className="absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
            </div>
          </div>

          {/* Header Content */}
          <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Aylık Raporlama
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl">
                {new Date(selectedYear, selectedMonth).toLocaleString("tr", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Filtreler */}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 -mb-48 backdrop-blur-xl bg-opacity-95">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ay Seçimi */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ay
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option
                        key={i}
                        value={i}
                        disabled={
                          selectedYear === currentYear && i > currentMonth
                        }
                      >
                        {new Date(0, i).toLocaleString("tr", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yıl Seçimi */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Yıl
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
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
                </div>

                {/* Grup Seçimi */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Departman
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  >
                    {groups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arama Çubuğu */}
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Personel ara..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-600 font-medium">
                  Yükleniyor...
                </div>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((record, index) => (
                <PersonnelCard key={index} record={record} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-lg p-8">
              <FaCalendarAlt className="text-6xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Veri Bulunamadı
              </h3>
              <p className="text-gray-500 text-center">
                Seçilen tarih aralığında gösterilecek rapor verisi
                bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default JobReport;
