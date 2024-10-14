import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Select from "react-select";

// Use the same imports and styles from the original CardCreateBOQ

export default function CardViewBOQ({ match, color = "light" }) {
  const [tableData, setTableData] = useState([]);
  const [totalSorAmount, setTotalSorAmount] = useState(0);

  // Fetch the BOQ details based on the serial number from match.params
  useEffect(() => {
    const fetchBOQDetails = async () => {
      const boqSerialNo = match.params.boqSerialNo; // Get BOQ Serial No from route params
      // Fetch BOQ details by serial no (dummy data for now)
      // Replace with actual API call
      setTableData([
        { productName: { label: "Item 1" }, quantity: 10, sorRate: 50, sorAmount: 500 },
        { productName: { label: "Product 2" }, quantity: 5, sorRate: 200, sorAmount: 1000 },
      ]);
    };
    fetchBOQDetails();
  }, [match.params.boqSerialNo]);

  useEffect(() => {
    const total = tableData.reduce((acc, row) => acc + row.sorAmount, 0);
    setTotalSorAmount(total.toFixed(2));
  }, [tableData]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.text("BOQ Details", 14, 16);
    doc.autoTable({
      head: [["#", "Product/Item Name", "Quantity", "SOR Rate", "SOR Amount"]],
      body: tableData.map((row, index) => [
        index + 1,
        row.productName.label,
        row.quantity,
        row.sorRate,
        row.sorAmount.toFixed(2),
      ]),
    });
    doc.text(`Total SOR Amount: ${totalSorAmount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("BOQ.pdf");
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">View BOQ</h6>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Same table as in CardCreateBOQ */}
        <table className="items-center w-full bg-transparent border-collapse table-auto">
          {/* Table structure is the same as the one you have in CardCreateBOQ */}
          {/* Add/Edit/Delete functionalities can also be reused here */}
        </table>
      </div>

      {/* Print and Save PDF buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          className="bg-green-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
          onClick={handleSaveAsPDF}
        >
          Save as PDF
        </button>
      </div>

      {/* Total SOR Amount */}
      <div className="mt-4">
        <h6 className="text-blueGray-700 text-lg font-bold">
          Total SOR Amount: {totalSorAmount}
        </h6>
      </div>
    </div>
  );
}
