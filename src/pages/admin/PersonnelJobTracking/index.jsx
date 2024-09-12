import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getAllCompanies, getAllUsers } from "../../../services/admin";
import { FaUsers, FaBuilding, FaUserPlus, FaUserMinus } from "react-icons/fa";

function PersonnelJobTrackingPage() {
  const [selectedDate] = useState(new Date().toLocaleDateString());
  const [companies, setCompanies] = useState([]);
  const [unassignedPersonnel, setUnassignedPersonnel] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
    fetchPersonnel();
  }, []);

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

  const fetchPersonnel = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        const personnelData = response.data.map((person) => ({
          id: person._id,
          name: person.name,
        }));
        setUnassignedPersonnel(personnelData);
      }
    } catch (error) {
      console.error("Personeller alınamadı.", error);
    }
  };

  const handleAssignPersonnel = (companyId, personnelId) => {
    const selectedPersonnel = unassignedPersonnel.find(
      (p) => p.id === personnelId
    );
    if (selectedPersonnel) {
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? {
                ...company,
                personnel: [...company.personnel, selectedPersonnel],
              }
            : company
        )
      );
      setUnassignedPersonnel((prevPersonnel) =>
        prevPersonnel.filter((p) => p.id !== personnelId)
      );
    }
  };

  const handleUnassignPersonnel = (companyId, personnelId) => {
    const company = companies.find((c) => c.id === companyId);
    const personnelToUnassign = company.personnel.find(
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
      setUnassignedPersonnel((prev) => [...prev, personnelToUnassign]);
    }
  };

  const filteredPersonnel = unassignedPersonnel.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <FaUsers className="mr-2" /> Personel İş Takibi - {selectedDate}
        </h2>

        <div className="flex gap-6">
          {/* Company List */}
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

          {/* Active Company Details and Unassigned Personnel */}
          <div className="w-3/4 space-y-6">
            {/* Active Company Details */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              {activeCompany && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {companies.find((c) => c.id === activeCompany)?.name}
                  </h3>

                  {/* Assigned Personnel */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">
                      Atanmış Personel
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {companies
                        .find((c) => c.id === activeCompany)
                        ?.personnel.map((person) => (
                          <div
                            key={person.id}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded"
                          >
                            <span>{person.name}</span>
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
                              <FaUserMinus size={20} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unassigned Personnel */}
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
                      onClick={() =>
                        handleAssignPersonnel(activeCompany, person.id)
                      }
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
      </div>
    </AdminDashboardlayout>
  );
}

export default PersonnelJobTrackingPage;
