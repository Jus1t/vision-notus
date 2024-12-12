import React from 'react';
import { exportToExcel } from '../Cards/exportToExcel';

const ExportButton = ({ data, fileName, headers, buttonLabel = 'Export to Excel' }) => {
  const handleExport = () => {
    exportToExcel(data, fileName, headers);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-indigo-400 text-blue font-bold uppercase text-xs px-4 py-2 hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
    >
      {buttonLabel}
    </button>
  );
};

export default ExportButton;
