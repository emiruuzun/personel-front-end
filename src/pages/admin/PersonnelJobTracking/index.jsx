import React, { useState, useEffect, useCallback } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import {
  getAllCompanies,
  getAllUsers,
  addDailyWorkRecord,
  updateDailyWorkRecord,
  getDailyWorkRecords,
  deleteDailyWorkRecord,
  getLastLeaveByUserId,
  getJobsByCompanyId,
} from "../../../services/admin";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";

import {
  FaUsers,
  FaBuilding,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaTimes,
  FaSave,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";

function PersonnelJobTrackingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [unassignedPersonnel, setUnassignedPersonnel] = useState([]);
  const [inactivePersonnel, setInactivePersonnel] = useState([]);
  const [allPersonnelWithLeave, setAllPersonnelWithLeave] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [selectedJob, setSelectedJob] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Tümü");
  const [editingPerson, setEditingPerson] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPersonnelForAssignment, setSelectedPersonnelForAssignment] =
    useState(null);
  const [assignmentJobStartTime, setAssignmentJobStartTime] = useState("");
  const [temporaryAssignments, setTemporaryAssignments] = useState([]);

  const groups = [
    "Tümü",
    "Mekanik",
    "Boru",
    "Elektrik",
    "Aksaray",
    "Kapı",
    "Ofis",
  ];

  registerLocale("tr", tr);

  const fetchAllPersonnelWithLeave = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        const personnelWithLeave = await Promise.all(
          response.data.map(async (person) => {
            const leaveData = await getLastLeaveByUserId(person._id);
            return {
              id: person._id,
              name: person.name,
              position: person.position,
              group: person.group,
              status: person.status,
              leaveStartDate: leaveData.data?.startDate || null,
              leaveEndDate: leaveData.data?.endDate || null,
              assignedAfterLeaveInfo: person.assignedAfterLeaveInfo || null,
            };
          })
        );
        setAllPersonnelWithLeave(personnelWithLeave);
      }
    } catch (error) {
      console.error("Tüm personel alınamadı.", error);
    }
  };

  const fetchDailyWorkRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await getDailyWorkRecords(formattedDate);
      if (response.success) {
        const assignedPersonnel = response.data.assigned.map((record) => ({
          id: record.personnel_id?._id,
          name: record.personnel_id?.name,
          jobStartTime: record.job_start_time,
          jobEndTime: record.job_end_time,
          overtimeHours: record.overtime_hours || {
            start_time: "",
            end_time: "",
          },
          company_id: record.company_id,
          recordId: record._id,
        }));

        const assignedPersonnelIds = assignedPersonnel.map((p) => p.id);
        const unassignedPersonnelData = allPersonnelWithLeave.filter(
          (person) => {
            const isAssigned = assignedPersonnelIds.includes(person.id);
            const isOnLeave =
              person.status === "İzinli" &&
              person.leaveStartDate &&
              person.leaveEndDate &&
              new Date(person.leaveStartDate) <= new Date(selectedDate) &&
              new Date(person.leaveEndDate) >= new Date(selectedDate);
            return !isAssigned && !isOnLeave;
          }
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
    } finally {
      setIsLoading(false);
    }
  }, [allPersonnelWithLeave, selectedDate]);

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

  const fetchJobs = async (companyId) => {
    try {
      const response = await getJobsByCompanyId(companyId);
      if (response.success) {
        const activeJobs = response.data.filter(
          (job) => job.status === "active"
        );
        setJobs(activeJobs);
      } else {
        console.error("İşler alınamadı.");
      }
    } catch (error) {
      console.error("İşler alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchCompanies();
      await fetchAllPersonnelWithLeave();
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeCompany) {
      fetchJobs(activeCompany);
    }
  }, [activeCompany]);

  useEffect(() => {
    if (allPersonnelWithLeave.length > 0) {
      fetchDailyWorkRecords();
    }
  }, [fetchDailyWorkRecords, allPersonnelWithLeave, selectedDate]);

  useEffect(() => {
    const filterPersonnel = () => {
      const assignablePersonnel = allPersonnelWithLeave.filter((person) => {
        const isActive =
          person.status === "Aktif" ||
          person.status === "Onaylanmış (Yaklaşan)";
        const isNotOnLeave =
          !person.leaveStartDate ||
          new Date(selectedDate) > new Date(person.leaveEndDate);
        return isActive && isNotOnLeave;
      });

      const inactivePersonnel = allPersonnelWithLeave.filter((person) => {
        const isOnLeave =
          person.status === "İzinli" &&
          person.leaveStartDate &&
          person.leaveEndDate &&
          new Date(person.leaveStartDate) <= selectedDate &&
          new Date(person.leaveEndDate) >= selectedDate;
        return isOnLeave;
      });

      setUnassignedPersonnel(assignablePersonnel);
      setInactivePersonnel(inactivePersonnel);
    };

    filterPersonnel();
  }, [selectedDate, allPersonnelWithLeave]);

  const openAssignModal = (person) => {
    setSelectedPersonnelForAssignment(person);
    setAssignmentJobStartTime("");
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setSelectedPersonnelForAssignment(null);
    setAssignmentJobStartTime("");
    setSelectedJob("");
    setShowAssignModal(false);
  };

  const handleConfirmAssignPersonnel = () => {
    if (
      selectedPersonnelForAssignment &&
      assignmentJobStartTime &&
      selectedJob
    ) {
      const newAssignment = {
        personnel_id: selectedPersonnelForAssignment.id,
        company_id: activeCompany,
        job_id: selectedJob,
        date: selectedDate.toISOString().split("T")[0],
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
                    jobId: selectedJob,
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
      alert("Lütfen iş başlangıç saatini ve işi seçiniz.");
    }
  };

  const handleUnassignPersonnel = async (
    companyId,
    personnelId,
    dailyRecordId
  ) => {
    try {
      const company = companies.find((c) => c.id === companyId);
      const personnelToUnassign = company?.personnel.find(
        (p) => p.id === personnelId
      );

      if (!personnelToUnassign) {
        console.error("Personnel not found");
        return;
      }

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

      await deleteDailyWorkRecord(dailyRecordId);

      console.log("Personel başarıyla atamadan çıkarıldı ve kayıt silindi.");
    } catch (error) {
      console.error("Personel atamadan çıkarılırken bir hata oluştu:", error);
      setCompanies((prevCompanies) => [...prevCompanies]);
      setUnassignedPersonnel((prev) => [...prev]);
      alert(
        "Personel atamadan çıkarılırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleUpdatePersonnelTime = async () => {
    try {
      const updateData = {
        job_end_time: editingPerson.jobEndTime || "",
        overtime_hours: {
          startTime: editingPerson.overtimeHours?.startTime || "",
          endTime: editingPerson.overtimeHours?.endTime || "",
        },
        notes: editingPerson.notes || "",
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
    if (temporaryAssignments.length === 0 && unassignedPersonnel.length === 0) {
      alert("Kaydedilecek atama bulunmamaktadır.");
      return;
    }

    try {
      const saveAssignedPromises = temporaryAssignments.map(
        async (assignment) => {
          const existingRecord = await getDailyWorkRecords(
            selectedDate.toISOString().split("T")[0]
          ).then((response) =>
            response.data.assigned.find(
              (record) => record.personnel_id._id === assignment.personnel_id
            )
          );

          if (!existingRecord) {
            console.log("Yeni atanmış personel kaydediliyor:", assignment);
            return addDailyWorkRecord({ ...assignment, isAssigned: true });
          } else {
            console.log("Mevcut atanmış personel güncelleniyor:", assignment);
            return updateDailyWorkRecord(existingRecord._id, {
              ...assignment,
              isAssigned: true,
            });
          }
        }
      );

      const saveUnassignedPromises = unassignedPersonnel.map(async (person) => {
        const existingRecord = await getDailyWorkRecords(
          selectedDate.toISOString().split("T")[0]
        ).then((response) =>
          response.data.unassigned.find(
            (record) => record.personnel_id._id === person.id
          )
        );

        const unassignedRecord = {
          personnel_id: person.id,
          company_id: null,
          date: selectedDate.toISOString().split("T")[0],
          job_start_time: "",
          job_end_time: "",
          isAssigned: false,
        };

        if (!existingRecord) {
          return addDailyWorkRecord(unassignedRecord);
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all([...saveAssignedPromises, ...saveUnassignedPromises]);

      setTemporaryAssignments([]);
      alert("Tüm atamalar başarıyla kaydedildi!");
      fetchDailyWorkRecords();
    } catch (error) {
      console.error("Atamalar kaydedilirken hata oluştu:", error);
      alert("Atamalar kaydedilirken bir hata oluştu.");
    }
  };

  const filteredPersonnel = unassignedPersonnel
    .filter(
      (person) => selectedGroup === "Tümü" || person.group === selectedGroup
    )
    .filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) {
    return (
      <AdminDashboardlayout>
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      </AdminDashboardlayout>
    );
  }

  return (
    <AdminDashboardlayout>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-500 flex items-center mb-4 sm:mb-0">
            <FaUsers className="mr-2" /> Personel İş Takibi
          </h2>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-indigo-500" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="tr"
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-4 h-auto lg:h-[calc(100vh-200px)] overflow-y-auto">
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

          <div className="w-full lg:w-3/4 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {activeCompany && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                    {companies.find((c) => c.id === activeCompany)?.name}
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">
                      Atanmış Personel
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {companies
                        .find((c) => c.id === activeCompany)
                        ?.personnel.map((person) => (
                          <div
                            key={person.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 rounded-lg shadow"
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
                              {person.overtimeHours?.start_time &&
                                person.overtimeHours?.end_time && (
                                  <div className="text-sm text-gray-600">
                                    Mesai Saatleri:{" "}
                                    {person.overtimeHours.start_time} -{" "}
                                    {person.overtimeHours.end_time}
                                  </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
                                    person.id,
                                    person.recordId
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

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2 bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaUserPlus className="mr-2" /> Atanabilir Personel
                </h3>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                >
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Personel Ara..."
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {filteredPersonnel.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <div className="flex-1">
                        <span className="block font-medium">{person.name}</span>
                        <span className="text-sm text-gray-500">
                          {person.group} Grubu
                        </span>
                      </div>
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
              <div className="w-full sm:w-1/2 bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaUserMinus className="mr-2" /> İzinli Personel
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {inactivePersonnel.map((person) => (
                    <div
                      key={person.id}
                      className="flex flex-col bg-gray-100 p-3 rounded-lg"
                    >
                      <span className="font-medium text-indigo-600">
                        {person.name}
                      </span>
                      {person.leaveStartDate && person.leaveEndDate ? (
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="block">
                            İzin Başlangıcı:{" "}
                            {new Date(person.leaveStartDate).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                          <span className="block">
                            İzin Bitişi:{" "}
                            {new Date(person.leaveEndDate).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                          {person.assignedAfterLeaveInfo && (
                            <div className="mt-2 text-blue-600">
                              <strong>İş Dönüşü Planlanan İş: </strong>
                              {person.assignedAfterLeaveInfo}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-red-500 mt-1">
                          İzin bilgisi bulunamadı.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleSaveAllAssignments}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center text-sm sm:text-base"
          >
            <FaSave className="mr-2" /> Kaydet
          </button>
        </div>
      </div>

      {showAssignModal && selectedPersonnelForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                  İş Seçin
                </label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="" disabled>
                    İş Seçin
                  </option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.jobName}
                    </option>
                  ))}
                </select>
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                  value={editingPerson.jobStartTime || ""}
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
                  value={editingPerson.jobEndTime || ""}
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
                    value={editingPerson.overtimeHours?.startTime || ""}
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
                    value={editingPerson.overtimeHours?.endTime || ""}
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
