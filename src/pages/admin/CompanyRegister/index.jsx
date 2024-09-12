import React, { useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { companyRegister } from "../../../services/admin"; // Servis fonksiyonunu import et
import { toast } from "react-toastify"; // Toast mesajları için

function CompanyRegisterPage() {
  // Şirket bilgileri için state tanımlama
  const [company, setCompany] = useState({
    name: "",
    location: "",
    contact: "",
  });

  // Formdaki değişiklikleri handle eden fonksiyon
  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  // Form gönderim fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    try {
      const response = await companyRegister(company); // companyRegister servis fonksiyonunu çağır
      if (response.success) {
        toast.success("Şirket başarıyla kaydedildi!");
        setCompany({
          name: "",
          location: "",
          contact: "",
        }); // Formu sıfırla
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Şirket Kaydet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şirket Adı
            </label>
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konum
            </label>
            <input
              type="text"
              name="location"
              value={company.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İletişim
            </label>
            <input
              type="text"
              name="contact"
              value={company.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg"
          >
            Kaydet
          </button>
        </form>
      </div>
    </AdminDashboardlayout>
  );
}

export default CompanyRegisterPage;
