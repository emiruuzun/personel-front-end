import React, { useEffect, useState, useCallback } from "react";
import { fetchMonthlyReport } from "../../../services/admin";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { FaClock, FaUser, FaHourglass } from "react-icons/fa";
import { toast } from "react-toastify";

function JobReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Çalışma saatlerini hesaplayan fonksiyon
  const calculateWorkHours = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return { hours: 0, minutes: 0 }; // Eğer mesai başlangıç veya bitiş saati boşsa, saat ve dakika 0 olarak döner
    }

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    const start = new Date();
    start.setHours(parseInt(startHour), parseInt(startMinute));

    const end = new Date();
    end.setHours(parseInt(endHour), parseInt(endMinute));

    const diffMs = end - start; // Zaman farkı milisaniye olarak
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // Saat cinsinden
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Dakika cinsinden

    return { hours: diffHrs, minutes: diffMins };
  };

  // Verileri gruplandırıp özetleyen fonksiyon
  const groupAndSummarizeData = useCallback((data) => {
    const summary = {};

    data.forEach((record) => {
      const personnelId = record.personnel_id?._id;
      const personnelName = record.personnel_id?.name || "Bilinmiyor";

      if (!summary[personnelId]) {
        summary[personnelId] = {
          name: personnelName,
          totalWorkHours: 0,
          totalWorkMinutes: 0,
          totalOvertimeHours: 0,
          totalOvertimeMinutes: 0,
        };
      }

      // Çalışma saatlerini ekle
      const { hours: workHours, minutes: workMinutes } = calculateWorkHours(
        record.job_start_time,
        record.job_end_time
      );
      summary[personnelId].totalWorkHours += workHours;
      summary[personnelId].totalWorkMinutes += workMinutes;

      // Mesai saatlerini ekle
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

    // Dakikaları saatlere çevir
    Object.keys(summary).forEach((personnelId) => {
      // Çalışma saatleri için
      const extraWorkHours = Math.floor(
        summary[personnelId].totalWorkMinutes / 60
      );
      summary[personnelId].totalWorkHours += extraWorkHours;
      summary[personnelId].totalWorkMinutes %= 60;

      // Mesai saatleri için
      const extraOvertimeHours = Math.floor(
        summary[personnelId].totalOvertimeMinutes / 60
      );
      summary[personnelId].totalOvertimeHours += extraOvertimeHours;
      summary[personnelId].totalOvertimeMinutes %= 60;
    });

    // Object.values ile summary'yi diziye çevir
    return Object.values(summary);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await fetchMonthlyReport(10, 2024); // Örnek olarak Ekim 2024 verisi
        if (data) {
          const groupedData = groupAndSummarizeData(data); // Veriyi gruplandır ve özetle
          setReportData(groupedData); // Veriyi state'e kaydet
        }
      } catch (error) {
        console.error("Raporlama verisi çekilemedi:", error);
        toast.error("Raporlama verisi çekilemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [groupAndSummarizeData]);

  if (loading) {
    return <div className="text-center mt-10">Yükleniyor...</div>;
  }

  return (
    <AdminDashboardlayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Aylık Raporlama
        </h1>

        <div className="bg-white shadow rounded-lg p-4">
          {reportData.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Personel</th>
                  <th className="py-3 px-6 text-center">
                    Toplam Çalışma Saati
                  </th>
                  <th className="py-3 px-6 text-center">Toplam Mesai Saati</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {reportData.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-2" />
                        <span className="font-medium">{record.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <FaClock className="text-gray-500 mr-2" />
                        <span>
                          {record.totalWorkHours} saat {record.totalWorkMinutes}{" "}
                          dakika
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <FaHourglass className="text-gray-500 mr-2" />
                        <span>
                          {record.totalOvertimeHours} saat{" "}
                          {record.totalOvertimeMinutes} dakika
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500">
              Bu ay için rapor verisi bulunamadı.
            </div>
          )}
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default JobReport;
