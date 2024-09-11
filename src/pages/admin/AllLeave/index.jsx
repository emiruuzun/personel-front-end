import React, { useEffect, useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { formatDate } from "../../../utils/form-date";
import { getAllLeave, updateLeaveStatus } from "../../../services/admin";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);
  const [selectedLeaveForStatus, setSelectedLeaveForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
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
        rejectionReason
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
        setRejectionReason("");
        setIsStatusModalOpen(false);
        toast.success("İzin durumu başarıyla güncellendi.");
      } else {
        toast.error(response.message || "İzin durumu güncellenemedi.");
      }
    } catch (error) {
      toast.error("İzin durumu güncellenirken hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRequests = leaveRequests.filter((leave) => {
    const matchesStatus =
      filterStatus === "Hepsi" || leave.status === filterStatus;
    const matchesSearch = leave.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const LeaveRequestCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-2">{request.fullName}</h3>
      <p className="text-sm text-gray-600 mb-1">Görevi: {request.position}</p>
      <p className="text-sm text-gray-600 mb-1">
        İzin Türü: {request.leaveType}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Başvuru: {formatDate(request.createdAt)}
      </p>
      <div className="flex justify-between items-center">
        <span
          className={`py-1 px-3 rounded-full text-xs font-semibold ${
            request.status === "Onaylandı"
              ? "bg-green-200 text-green-700"
              : request.status === "Reddedildi"
              ? "bg-red-200 text-red-700"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {request.status}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setSelectedLeaveDetails(request)}
            className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-blue-600 transition duration-150"
          >
            Detaylar
          </button>
          <button
            onClick={() => {
              setSelectedLeaveForStatus(request);
              setIsStatusModalOpen(true);
              setNewStatus("");
            }}
            className={`bg-yellow-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-yellow-600 transition duration-150 ${
              request.status === "Onaylandı" || request.status === "Reddedildi"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={
              request.status === "Onaylandı" || request.status === "Reddedildi"
            }
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminDashboardlayout>
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          İzin Talepleri Listesi
        </h1>

        {/* Filtreleme ve Arama Alanları */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto mb-2 sm:mb-0">
            <label
              htmlFor="statusFilter"
              className="block sm:inline-block mr-2 font-semibold mb-1 sm:mb-0"
            >
              Duruma Göre Filtrele:
            </label>
            <select
              id="statusFilter"
              className="w-full sm:w-auto border rounded px-3 py-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Hepsi">Hepsi</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Reddedildi">Reddedildi</option>
              <option value="Beklemede">Beklemede</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Ada göre ara..."
              className="w-full sm:w-auto border rounded px-3 py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
        ) : filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500">
            Seçilen kritere göre izin talebi bulunamadı.
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {filteredRequests.map((request) => (
                <LeaveRequestCard key={request._id} request={request} />
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="text-left bg-gray-800 text-white rounded-t">
                    <th className="py-3 px-4">Adı Soyadı</th>
                    <th className="py-3 px-4">Görevi</th>
                    <th className="py-3 px-4">İzin Türü</th>
                    <th className="py-3 px-4">İzin Başvuru Tarihi</th>
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
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`py-1 px-3 rounded-full text-xs font-semibold ${
                            request.status === "Onaylandı"
                              ? "bg-green-200 text-green-700"
                              : request.status === "Reddedildi"
                              ? "bg-red-200 text-red-700"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {request.status}
                        </span>
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
            </div>
          </>
        )}

        {/* Durum Güncelle Modal */}
        {isStatusModalOpen && selectedLeaveForStatus && (
          <Dialog.Root
            open={isStatusModalOpen}
            onOpenChange={() => setIsStatusModalOpen(false)}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-96 p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Durum Güncelle</h2>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full py-2 px-3 border rounded mb-4"
              >
                <option value="">Durum Seçin</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Reddedildi">Reddedildi</option>
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
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-96 md:w-[28rem] p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">
                İzin Talep Detayları
              </h2>
              <div className="space-y-2">
                <DetailItem
                  label="Adı Soyadı"
                  value={selectedLeaveDetails.fullName}
                />
                <DetailItem
                  label="Görevi"
                  value={selectedLeaveDetails.position}
                />
                <DetailItem label="TC No" value={selectedLeaveDetails.tcNo} />
                <DetailItem
                  label="İzin Türü"
                  value={selectedLeaveDetails.leaveType}
                />
                <DetailItem label="Durum" value={selectedLeaveDetails.status} />
                <DetailItem
                  label="Başlangıç Tarihi"
                  value={formatDate(selectedLeaveDetails.startDate)}
                />
                <DetailItem
                  label="Bitiş Tarihi"
                  value={formatDate(selectedLeaveDetails.endDate)}
                />
                <DetailItem
                  label="İzin Günleri"
                  value={selectedLeaveDetails.leaveDays}
                />

                <DetailItem
                  label="İletişim Numarası"
                  value={selectedLeaveDetails.contactNumber}
                />
                <DetailItem
                  label="İzin Nedeni"
                  value={selectedLeaveDetails.reason}
                />
                {selectedLeaveDetails.status === "Reddedildi" && (
                  <DetailItem
                    label="Reddetme Nedeni"
                    value={selectedLeaveDetails.rejectionReason}
                  />
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
    </AdminDashboardlayout>
  );
};

// Yardımcı bileşen
const DetailItem = ({ label, value }) => (
  <div className="border-b border-gray-200 pb-2">
    <strong className="block text-gray-700 text-sm">{label}:</strong>
    <span className="text-sm">{value}</span>
  </div>
);

export default AdminLeaveRequests;
