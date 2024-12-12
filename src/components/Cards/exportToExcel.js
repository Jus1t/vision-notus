// src/utils/exportToExcel.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports JSON data to an Excel file.
 *
 * @param {Array<Object>} data - The data to export.
 * @param {string} fileName - The name of the Excel file.
 * @param {Array<string>} headers - The headers for the Excel columns.
 */
export const exportToExcel = (data, fileName, headers = []) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // If headers are provided, prepend them to the data
  const worksheetData = headers.length
    ? [headers, ...data.map(item => headers.map(header => item[header]))]
    : data;

  // Convert JSON data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: headers.length === 0 });

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate a buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a Blob from the buffer
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Save the file using FileSaver
  saveAs(dataBlob, `${fileName}.xlsx`);
};
