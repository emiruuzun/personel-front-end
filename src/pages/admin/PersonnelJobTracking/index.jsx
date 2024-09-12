import React, { useState, useEffect } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getAllCompanies, getAllUsers } from "../../../services/admin";

function PersonnelJobTrackingPage() {
  const [selectedDate] = useState(new Date().toLocaleDateString());
  const [companies, setCompanies] = useState([]);
  const [unassignedPersonnel, setUnassignedPersonnel] = useState([]);

  useEffect(() => {
    // API'den firmaları al
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        if (response.success) {
          // Firmaları al ve state'e kaydet
          const formattedCompanies = response.data.map((company) => ({
            id: company._id,
            name: company.name,
            personnel: [],
          }));
          setCompanies(formattedCompanies);
        }
      } catch (error) {
        console.error("Firmalar alınamadı.", error);
      }
    };

    // API'den tüm personelleri al
    const fetchPersonnel = async () => {
      try {
        const response = await getAllUsers(); // Tüm personelleri çek
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

    fetchCompanies();
    fetchPersonnel();
  }, []);

  // Handle personnel assignment to a company
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

      // Remove the assigned personnel from the unassigned list
      setUnassignedPersonnel((prevPersonnel) =>
        prevPersonnel.filter((p) => p.id !== personnelId)
      );
    }
  };

  // Analyze unassigned personnel and show assigned personnel by company
  const handleAnalyzePersonnel = () => {
    console.log("Boşta Kalan Personel:", unassignedPersonnel);
    companies.forEach((company) => {
      console.log(
        `Firma: ${company.name}`,
        "Atanan Personel:",
        company.personnel
      );
    });
  };

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Personel İş Takibi - {selectedDate}
        </h2>

        {/* Company List */}
        {companies.map((company) => (
          <div key={company.id} className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-gray-700">
              {company.name}
            </h3>

            {/* Select box to add personnel */}
            <select
              onChange={(e) =>
                handleAssignPersonnel(company.id, e.target.value)
              }
              defaultValue=""
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Personel Ekle
              </option>
              {unassignedPersonnel.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            {/* List of assigned personnel */}
            <ul className="list-disc ml-5">
              {company.personnel.map((person) => (
                <li key={person.id} className="text-gray-600">
                  {person.name}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Button to analyze unassigned personnel */}
        <button
          onClick={handleAnalyzePersonnel}
          className="py-2 px-4 bg-blue-600 text-white font-bold rounded-lg mt-4"
        >
          Boşta Kalan Personeli Analiz Et
        </button>

        {/* Display Unassigned Personnel */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Boşta Kalan Personel
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <ul className="list-disc ml-5">
              {unassignedPersonnel.map((person) => (
                <li key={person.id} className="text-gray-600">
                  {person.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Display Assigned Personnel by Company */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Firmalara Atanan Personel
          </h3>
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
            >
              <h4 className="text-lg font-semibold mb-2 text-gray-700">
                {company.name}
              </h4>
              {company.personnel.length > 0 ? (
                <ul className="list-disc ml-5">
                  {company.personnel.map((person) => (
                    <li key={person.id} className="text-gray-600">
                      {person.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Atanan personel yok.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardlayout>
  );
}

export default PersonnelJobTrackingPage;
