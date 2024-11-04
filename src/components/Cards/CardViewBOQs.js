import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "views/auth/api";

export default function CardViewBOQs({ color = "light" }) {
  const [boqData, setBoqData] = useState([]);
  const [publishingAuthMap, setPublishingAuthMap] = useState({});
  const [tenderMap, setTenderMap] = useState({});
  const history = useHistory(); // Hook for navigation
  const [currentPage, setCurrentPage] = useState(1);
  const boqsPerPage = 10;

  // Fetch BOQ data from API or use dummy data
  useEffect(() => {
    const fetchBOQs = async () => {
      try {
        const response = await api.get("/boq-details"); // Fetch BOQ data
        setBoqData(response.data);
      } catch (error) {
        console.error("Error fetching BOQ data, using dummy data", error);
        setBoqData([
          { _id: "1", BoqSerialNo: "BOQ001", PublishingAuthId: "Authority 1", TenderNo: "TENDER001" },
          { _id: "2", BoqSerialNo: "BOQ002", PublishingAuthId: "Authority 2", TenderNo: "TENDER002" },
          // Add more dummy data as needed
        ]);
      }
    };

    const fetchPublishingAuths = async () => {
      try {
        const response = await api.get("/publishing-auth"); // Fetch all publishing authorities
        const authMap = response.data.reduce((map, auth) => {
          map[auth._id] = auth.name;
          return map;
        }, {});
        setPublishingAuthMap(authMap);
      } catch (error) {
        console.error("Error fetching publishing authorities:", error);
      }
    };

    const fetchTenders = async () => {
      try {
        const response = await api.get("/lead"); // Fetch all tenders
        const tenderMap = response.data.reduce((map, tender) => {
          map[tender._id] = tender.TenderName;
          return map;
        }, {});
        setTenderMap(tenderMap);
      } catch (error) {
        console.error("Error fetching tenders:", error);
      }
    };

    fetchBOQs();
    fetchPublishingAuths();
    fetchTenders();
  }, []);

  const handleViewBOQ = (boqid) => {
    history.push(`/admin/viewboq/${boqid}`); // Navigate to the detailed BOQ view
  };

  const handleDeleteBOQ = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this BOQ?");
    if (confirmDelete) {
      try {
        await api.delete(`/boq-details/${id}`); // Adjust API endpoint as needed
        // Remove the deleted BOQ from the state
        setBoqData((prevData) => prevData.filter((boq) => boq._id !== id));
      } catch (error) {
        console.error("Error deleting BOQ:", error);
      }
    }
  };

  // Pagination logic
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBOQ = currentPage * boqsPerPage;
  const indexOfFirstBOQ = indexOfLastBOQ - boqsPerPage;
  const currentBOQs = boqData.slice(indexOfFirstBOQ, indexOfLastBOQ);
  const totalPages = Math.ceil(boqData.length / boqsPerPage);

  const columnBaseClass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnSelectedClass = color === "light" ? lightClass : darkClass;
  const tdClass =
    "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <h6 className="text-blueGray-700 text-xl font-bold">View BOQs</h6>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={columnBaseClass + columnSelectedClass}>BOQ Serial No</th>
              <th className={columnBaseClass + columnSelectedClass}>Publishing Authority</th>
              <th className={columnBaseClass + columnSelectedClass}>Tender Name</th>
              <th className={columnBaseClass + columnSelectedClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBOQs.map((boq, index) => (
              <tr key={index}>
                <td className={tdClass}>{boq.BoqSerialNo}</td>
                <td className={tdClass}>{publishingAuthMap[boq.PublishingAuthId] || "N/A"}</td>
                <td className={tdClass}>{tenderMap[boq.TenderNo] || "N/A"}</td>
                <td className={tdClass}>
                  <button
                    className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mr-2"
                    onClick={() => handleViewBOQ(boq._id)}
                  >
                    View BOQ
                  </button>
                  <button
                    className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                    onClick={() => handleDeleteBOQ(boq._id)}
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
          className="px-3 py-1 mx-1 bg-gray-300 rounded"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-blueGray-400" : "bg-gray-300"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 mx-1 bg-gray-300 rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
