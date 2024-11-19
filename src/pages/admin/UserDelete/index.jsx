import React, { useEffect, useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  getAllUsers,
  deleteUserAdmin,
  createLeaveAPI,
} from "../../../services/admin";
import * as Dialog from "@radix-ui/react-dialog";
import {
  FaUser,
  FaCalendarAlt,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaUsers,
  FaUserClock,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

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
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    onLeaveUsers: 0,
    pendingVerification: 0,
  });

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
          updateStats(response.data);
        }
      } catch (error) {
        console.error("Users could not be fetched.", error);
        toast.error("Kullanıcılar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateStats = (userData) => {
    setStats({
      totalUsers: userData.length,
      activeUsers: userData.filter((user) => user.status === "Aktif").length,
      onLeaveUsers: userData.filter((user) => user.status === "İzinli").length,
      pendingVerification: userData.filter((user) => !user.isVerify).length,
    });
  };

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
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        toast.success("Kullanıcı başarıyla silindi.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Kullanıcı silinirken bir hata oluştu.");
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
      startDate,
      endDate,
      reason: e.target.reason.value,
      leaveDays: calculatedDays,
    };

    try {
      const response = await createLeaveAPI(leaveData);
      if (response.success) {
        toast.success("İzin başarıyla oluşturuldu");
        handleCloseLeaveModal();
        const updatedResponse = await getAllUsers();
        if (updatedResponse.success) {
          setUsers(updatedResponse.data);
          updateStats(updatedResponse.data);
        }
      }
    } catch (error) {
      console.error("İzin oluşturulurken bir hata oluştu:", error);
      toast.error("İzin oluşturulurken bir hata oluştu");
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <FaUser className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <div>
          {user.isVerify ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <FaCheck className="w-4 h-4 mr-1" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <FaTimes className="w-4 h-4 mr-1" />
              Not Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => setSelectedUser(user)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaInfoCircle className="w-4 h-4 mr-2" />
          Detaylar
        </button>
        <button
          onClick={() => handleOpenLeaveModal(user)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FaUserClock className="w-4 h-4 mr-2" />
          İzin Oluştur
        </button>
        <button
          onClick={() => handleShowDelete(user._id)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FaTrash className="w-4 h-4 mr-2" />
          Sil
        </button>
      </div>
    </div>
  );

  const StatsCard = ({ icon: Icon, title, value, bgColor, textColor }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`rounded-lg ${bgColor} ${textColor} p-3`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter((user) => {
    const groupMatch = selectedGroup === "Tümü" || user.group === selectedGroup;
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return groupMatch && searchMatch;
  });

  return (
    <AdminDashboardlayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Personel Yönetimi
            </h1>
            <p className="mt-2 text-gray-600">
              Tüm personel bilgilerini yönetin ve izleyin
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={FaUsers}
              title="Toplam Personel"
              value={stats.totalUsers}
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            <StatsCard
              icon={FaUser}
              title="Aktif Personel"
              value={stats.activeUsers}
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            <StatsCard
              icon={FaUserClock}
              title="İzindeki Personel"
              value={stats.onLeaveUsers}
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
            <StatsCard
              icon={FaInfoCircle}
              title="Onay Bekleyen"
              value={stats.pendingVerification}
              bgColor="bg-red-100"
              textColor="text-red-600"
            />
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="İsim veya email ile ara..."
                />
              </div>
              <div>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                >
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* User Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>

        {/* İzin Modal */}
        {showLeaveModal && leaveUser && (
          <Dialog.Root
            open={showLeaveModal}
            onOpenChange={handleCloseLeaveModal}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white rounded-xl shadow-2xl p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">
                {leaveUser.name} için İzin Oluştur
              </Dialog.Title>
              <form onSubmit={handleSubmitLeave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İzin Türü
                  </label>
                  <select
                    name="leaveType"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Yıllık İzin">Yıllık İzin</option>
                    <option value="Hastalık İzni">Hastalık İzni</option>
                    <option value="Mazeret İzni">Mazeret İzni</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Başlangıç Tarihi
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Bitiş Tarihi
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-blue-700 font-medium">
                        Toplam İzin Süresi:{" "}
                        <span className="font-bold">{leaveDays} gün</span>
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İzin Nedeni
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="İzin alma nedeninizi açıklayın..."
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseLeaveModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaTimes className="h-4 w-4 mr-2" />
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaCheck className="h-4 w-4 mr-2" />
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
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white rounded-xl shadow-2xl p-6">
              <div className="mb-6">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Kullanıcı Detayları
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedUser.name} kullanıcısının detaylı bilgileri
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Durum</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.status}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Pozisyon</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.position}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">TC Kimlik No</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.tcNo}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">İletişim</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.contact}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <FaTimes className="h-4 w-4 mr-2" />
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
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm bg-white rounded-xl shadow-2xl p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FaTrash className="h-6 w-6 text-red-600" />
                </div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                  Kullanıcıyı Sil
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  Bu işlem geri alınamaz. Devam etmek istediğinizden emin
                  misiniz?
                </p>
              </div>

              <div className="mt-6 flex justify-center space-x-3">
                <button
                  onClick={handleCloseDeleteConfirm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaTimes className="h-4 w-4 mr-2" />
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaTrash className="h-4 w-4 mr-2" />
                  Sil
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </div>
    </AdminDashboardlayout>
  );
}

export default GetAllUsers;
