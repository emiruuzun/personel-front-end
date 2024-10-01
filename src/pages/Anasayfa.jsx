import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaUsers, FaCog, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function Anasayfa() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/giris");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 text-white">Yönetim Paneli</h1>
        <p className="text-xl text-blue-100">
          Şirketinizin verilerini yönetin, analiz edin ve optimize edin.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-4xl">
        <FeatureCard
          icon={<FaChartLine className="text-4xl" />}
          title="Veri Analitiği"
          description="Gerçek zamanlı verilerinizi görselleştirin ve analiz edin."
          delay={0.1}
        />
        <FeatureCard
          icon={<FaUsers className="text-4xl" />}
          title="Kullanıcı Yönetimi"
          description="Kullanıcı hesaplarını ve yetkilerini kolayca yönetin."
          delay={0.2}
        />
        <FeatureCard
          icon={<FaCog className="text-4xl" />}
          title="Sistem Ayarları"
          description="Sisteminizi özelleştirin ve performansını optimize edin."
          delay={0.3}
        />
        <FeatureCard
          icon={<FaSignInAlt className="text-4xl" />}
          title="Güvenli Giriş"
          description="Çok faktörlü kimlik doğrulama ile güvenliği artırın."
          delay={0.4}
        />
      </div>

      <motion.button
        onClick={handleLoginClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition duration-300 ease-in-out"
      >
        Yönetim Paneline Giriş Yap
      </motion.button>

      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-20"></div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white bg-opacity-20 p-6 rounded-lg hover:bg-opacity-30 transition duration-300 ease-in-out backdrop-blur-sm"
    >
      <div className="text-white mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </motion.div>
  );
}

export default Anasayfa;
