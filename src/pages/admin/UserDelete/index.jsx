import React, { useEffect, useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  getAllUsers,
  deleteUserAdmin,
  createLeaveAPI,
} from "../../../services/admin";
import * as Dialog from "@radix-ui/react-dialog";

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false); // İzin oluştur modal kontrolü
  const [leaveUser, setLeaveUser] = useState(null); // İzin oluşturulan kullanıcı
  const [leaveDays, setLeaveDays] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllUsers();
        if (response && response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Users could not be fetched.", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const calculateLeaveDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  };
  const handleDelete = async (userId) => {
    try {
      const response = await deleteUserAdmin(userId);
      if (response && response.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleShowDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await handleDelete(userToDelete);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // İzin oluşturma modalını açma
  const handleOpenLeaveModal = (user) => {
    setLeaveUser(user);
    setShowLeaveModal(true);
  };

  // İzin oluşturma modalını kapatma
  const handleCloseLeaveModal = () => {
    setLeaveUser(null);
    setShowLeaveModal(false);
  };

  // İzin oluşturma işlemi
  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;
    const calculatedDays = calculateLeaveDays(startDate, endDate);

    const leaveData = {
      userId: leaveUser._id, // Kullanıcı ID
      leaveType: e.target.leaveType.value, // İzin türü
      startDate: startDate,
      endDate: endDate,
      reason: e.target.reason.value, // Neden
      leaveDays: calculatedDays, // Hesaplanan izin gün sayısı
    };

    try {
      const response = await createLeaveAPI(leaveData);
      if (response.success) {
        alert("İzin başarıyla oluşturuldu");
        setShowLeaveModal(false);
        setLeaveUser(null);
      }
    } catch (error) {
      console.error("İzin oluşturulurken bir hata oluştu:", error);
      alert("İzin oluşturulurken bir hata oluştu: " + error.message);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm mt-2">
        {user.isVerify ? (
          <span className="bg-green-200 text-green-700 py-1 px-2 rounded-full text-xs font-semibold">
            Verified
          </span>
        ) : (
          <span className="bg-red-200 text-red-700 py-1 px-2 rounded-full text-xs font-semibold">
            Not Verified
          </span>
        )}
      </p>
      <p className="text-sm mt-2">
        Created: {new Date(user.creatAt).toLocaleDateString()}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleShowDelete(user._id)}
          className="bg-red-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-red-600 transition duration-150"
        >
          Sil
        </button>
        <button
          onClick={() => setSelectedUser(user)}
          className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-blue-600 transition duration-150"
        >
          Kullanıcı Bilgileri
        </button>
        <button
          onClick={() => handleOpenLeaveModal(user)}
          className="bg-green-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-green-600 transition duration-150"
        >
          İzin Oluştur
        </button>
      </div>
    </div>
  );

  return (
    <AdminDashboardlayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      ) : (
        <div className="p-4 sm:p-8">
          <h1 className="text-2xl font-semibold mb-6">User List</h1>

          {/* Mobile view */}
          <div className="md:hidden">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="text-left bg-gray-800 text-white rounded-t">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Creation Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-200 hover:bg-gray-100 transition duration-150"
                  >
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {user.isVerify ? (
                        <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">
                          Not Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(user.creatAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleShowDelete(user._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-red-600 transition duration-150"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-blue-600 transition duration-150"
                      >
                        Kullanıcı Bilgileri
                      </button>
                      <button
                        onClick={() => handleOpenLeaveModal(user)}
                        className="bg-green-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-green-600 transition duration-150"
                      >
                        İzin Oluştur
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* İzin Oluştur Modal */}
          {showLeaveModal && leaveUser && (
            <Dialog.Root
              open={showLeaveModal}
              onOpenChange={handleCloseLeaveModal}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 bg-white rounded shadow-xl">
                <h2 className="text-lg font-semibold mb-4">
                  {leaveUser.name} için İzin Oluştur
                </h2>
                <form onSubmit={handleSubmitLeave}>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="leaveType"
                    >
                      İzin Türü
                    </label>
                    <select
                      id="leaveType"
                      name="leaveType"
                      required
                      className="block w-full border-gray-300 rounded"
                    >
                      <option value="Yıllık İzin">Yıllık İzin</option>
                      <option value="Hastalık İzni">Hastalık İzni</option>
                      <option value="Mazeret İzni">Mazeret İzni</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="startDate"
                    >
                      Başlangıç Tarihi
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      className="block w-full border-gray-300 rounded"
                      onChange={(e) => {
                        const endDate = e.target.form.endDate.value;
                        if (endDate) {
                          setLeaveDays(
                            calculateLeaveDays(e.target.value, endDate)
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="endDate"
                    >
                      Bitiş Tarihi
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      required
                      className="block w-full border-gray-300 rounded"
                      onChange={(e) => {
                        const startDate = e.target.form.startDate.value;
                        if (startDate) {
                          setLeaveDays(
                            calculateLeaveDays(startDate, e.target.value)
                          );
                        }
                      }}
                    />
                  </div>
                  {leaveDays > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Toplam İzin Günü: <strong>{leaveDays} gün</strong>
                      </p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="reason"
                    >
                      Sebep
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      required
                      className="block w-full border-gray-300 rounded"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCloseLeaveModal}
                      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* Kullanıcı Bilgileri ve Silme Modalı */}
          {selectedUser && (
            <Dialog.Root
              open={!!selectedUser}
              onOpenChange={() => setSelectedUser(null)}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 bg-white rounded shadow-xl">
                <h2 className="text-lg font-semibold mb-4">
                  Kullanıcı Bilgileri
                </h2>
                <p>
                  <strong>Durum:</strong> {selectedUser.status}
                </p>
                <p>
                  <strong>Pozisyon:</strong> {selectedUser.position}
                </p>
                <p>
                  <strong>TC Kimlik No:</strong> {selectedUser.tcNo}
                </p>
                <p>
                  <strong>İletişim:</strong> {selectedUser.contact}
                </p>
                <button
                  className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  onClick={() => setSelectedUser(null)}
                >
                  Kapat
                </button>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {showDeleteConfirm && (
            <Dialog.Root
              open={showDeleteConfirm}
              onOpenChange={handleCloseDeleteConfirm}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 bg-white rounded shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Kullanıcıyı Sil</h2>
                <p>Emin misiniz?</p>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                    onClick={handleCloseDeleteConfirm}
                  >
                    Hayır
                  </button>
                  <button
                    className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
                    onClick={handleConfirmDelete}
                  >
                    Evet
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </div>
      )}
    </AdminDashboardlayout>
  );
}

export default GetAllUsers;
