import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function CardViewBOQs({ color = "light" }) {
  const [boqData, setBoqData] = useState([]);
  const history = useHistory(); // Hook for navigation

  // Fetch BOQ data from API or use dummy data
  useEffect(() => {
    const fetchBOQs = async () => {
      try {
        const response = await axios.get("/api/boqs"); // Example API endpoint for BOQ data
        setBoqData(response.data);
      } catch (error) {
        console.error("Error fetching BOQ data, using dummy data", error);
        // Dummy data
        setBoqData([
          { boqSerialNo: "BOQ001", publishingAuthority: "Authority 1", tenderNo: "TENDER001" },
          { boqSerialNo: "BOQ002", publishingAuthority: "Authority 2", tenderNo: "TENDER002" },
        ]);
      }
    };
    fetchBOQs();
  }, []);

  const handleViewBOQ = (boqSerialNo) => {
    history.push(`/boq/${boqSerialNo}`); // Navigate to the detailed BOQ view
  };

  const columnBaseClass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnSelectedClass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
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
              <th className={columnBaseClass + columnSelectedClass}>Tender No</th>
              <th className={columnBaseClass + columnSelectedClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {boqData.map((boq, index) => (
              <tr key={index}>
                <td className={tdClass}>{boq.boqSerialNo}</td>
                <td className={tdClass}>{boq.publishingAuthority}</td>
                <td className={tdClass}>{boq.tenderNo}</td>
                <td className={tdClass}>
                  <button
                    className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                    onClick={() => handleViewBOQ(boq.boqSerialNo)}
                  >
                    View BOQ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
