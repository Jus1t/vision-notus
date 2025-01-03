// src/components/utils/Table.js
import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
