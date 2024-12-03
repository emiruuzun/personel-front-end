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
  FaBriefcase,
  FaIdCard,
  FaPhone,
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    onLeaveUsers: 0,
    inactiveUsers: 0,
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
      inactiveUsers: userData.filter((user) => user.status === "Pasif").length,
    });
  };

  const handleStatusCardClick = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const getStatusModalTitle = () => {
    switch (selectedStatus) {
      case "active":
        return "Aktif Personel Listesi";
      case "onLeave":
        return "İzindeki Personel Listesi";
      case "inactive":
        return "Pasif Personel Listesi";
      case "total":
        return "Tüm Personel Listesi";
      default:
        return "";
    }
  };

  const getFilteredUsersByStatus = () => {
    switch (selectedStatus) {
      case "active":
        return users.filter((user) => user.status === "Aktif");
      case "onLeave":
        return users.filter((user) => user.status === "İzinli");
      case "inactive":
        return users.filter((user) => user.status === "Pasif");
      case "total":
        return users;
      default:
        return [];
    }
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

  const filteredUsers = users.filter((user) => {
    const groupMatch = selectedGroup === "Tümü" || user.group === selectedGroup;
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return groupMatch && searchMatch;
  });

  return (
    <AdminDashboardlayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Personel Yönetimi
            </h1>
            <p className="mt-2 text-gray-600">
              Tüm personel bilgilerini tek noktadan yönetin
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => handleStatusCardClick("total")}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-2xl p-4">
                    <FaUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Toplam Personel
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1" />
            </div>

            <div
              onClick={() => handleStatusCardClick("active")}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-2xl p-4">
                    <FaUser className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Aktif Personel
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-1" />
            </div>

            <div
              onClick={() => handleStatusCardClick("onLeave")}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-2xl p-4">
                    <FaUserClock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      İzindeki Personel
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.onLeaveUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-1" />
            </div>

            <div
              onClick={() => handleStatusCardClick("inactive")}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-2xl p-4">
                    <FaUserClock className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Pasif Personel
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.inactiveUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 h-1" />
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="İsim veya email ile ara..."
                />
              </div>
              <div>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* User Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    user.status === "İzinli"
                      ? "border-l-4 border-yellow-400"
                      : user.status === "Pasif"
                      ? "border-l-4 border-red-400"
                      : "border-l-4 border-green-400"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`rounded-2xl p-3 ${
                            user.status === "İzinli"
                              ? "bg-yellow-100"
                              : user.status === "Pasif"
                              ? "bg-red-100"
                              : "bg-green-100"
                          }`}
                        >
                          <FaUser
                            className={`h-6 w-6 ${
                              user.status === "İzinli"
                                ? "text-yellow-600"
                                : user.status === "Pasif"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div>
                        {user.status === "İzinli" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <FaCheck className="w-4 h-4 mr-1" />
                            İzinli
                          </span>
                        ) : user.status === "Pasif" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <FaTimes className="w-4 h-4 mr-1" />
                            Pasif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FaCheck className="w-4 h-4 mr-1" />
                            Aktif
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                      >
                        <FaInfoCircle className="w-4 h-4 mr-2" />
                        Detaylar
                      </button>
                      <button
                        onClick={() => handleOpenLeaveModal(user)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      >
                        <FaUserClock className="w-4 h-4 mr-2" />
                        İzin Oluştur
                      </button>
                      <button
                        onClick={() => handleShowDelete(user._id)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                      >
                        <FaTrash className="w-4 h-4 mr-2" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Modal */}
        {showStatusModal && (
          <Dialog.Root
            open={showStatusModal}
            onOpenChange={() => setShowStatusModal(false)}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white rounded-2xl shadow-2xl p-6">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900">
                {getStatusModalTitle()}
              </Dialog.Title>

              <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredUsersByStatus().map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-50 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <FaUser className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Pozisyon:</span>{" "}
                          {user.position}
                        </p>
                        <p>
                          <span className="font-medium">Grup:</span>{" "}
                          {user.group}
                        </p>
                        {user.status === "İzinli" && (
                          <p>
                            <span className="font-medium">İzin Bitiş:</span>{" "}
                            {user.leaveEndDate}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  <FaTimes className="h-4 w-4 mr-2" />
                  Kapat
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        )}

        {/* Leave Modal */}
        {showLeaveModal && leaveUser && (
          <Dialog.Root
            open={showLeaveModal}
            onOpenChange={handleCloseLeaveModal}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900">
                {leaveUser.name} için İzin Oluştur
              </Dialog.Title>
              <form onSubmit={handleSubmitLeave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İzin Türü
                  </label>
                  <select
                    name="leaveType"
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Yıllık İzin">Yıllık İzin</option>
                    <option value="Mazeret İzni">Mazeret İzni</option>
                    <option value="Ücretsiz İzin">Ücretsiz İzin</option>
                    <option value="Raporlu">Raporlu</option>
                    <option value="Ücretli İzin">Ücretli İzin</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      required
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="bg-blue-50 rounded-xl p-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İzin Nedeni
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İzin alma nedeninizi açıklayın..."
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseLeaveModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <FaTimes className="h-4 w-4 mr-2" />
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
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
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Kullanıcı Detayları
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedUser.name} kullanıcısının detaylı bilgileri
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <FaBriefcase className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Durum</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <FaUser className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Pozisyon</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.position}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <FaIdCard className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">TC Kimlik No</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.tcNo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <FaPhone className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">İletişim</p>
                      <p className="font-medium text-gray-900">
                        {selectedUser.contact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
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
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FaTrash className="h-6 w-6 text-red-600" />
                </div>
                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  <FaTimes className="h-4 w-4 mr-2" />
                  Vazgeç
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
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
