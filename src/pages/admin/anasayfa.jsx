import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../layout/AdminDashboard";
import {
  getAllUsers,
  getAllCompanies,
  getAllJobsByCompanies,
} from "../../services/admin"; // getAllUsers ve getAllCompanies servislerini import ediyoruz
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Anasayfa() {
  // State'ler
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeCompanies, setActiveCompanies] = useState(0); // Aktif şirketler için state
  const [completedJobsCount, setCompletedJobsCount] = useState(0); // Tamamlanan işler
  const [activeJobsCount, setActiveJobsCount] = useState(0); // Devam eden işler

  // API çağrılarıyla kullanıcı ve şirket verilerini çekiyoruz
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response && response.data.length > 0) {
          setTotalUsers(response.data.length); // Toplam kullanıcı sayısını state'e set ediyoruz
        }
      } catch (error) {
        console.error("Kullanıcı verileri alınamadı:", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        if (response && response.data.length > 0) {
          setActiveCompanies(response.data.length); // Aktif şirket sayısını state'e set ediyoruz
        }
      } catch (error) {
        console.error("Şirket verileri alınamadı:", error);
      }
    };
    const fetchJobs = async () => {
      try {
        const response = await getAllJobsByCompanies();
        if (response && response.success) {
          // Tamamlanan ve aktif işleri ayırıyoruz
          const completedJobs = response.completedJobs.length;
          const activeJobs = response.activeJobs.length;

          setCompletedJobsCount(completedJobs); // Tamamlanan işleri set ediyoruz
          setActiveJobsCount(activeJobs); // Aktif işleri set ediyoruz
        }
      } catch (error) {
        console.error("İş verileri alınamadı:", error);
      }
    };
    fetchJobs();
    fetchUsers();
    fetchCompanies();
  }, []);

  const chartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Aylık Büyüme (%)",
        data: [8, 10, 9, 11, 12.5, 14],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <AdminDashboardlayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-8 space-y-8 mt-20"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Genel Bakış</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dinamik olarak totalUsers state'inden ve activeCompanies state'inden değerler alınıyor */}
          <SummaryCard
            icon={FaUsers}
            title="Toplam Personel"
            value={totalUsers}
          />
          <SummaryCard
            icon={FaBuilding}
            title="Aktif Şirketler"
            value={activeCompanies}
          />
          <SummaryCard
            icon={FaClipboardCheck}
            title="Tamamlanan İşler"
            value={completedJobsCount}
          />
          <SummaryCard
            icon={FaChartLine}
            title="Devam Eden İşler"
            value={activeJobsCount}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Büyüme Trendi</h2>
          <Line data={chartData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAccessCard
            title="Son Aktiviteler"
            items={[
              "Yeni kullanıcı kaydı: Ahmet Yılmaz",
              "Görev tamamlandı: Rapor hazırlama",
              "Yeni şirket eklendi: ABC Ltd.",
            ]}
          />
          <QuickAccessCard
            title="Yaklaşan Görevler"
            items={[
              "Aylık rapor hazırlama",
              "Personel değerlendirme toplantısı",
              "Sistem bakımı",
            ]}
          />
        </div>
      </motion.div>
    </AdminDashboardlayout>
  );
}

function SummaryCard({ icon: Icon, title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <Icon className="text-3xl text-indigo-600 mb-2" />
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </motion.div>
  );
}

function QuickAccessCard({ title, items }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Anasayfa;
