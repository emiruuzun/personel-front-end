import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../layout/AdminDashboard";
import {
  getAllUsers,
  getAllCompanies,
  getAllJobsByCompanies,
  getRecentActivities,
} from "../../services/admin";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaBell,
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeCompanies, setActiveCompanies] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [activeJobsCount, setActiveJobsCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response && response.data.length > 0) {
          setTotalUsers(response.data.length);
        }
      } catch (error) {
        console.error("Kullanıcı verileri alınamadı:", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        if (response && response.data.length > 0) {
          setActiveCompanies(response.data.length);
        }
      } catch (error) {
        console.error("Şirket verileri alınamadı:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await getAllJobsByCompanies();
        if (response && response.success) {
          const completedJobs = response.completedJobs.length;
          const activeJobs = response.activeJobs.length;

          setCompletedJobsCount(completedJobs);
          setActiveJobsCount(activeJobs);
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

        <EnhancedActivityTaskSection />
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

const EnhancedCard = ({ title, items, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <div className="flex items-center mb-4">
        <Icon className="text-2xl text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            {title.includes("Aktiviteler") ? (
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            ) : (
              <FaClock className="text-orange-500 mt-1 flex-shrink-0" />
            )}
            <span className="text-gray-700">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const EnhancedActivityTaskSection = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const upcomingTasks = [
    "Aylık rapor hazırlama",
    "Personel değerlendirme toplantısı",
    "Sistem bakımı",
    "Yeni proje başlatma toplantısı",
  ];

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const activities = await getRecentActivities();
        if (activities) {
          setRecentActivities(
            activities.map((activity) => activity.description)
          );
        }
      } catch (error) {
        console.error("Aktiviteler alınamadı:", error);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <EnhancedCard
        title="Son Aktiviteler"
        items={recentActivities}
        icon={FaCheckCircle}
      />
      <EnhancedCard
        title="Yaklaşan Görevler"
        items={upcomingTasks}
        icon={FaBell}
      />
    </div>
  );
};

export default Anasayfa;
