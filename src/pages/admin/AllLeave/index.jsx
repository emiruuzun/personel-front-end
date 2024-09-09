import React, { useEffect, useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getAllLeave, updateLeaveStatus } from "../../../services/admin";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);
  const [selectedLeaveForStatus, setSelectedLeaveForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState(""); // Reddetme nedeni için state
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Hepsi");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await getAllLeave();
        if (response.success) {
          setLeaveRequests(response.data);
        }
      } catch (error) {
        toast.error("İzin talepleri çekilirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Lütfen geçerli bir durum seçin.");
      return;
    }

    if (newStatus === "Reddedildi" && !rejectionReason) {
      toast.error("Lütfen reddetme nedenini girin.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await updateLeaveStatus(
        selectedLeaveForStatus._id,
        newStatus,
        rejectionReason // Reddetme nedenini de gönderiyoruz
      );
      if (response.success) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === selectedLeaveForStatus._id
              ? { ...request, status: newStatus, rejectionReason }
              : request
          )
        );
        setSelectedLeaveForStatus(null);
        setNewStatus("");
        setRejectionReason(""); // Reddetme nedenini temizle
        setIsStatusModalOpen(false);
      } else {
        toast.error(response.message || "İzin durumu güncellenemedi.");
      }
    } catch (error) {
      toast.error("İzin durumu güncellenirken hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredRequests = leaveRequests.filter((leave) => {
    const matchesStatus =
      filterStatus === "Hepsi" || leave.status === filterStatus;
    const matchesSearch = leave.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminDashboardlayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl font-semibold text-gray-700">Yükleniyor...</p>
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl font-semibold text-gray-700">
            Henüz bir izin talebi yok.
          </p>
        </div>
      ) : (
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">
            İzin Talepleri Listesi
          </h1>

          {/* Filtreleme ve Arama Alanları */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <label htmlFor="statusFilter" className="mr-2 font-semibold">
                Duruma Göre Filtrele:
              </label>
              <select
                id="statusFilter"
                className="border rounded px-3 py-1"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Hepsi">Hepsi</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Reddedildi">Reddedildi</option>
                <option value="Beklemede">Beklemede</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Ada göre ara..."
                className="border rounded px-3 py-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* İzin Talepleri Tablosu */}
          {filteredRequests.length === 0 ? (
            <div className="text-center text-gray-500">
              Seçilen kritere göre izin talebi bulunamadı.
            </div>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="text-left bg-gray-800 text-white rounded-t">
                  <th className="py-3 px-4">Adı Soyadı</th>
                  <th className="py-3 px-4">Görevi</th>
                  <th className="py-3 px-4">İzin Türü</th>
                  <th className="py-3 px-4">Başlangıç Tarihi</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-t border-gray-200 hover:bg-gray-100 transition duration-150"
                  >
                    <td className="py-3 px-4">{request.fullName}</td>
                    <td className="py-3 px-4">{request.position}</td>
                    <td className="py-3 px-4">{request.leaveType}</td>
                    <td className="py-3 px-4">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="py-3 px-4">
                      {request.status === "Onaylandı" ? (
                        <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">
                          Onaylandı
                        </span>
                      ) : request.status === "Reddedildi" ? (
                        <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">
                          Reddedildi
                        </span>
                      ) : (
                        <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs font-semibold">
                          Beklemede
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => setSelectedLeaveDetails(request)}
                        className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-blue-600 transition duration-150"
                      >
                        Talep Detayları
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeaveForStatus(request);
                          setIsStatusModalOpen(true);
                          setNewStatus("");
                        }}
                        className={`bg-yellow-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-yellow-600 transition duration-150 ${
                          request.status === "Onaylandı" ||
                          request.status === "Reddedildi"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={
                          request.status === "Onaylandı" ||
                          request.status === "Reddedildi"
                        }
                      >
                        Durum Güncelle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Durum Güncelle Modal */}
          {isStatusModalOpen && selectedLeaveForStatus && (
            <Dialog.Root
              open={isStatusModalOpen}
              onOpenChange={() => setIsStatusModalOpen(false)}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Durum Güncelle</h2>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full py-2 px-3 border rounded mb-4"
                >
                  <option value="">Durum Seçin</option>
                  <option value="Onaylandı">Onaylandı</option>
                  <option value="Reddedildi">Reddedildi</option>
                  {/* <option value="Beklemede">Beklemede</option> */}
                </select>

                {newStatus === "Reddedildi" && (
                  <div>
                    <textarea
                      placeholder="Reddetme nedenini yazın..."
                      className="w-full py-2 px-3 border rounded mb-4"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                )}

                <button
                  onClick={handleUpdateStatus}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                </button>
                <button
                  className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                  onClick={() => setIsStatusModalOpen(false)}
                >
                  İptal
                </button>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* Talep Detayları Modal */}
          {selectedLeaveDetails && (
            <Dialog.Root
              open={!!selectedLeaveDetails}
              onOpenChange={() => setSelectedLeaveDetails(null)}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                  İzin Talep Detayları
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">Adı Soyadı:</strong>
                    <span>{selectedLeaveDetails.fullName}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">Görevi:</strong>
                    <span>{selectedLeaveDetails.position}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">TC No:</strong>
                    <span>{selectedLeaveDetails.tcNo}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-700">İzin Türü:</strong>
                    <span>{selectedLeaveDetails.leaveType}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-700">Durum:</strong>
                    <span>{selectedLeaveDetails.status}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-700">
                      Başlangıç Tarihi:
                    </strong>
                    <span>{formatDate(selectedLeaveDetails.startDate)}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-700">
                      Bitiş Tarihi:
                    </strong>
                    <span>{formatDate(selectedLeaveDetails.endDate)}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">
                      İzin Günleri:
                    </strong>
                    <span>{selectedLeaveDetails.leaveDays}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">
                      Yol İzni Günleri:
                    </strong>
                    <span>{selectedLeaveDetails.roadLeaveDays}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">Adres:</strong>
                    <span>{selectedLeaveDetails.address}</span>
                  </div>
                  <div className="col-span-2 border-b pb-2">
                    <strong className="block text-gray-700">
                      İletişim Numarası:
                    </strong>
                    <span>{selectedLeaveDetails.contactNumber}</span>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <strong className="block text-gray-700">
                      İzin Nedeni:
                    </strong>
                    <span>{selectedLeaveDetails.reason}</span>
                  </div>
                  {selectedLeaveDetails.status === "Reddedildi" && (
                    <div className="col-span-2 border-t pt-2">
                      <strong className="block text-gray-700">
                        Reddetme Nedeni:
                      </strong>
                      <span>{selectedLeaveDetails.rejectionReason}</span>
                    </div>
                  )}
                </div>

                <button
                  className="mt-6 w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800"
                  onClick={() => setSelectedLeaveDetails(null)}
                >
                  Kapat
                </button>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </div>
      )}
    </AdminDashboardlayout>
  );
};

export default AdminLeaveRequests;
