import React, { useState, useEffect, useCallback } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  getAllCompanies,
  getAllUsers,
  addDailyWorkRecord,
  updateDailyWorkRecord,
  getDailyWorkRecords,
} from "../../../services/admin";

import {
  FaUsers,
  FaBuilding,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";

function PersonnelJobTrackingPage() {
  const currentDate = new Date().toISOString().split("T")[0];
  const [companies, setCompanies] = useState([]);
  const [unassignedPersonnel, setUnassignedPersonnel] = useState([]);
  const [allPersonnel, setAllPersonnel] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPerson, setEditingPerson] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPersonnelForAssignment, setSelectedPersonnelForAssignment] =
    useState(null);
  const [assignmentJobStartTime, setAssignmentJobStartTime] = useState("");
  const [temporaryAssignments, setTemporaryAssignments] = useState([]);

  // Fetch all personnel
  const fetchAllPersonnel = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setAllPersonnel(
          response.data.map((person) => ({
            id: person._id,
            name: person.name,
          }))
        );
      }
    } catch (error) {
      console.error("Tüm personel alınamadı.", error);
    }
  };

  // Fetch daily work records and determine unassigned personnel
  const fetchDailyWorkRecords = useCallback(async () => {
    try {
      const response = await getDailyWorkRecords(currentDate);
      if (response.success) {
        const assignedPersonnel = response.data.assigned.map((record) => ({
          id: record.personnel_id?._id,
          name: record.personnel_id?.name,
          jobStartTime: record.job_start_time,
          jobEndTime: record.job_end_time,
          overtimeHours: record.overtime_hours,
          company_id: record.company_id,
          recordId: record._id,
        }));

        const assignedPersonnelIds = assignedPersonnel.map((p) => p.id);
        const unassignedPersonnelData = allPersonnel.filter(
          (person) => !assignedPersonnelIds.includes(person.id)
        );

        setUnassignedPersonnel(unassignedPersonnelData);

        setCompanies((prevCompanies) =>
          prevCompanies.map((company) => ({
            ...company,
            personnel: assignedPersonnel.filter(
              (person) => person.company_id === company.id
            ),
          }))
        );
      }
    } catch (error) {
      console.error("Günlük iş kayıtları alınamadı.", error);
    }
  }, [allPersonnel, currentDate]);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      if (response.success) {
        const formattedCompanies = response.data.map((company) => ({
          id: company._id,
          name: company.name,
          personnel: [],
        }));
        setCompanies(formattedCompanies);
        if (formattedCompanies.length > 0) {
          setActiveCompany(formattedCompanies[0].id);
        }
      }
    } catch (error) {
      console.error("Firmalar alınamadı.", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchAllPersonnel();
  }, []);

  useEffect(() => {
    if (allPersonnel.length > 0) {
      fetchDailyWorkRecords();
    }
  }, [fetchDailyWorkRecords, allPersonnel]);

  const openAssignModal = (person) => {
    setSelectedPersonnelForAssignment(person);
    setAssignmentJobStartTime("");
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setSelectedPersonnelForAssignment(null);
    setAssignmentJobStartTime("");
    setShowAssignModal(false);
  };

  const handleConfirmAssignPersonnel = () => {
    if (selectedPersonnelForAssignment && assignmentJobStartTime) {
      const newAssignment = {
        personnel_id: selectedPersonnelForAssignment.id,
        company_id: activeCompany,
        date: currentDate,
        job_start_time: assignmentJobStartTime,
      };

      setTemporaryAssignments((prevAssignments) => [
        ...prevAssignments,
        newAssignment,
      ]);

      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === activeCompany
            ? {
                ...company,
                personnel: [
                  ...company.personnel,
                  {
                    ...selectedPersonnelForAssignment,
                    jobStartTime: assignmentJobStartTime,
                    jobEndTime: "",
                    overtimeHours: { startTime: "", endTime: "" },
                  },
                ],
              }
            : company
        )
      );

      setUnassignedPersonnel((prevPersonnel) =>
        prevPersonnel.filter((p) => p.id !== selectedPersonnelForAssignment.id)
      );

      closeAssignModal();
    } else {
      alert("Lütfen iş başlangıç saatini giriniz.");
    }
  };

  const handleUnassignPersonnel = (companyId, personnelId) => {
    const company = companies.find((c) => c.id === companyId);
    const personnelToUnassign = company?.personnel.find(
      (p) => p.id === personnelId
    );

    if (personnelToUnassign) {
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? {
                ...company,
                personnel: company.personnel.filter(
                  (p) => p.id !== personnelId
                ),
              }
            : company
        )
      );
      setUnassignedPersonnel((prev) => [
        ...prev,
        {
          id: personnelToUnassign.id,
          name: personnelToUnassign.name,
        },
      ]);
    }
  };

  const handleUpdatePersonnelTime = async () => {
    try {
      const updateData = {
        job_end_time: editingPerson.jobEndTime || "", // If undefined, set to empty string
        overtime_hours: editingPerson.overtimeHours || {
          startTime: "",
          endTime: "",
        }, // If undefined, set default values
      };

      const recordId = editingPerson.recordId;

      const updatedRecord = await updateDailyWorkRecord(recordId, updateData);

      if (updatedRecord) {
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === activeCompany
              ? {
                  ...company,
                  personnel: company.personnel.map((person) =>
                    person.id === editingPerson.id
                      ? { ...editingPerson }
                      : person
                  ),
                }
              : company
          )
        );
        closeEditModal();
      } else {
        alert("Günlük iş kaydı güncellenemedi.");
      }
    } catch (error) {
      console.error("Çalışma saatleri güncellenirken hata oluştu:", error);
      alert("Çalışma saatleri güncellenirken bir hata oluştu.");
    }
  };

  const openEditModal = (person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingPerson(null);
    setShowEditModal(false);
  };

  const handleSaveAllAssignments = async () => {
    if (temporaryAssignments.length === 0) {
      alert("Kaydedilecek atama bulunmamaktadır.");
      return;
    }

    try {
      const saveAssignedPromises = temporaryAssignments.map((assignment) =>
        addDailyWorkRecord({ ...assignment, isAssigned: true })
      );

      await Promise.all(saveAssignedPromises);

      setTemporaryAssignments([]);
      alert("Tüm atamalar başarıyla kaydedildi!");
      fetchDailyWorkRecords(); // Reload updated data
    } catch (error) {
      console.error("Atamalar kaydedilirken hata oluştu:", error);
      alert("Atamalar kaydedilirken bir hata oluştu.");
    }
  };

  const filteredPersonnel = unassignedPersonnel.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-extrabold text-indigo-500 mb-6 flex items-center">
          <FaUsers className="mr-2" /> Personel İş Takibi - {currentDate}
        </h2>

        <div className="flex gap-6">
          <div className="w-1/4 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
              <FaBuilding className="mr-2" /> Firmalar
            </h3>
            <ul>
              {companies.map((company) => (
                <li
                  key={company.id}
                  className={`mb-2 p-2 rounded-md cursor-pointer ${
                    activeCompany === company.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveCompany(company.id)}
                >
                  {company.name}
                  <span className="ml-2 text-sm text-gray-500">
                    ({company.personnel.length})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-3/4 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {activeCompany && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {companies.find((c) => c.id === activeCompany)?.name}
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">
                      Atanmış Personel
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {companies
                        .find((c) => c.id === activeCompany)
                        ?.personnel.map((person) => (
                          <div
                            key={person.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
                          >
                            <div>
                              <span className="font-medium">{person.name}</span>
                              <div className="text-sm text-gray-600">
                                İş Saatleri:
                                {person.jobStartTime && person.jobEndTime
                                  ? ` ${person.jobStartTime} - ${person.jobEndTime}`
                                  : person.jobStartTime
                                  ? ` ${person.jobStartTime} - ?`
                                  : " Saat belirtilmedi"}
                              </div>
                              {person.overtimeHours?.startTime &&
                                person.overtimeHours?.endTime && (
                                  <div className="text-sm text-gray-600">
                                    Mesai Saatleri:{" "}
                                    {person.overtimeHours.startTime} -{" "}
                                    {person.overtimeHours.endTime}
                                  </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openEditModal(person)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Düzenle"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleUnassignPersonnel(
                                    activeCompany,
                                    person.id
                                  )
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Personeli Çıkar"
                              >
                                <FaUserMinus size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FaUserPlus className="mr-2" /> Atanabilir Personel
              </h3>
              <input
                type="text"
                placeholder="Personel Ara..."
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                {filteredPersonnel.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{person.name}</span>
                    <button
                      onClick={() => openAssignModal(person)}
                      className="text-green-500 hover:text-green-700"
                      title="Personeli Ata"
                    >
                      <FaUserPlus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleSaveAllAssignments}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
          >
            <FaSave className="mr-2" /> Kaydet
          </button>
        </div>
      </div>

      {showAssignModal && selectedPersonnelForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedPersonnelForAssignment.name} için İş Başlangıç Saati
              </h3>
              <button
                onClick={closeAssignModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İş Başlangıç Saati
                </label>
                <input
                  type="time"
                  value={assignmentJobStartTime}
                  onChange={(e) => setAssignmentJobStartTime(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleConfirmAssignPersonnel}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ata
              </button>
              <button
                onClick={closeAssignModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingPerson.name} için Çalışma Saatleri
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İş Başlangıç Saati
                </label>
                <input
                  type="time"
                  value={editingPerson.jobStartTime || ""} // Varsayılan değeri boş string
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İş Bitiş Saati
                </label>
                <input
                  type="time"
                  value={editingPerson.jobEndTime || ""} // Varsayılan değeri boş string
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      jobEndTime: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesai Saatleri
                </label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={editingPerson.overtimeHours?.startTime || ""} // Varsayılan değeri boş string
                    onChange={(e) =>
                      setEditingPerson({
                        ...editingPerson,
                        overtimeHours: {
                          ...editingPerson.overtimeHours,
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="flex-1 p-2 border rounded"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="time"
                    value={editingPerson.overtimeHours?.endTime || ""} // Varsayılan değeri boş string
                    onChange={(e) =>
                      setEditingPerson({
                        ...editingPerson,
                        overtimeHours: {
                          ...editingPerson.overtimeHours,
                          endTime: e.target.value,
                        },
                      })
                    }
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleUpdatePersonnelTime}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Kaydet
              </button>
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardlayout>
  );
}

export default PersonnelJobTrackingPage;
