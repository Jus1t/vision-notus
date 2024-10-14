import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'views/auth/api'; // Replace with your actual API import

// Dummy data in case API call fails
const dummyItems = [
  {
    _id: '1',
    itemSerialNo: '1001',
    shortDescription: 'Item 1 short desc',
    longDescription: 'This is a long description of item 1',
    unit: 'pcs',
  },
  {
    _id: '2',
    itemSerialNo: '1002',
    shortDescription: 'Item 2 short desc',
    longDescription: 'This is a long description of item 2',
    unit: 'kg',
  },
  {
    _id: '3',
    itemSerialNo: '1003',
    shortDescription: 'Item 3 short desc',
    longDescription: 'This is a long description of item 3',
    unit: 'ltr',
  },
];

const CardViewItems = ({ color = "light" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 10; // Number of items per page
  const history = useHistory();

  const columnbaseclass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items'); // Replace with your actual endpoint
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items, using dummy data:', error);
        setItems(dummyItems); // Populate with dummy data if API call fails
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleEditItem = (itemId) => {
    history.push(`/admin/item/edit/${itemId}`);
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await api.delete(`/items/${itemId}`); // Replace with your delete API endpoint
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              Items
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Items table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={columnbaseclass + columnselectedclass}>Item Serial No</th>
              <th className={columnbaseclass + columnselectedclass}>Short Description</th>
              <th className={columnbaseclass + columnselectedclass}>Long Description</th>
              <th className={columnbaseclass + columnselectedclass}>Unit of Measurement</th>
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
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td className={tdClass}>{item.itemSerialNo}</td>
                <td className={tdClass}>{item.shortDescription}</td>
                <td className={tdClass}>{item.longDescription}</td>
                <td className={tdClass}>{item.unit}</td>
                <td className={tdClass}>
                  {/* Edit Button */}
                  <button
                    type='button'
                    onClick={() => handleEditItem(item._id)}
                    className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    type='button'
                    onClick={() => handleDeleteItem(item._id)}
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-300 rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CardViewItems;
