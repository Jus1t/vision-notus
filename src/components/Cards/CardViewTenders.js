// src/components/CardTenders.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'views/auth/api';
import ExportButton from '../Buttons/ExportButton'; // Import the ExportButton component

const CardTenders = ({ color = "light" }) => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const tendersPerPage = 10; // Number of tenders per page
  const history = useHistory();
  
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await api.get('/lead'); // Fetch tenders data from your API
        setTenders(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenders:', error);
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const handleShowDetails = (tenderId) => {
    history.push(`/admin/tender/${tenderId}`);
  };

  const handleDeleteTender = async (tenderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tender?");
    if (confirmDelete) {
      try {
        await api.delete(`/lead/${tenderId}`); // API call to delete tender
        setTenders((prevTenders) => prevTenders.filter(tender => tender._id !== tenderId));
      } catch (error) {
        console.error("Error deleting tender:", error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current tenders for pagination
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tenders.slice(indexOfFirstTender, indexOfLastTender);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const totalPages = Math.ceil(tenders.length / tendersPerPage);

  // Define headers for Excel export
  const excelHeaders = ['Tender No.', 'Company Reference No.', 'Contact Details', 'Email'];

  // Prepare data for export
  const exportData = tenders.map(tender => ({
    'Tender No.': tender.TenderNo || 'N/A',
    'Company Reference No.': tender.CompanyReferenceNo || 'N/A',
    'Contact Details': tender.LeadPhoneNumber && tender.LeadPhoneNumber.length > 0
      ? tender.LeadPhoneNumber.join(', ')
      : 'N/A',
    'Email': tender.LeadEmail && tender.LeadEmail.length > 0
      ? tender.LeadEmail.join(', ')
      : 'N/A',
  }));

  // Define classes for styling
  const columnbaseclass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <h3
            className={
              "font-semibold text-lg " +
              (color === "light" ? "text-blueGray-700" : "text-white")
            }
          >
            Tenders
          </h3>
          {/* Export Button */}
          <ExportButton
            data={exportData}
            fileName="Tenders_List"
            headers={excelHeaders}
            buttonLabel="Export to Excel"
          />
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Tenders table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={columnbaseclass + columnselectedclass}>Tender No.</th>
              <th className={columnbaseclass + columnselectedclass}>Company Reference No.</th>
              <th className={columnbaseclass + columnselectedclass}>Contact Details</th>
              <th className={columnbaseclass + columnselectedclass}>Email</th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTenders.map((tender) => (
              <tr key={tender._id}>
                <td className={tdClass}> {tender.TenderNo || 'N/A'} </td>
                <td className={tdClass}> {tender.CompanyReferenceNo || 'N/A'} </td>
                <td className={tdClass}>
                  {tender.LeadPhoneNumber && tender.LeadPhoneNumber.length > 0
                    ? tender.LeadPhoneNumber.join(', ')
                    : 'N/A'}
                </td>
                <td className={tdClass}>
                  {tender.LeadEmail && tender.LeadEmail.length > 0
                    ? tender.LeadEmail.join(', ')
                    : 'N/A'}
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => handleShowDetails(tender._id)}
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDeleteTender(tender._id)}
                    className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${
            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CardTenders;
