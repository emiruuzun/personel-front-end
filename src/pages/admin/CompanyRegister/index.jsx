import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  companyRegister,
  getAllCompanies,
  deleteCompany,
} from "../../../services/admin";
import { toast } from "react-toastify";

function CompanyRegisterPage() {
  const [activeTab, setActiveTab] = useState("register");
  const [company, setCompany] = useState({
    name: "",
    location: "",
    contact: "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setCompany({ ...company, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await companyRegister(company);
      if (response.success) {
        toast.success("Şirket başarıyla kaydedildi!");
        setCompany({ name: "", location: "", contact: "" });
        fetchCompanies();
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      toast.error("Kayıt sırasında bir hata oluştu.");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      if (response.success) {
        setCompanies(response.data);
      } else {
        setError("Veriler getirilemedi.");
      }
    } catch (error) {
      setError("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCompany(id);
      if (response.success) {
        toast.success("Şirket başarıyla silindi!");
        setCompanies(companies.filter((company) => company._id !== id));
      } else {
        toast.error("Şirket silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Şirket silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <AdminDashboardlayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Şirket Yönetimi
        </h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors duration-200 
                ${
                  activeTab === "register"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Firma Kaydet
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors duration-200
                ${
                  activeTab === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Kayıtlı Firmalar
            </button>
          </div>

          <div className="p-6">
            {activeTab === "register" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={company.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İletişim
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={company.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Kaydet
                </button>
              </form>
            )}

            {activeTab === "list" && (
              <div>
                {loading ? (
                  <p className="text-center text-gray-600">Yükleniyor...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Firma Adı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lokasyon
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İletişim
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                          <tr key={company._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {company.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {company.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {company.contact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleDelete(company._id)}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default CompanyRegisterPage;
