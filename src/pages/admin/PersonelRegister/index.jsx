import React, { useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { registerUser } from "../../../services/admin";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaBriefcase,
  FaPhone,
  FaUsers,
  FaToggleOn,
} from "react-icons/fa";
import { toast } from "react-toastify";

function PersonelRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tcNo: "",
    position: "",
    contact: "",
    status: "Aktif",
    group: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.success) {
        toast.success("Kullanıcı başarıyla kaydedildi!");
        setFormData({
          name: "",
          email: "",
          password: "",
          tcNo: "",
          position: "",
          contact: "",
          status: "Aktif",
          group: "",
        });
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      toast.error("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600 text-white text-center">
            <h2 className="text-3xl font-bold">Yeni Personel Kaydı</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaUser className="mr-2" /> İsim
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaEnvelope className="mr-2" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaLock className="mr-2" /> Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaIdCard className="mr-2" /> TC No
                </label>
                <input
                  type="text"
                  name="tcNo"
                  value={formData.tcNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  pattern="\d{11}"
                  maxLength="11"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaBriefcase className="mr-2" /> Pozisyon
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaPhone className="mr-2" /> İletişim
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  pattern="\d+"
                  maxLength={11}
                  required
                />
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaUsers className="mr-2" /> Grup
                </label>
                <select
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>
                    Grup Seçin
                  </option>
                  <option value="Mekanik">Mekanik</option>
                  <option value="Boru">Boru</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Aksaray">Aksaray</option>
                  <option value="Kapı">Kapı</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-gray-700 font-bold mb-2 flex items-center">
                  <FaToggleOn className="mr-2" /> Durum
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="İzinli">İzinli</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Personel Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default PersonelRegister;
