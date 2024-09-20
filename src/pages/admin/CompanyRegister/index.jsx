import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  companyRegister,
  getAllCompanies,
  deleteCompany,
  addJobToCompany,
  getJobsByCompanyId,
} from "../../../services/admin";
import { toast } from "react-toastify";
import { Trash2, BriefcaseIcon, Eye } from "lucide-react";

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

  // Modal state'leri
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // İşleri Görüntüleme Modalı state'leri
  const [isViewJobsModalOpen, setIsViewJobsModalOpen] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);

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

  const openJobModal = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsJobModalOpen(true);
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setJobTitle("");
    setJobDescription("");
    setSelectedCompanyId(null);
  };

  const handleAddJob = async () => {
    if (!jobTitle || !jobDescription || !selectedCompanyId) {
      toast.error("Lütfen tüm iş bilgilerini girin.");
      return;
    }

    const jobData = {
      jobName: jobTitle,
      jobDescription: jobDescription,
    };

    try {
      const response = await addJobToCompany(selectedCompanyId, jobData);
      if (response.success) {
        toast.success("İş başarıyla eklendi!");
        closeJobModal();
        fetchCompanies();
      } else {
        toast.error("İş eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İş ekleme hatası:", error);
      toast.error("İş eklenirken bir hata oluştu.");
    }
  };

  const openViewJobsModal = async (companyId) => {
    try {
      const response = await getJobsByCompanyId(companyId);
      if (response.success) {
        setCompanyJobs(response.data); // response.jobs yerine response.data kullanıyoruz
        setIsViewJobsModalOpen(true);
      } else {
        toast.error("İşler getirilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İşler getirilirken hata oluştu:", error);
      toast.error("İşler getirilirken bir hata oluştu.");
    }
  };

  const closeViewJobsModal = () => {
    setIsViewJobsModalOpen(false);
    setCompanyJobs([]);
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
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDelete(company._id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                                  title="Sil"
                                >
                                  <Trash2 size={20} />
                                </button>
                                <button
                                  onClick={() => openJobModal(company._id)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                                  title="İş Ekle"
                                >
                                  <BriefcaseIcon size={20} />
                                </button>
                                <button
                                  onClick={() => openViewJobsModal(company._id)}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
                                  title="İşleri Görüntüle"
                                >
                                  <Eye size={20} />
                                </button>
                              </div>
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

      {/* İş Ekleme Modalı */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">İş Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İş Başlığı
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="İş Adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İş Açıklaması
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleAddJob}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ekle
              </button>
              <button
                onClick={closeJobModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* İşleri Görüntüleme Modalı */}
      {isViewJobsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Firmanın İşleri</h3>
            {companyJobs && companyJobs.length > 0 ? (
              <ul className="space-y-2">
                {companyJobs.map((job) => (
                  <li key={job._id} className="p-2 bg-gray-100 rounded">
                    <p className="font-semibold">{job.jobName}</p>
                    <p className="text-sm text-gray-600">
                      {job.jobDescription}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Bu firmaya ait iş bulunmamaktadır.
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewJobsModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardlayout>
  );
}

export default CompanyRegisterPage;
