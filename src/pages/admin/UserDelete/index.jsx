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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveUser, setLeaveUser] = useState(null);
  const [leaveDays, setLeaveDays] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Tümü");

  const groups = [
    "Tümü",
    "Mekanik",
    "Boru",
    "Elektrik",
    "Aksaray",
    "Kapı",
    "Ofis",
    "Taşeron",
  ];

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
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
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

  const handleOpenLeaveModal = (user) => {
    setLeaveUser(user);
    setShowLeaveModal(true);
  };

  const handleCloseLeaveModal = () => {
    setLeaveUser(null);
    setShowLeaveModal(false);
    setLeaveDays(0);
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;
    const calculatedDays = calculateLeaveDays(startDate, endDate);

    const leaveData = {
      userId: leaveUser._id,
      leaveType: e.target.leaveType.value,
      startDate: startDate,
      endDate: endDate,
      reason: e.target.reason.value,
      leaveDays: calculatedDays,
    };

    try {
      const response = await createLeaveAPI(leaveData);
      if (response.success) {
        alert("İzin başarıyla oluşturuldu");
        handleCloseLeaveModal();
      }
    } catch (error) {
      console.error("İzin oluşturulurken bir hata oluştu:", error);
      alert("İzin oluşturulurken bir hata oluştu: " + error.message);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
        </div>
        <div>
          {user.isVerify ? (
            <span className="bg-emerald-100 text-emerald-700 py-1.5 px-3 rounded-full text-sm font-medium">
              Verified
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 py-1.5 px-3 rounded-full text-sm font-medium">
              Not Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600 mb-4">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Created: {new Date(user.creatAt).toLocaleDateString()}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedUser(user)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Detaylar
        </button>
        <button
          onClick={() => handleOpenLeaveModal(user)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          İzin
        </button>
        <button
          onClick={() => handleShowDelete(user._id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Sil
        </button>
      </div>
    </div>
  );

  const filteredUsers = users
    .filter((user) => {
      const groupMatch =
        selectedGroup === "Tümü" || user.group === selectedGroup;
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return groupMatch && searchMatch;
    })
    .map((user) => <UserCard key={user._id} user={user} />);

  return (
    <AdminDashboardlayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User List</h1>
            <p className="text-gray-600">Manage and monitor all system users</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200"
                />
              </div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white transition-colors duration-200"
              >
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers}
          </div>

          {/* Leave Modal */}
          {showLeaveModal && leaveUser && (
            <Dialog.Root
              open={showLeaveModal}
              onOpenChange={handleCloseLeaveModal}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-2xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {leaveUser.name} için İzin Oluştur
                </h2>
                <form onSubmit={handleSubmitLeave} className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="leaveType"
                    >
                      İzin Türü
                    </label>
                    <select
                      id="leaveType"
                      name="leaveType"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="Yıllık İzin">Yıllık İzin</option>
                      <option value="Hastalık İzni">Hastalık İzni</option>
                      <option value="Mazeret İzni">Mazeret İzni</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="startDate"
                      >
                        Başlangıç Tarihi
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="endDate"
                      >
                        Bitiş Tarihi
                      </label>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                  </div>

                  {leaveDays > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        Toplam İzin Süresi:{" "}
                        <span className="font-bold">{leaveDays} gün</span>
                      </p>
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="reason"
                    >
                      İzin Nedeni
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      required
                      rows="4"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none"
                      placeholder="İzin talebinin nedenini belirtiniz..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCloseLeaveModal}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* User Details Modal */}
          {selectedUser && (
            <Dialog.Root
              open={!!selectedUser}
              onOpenChange={() => setSelectedUser(null)}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-2xl p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Kullanıcı Detayları
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Kullanıcı bilgilerinin detaylı görünümü
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Durum</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.status}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pozisyon</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.position}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">TC Kimlik No</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.tcNo}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">İletişim</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.contact}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    className="w-full px-6 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200"
                    onClick={() => setSelectedUser(null)}
                  >
                    Kapat
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <Dialog.Root
              open={showDeleteConfirm}
              onOpenChange={handleCloseDeleteConfirm}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-96 bg-white rounded-xl shadow-2xl p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Kullanıcıyı Sil
                  </h3>
                  <p className="text-sm text-gray-500">
                    Bu işlem geri alınamaz. Devam etmek istediğinizden emin
                    misiniz?
                  </p>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={handleCloseDeleteConfirm}
                  >
                    Vazgeç
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                    onClick={handleConfirmDelete}
                  >
                    Sil
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
