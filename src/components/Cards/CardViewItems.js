import React, { useState, useEffect } from 'react';
import api from 'views/auth/api'; // Replace with your actual API import
import ExportButton from '../Buttons/ExportButton';

// Dummy data in case API call fails
const dummyItems = [
  {
    _id: '1',
    ItemSerialNo: '1001',
    ShortDesc: 'Item 1 short desc',
    LongDesc: 'This is a long description of item 1',
    Uom: 'pcs',
  },
  {
    _id: '2',
    ItemSerialNo: '1002',
    ShortDesc: 'Item 2 short desc',
    LongDesc: 'This is a long description of item 2',
    Uom: 'kg',
  },
  {
    _id: '3',
    ItemSerialNo: '1003',
    ShortDesc: 'Item 3 short desc',
    LongDesc: 'This is a long description of item 3',
    Uom: 'ltr',
  },
];

const CardViewItems = ({ color = "light" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 10; // Number of items per page


  
  
  const columnbaseclass =
  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/item-details'); // Replace with your actual endpoint
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

  const excelHeaders = ["ItemSerialNo", "ShortDesc", "LongDesc", "Uom"];
    const exportData = items.map(item => ({
    ItemSerialNo: item.ItemSerialNo,
    ShortDesc: item.ShortDesc,
    LongDesc: item.LongDesc,
    Uom: item.Uom,
  }));

  const handleEditItem = (item) => {
    setEditingItemId(item._id);
    setEditedItemData({
      ItemSerialNo: item.ItemSerialNo,
      ShortDesc: item.ShortDesc,
      LongDesc: item.LongDesc,
      Uom: item.Uom,
    });
  };

  const handleSaveItem = async (itemId) => {
    try {
      // Make API call to update the item
      await api.put(`/item-details/${itemId}`, editedItemData);
      // Update the item in the state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, ...editedItemData } : item
        )
      );
      // Reset editing state
      setEditingItemId(null);
      setEditedItemData({});
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedItemData({});
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await api.delete(`/item-details/${itemId}`);
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
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <ExportButton
              data={exportData}
              fileName="Items"
              headers={excelHeaders}
              buttonLabel="Export to Excel"
            />
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
                {item._id === editingItemId ? (
                  // Render input fields
                  <>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedItemData.ItemSerialNo}
                        onChange={(e) => setEditedItemData({ ...editedItemData, ItemSerialNo: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedItemData.ShortDesc}
                        onChange={(e) => setEditedItemData({ ...editedItemData, ShortDesc: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedItemData.LongDesc}
                        onChange={(e) => setEditedItemData({ ...editedItemData, LongDesc: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedItemData.Uom}
                        onChange={(e) => setEditedItemData({ ...editedItemData, Uom: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      {/* Save and Cancel Buttons */}
                      <button
                        type='button'
                        onClick={() => handleSaveItem(item._id)}
                        className="bg-lightBlue-500 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Save
                      </button>
                      <button
                        type='button'
                        onClick={handleCancelEdit}
                        className="bg-orange-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // Render normal display
                  <>
                    <td className={tdClass}>{item.ItemSerialNo}</td>
                    <td className={tdClass}>{item.ShortDesc}</td>
                    <td className={tdClass}>{item.LongDesc}</td>
                    <td className={tdClass}>{item.Uom}</td>
                    <td className={tdClass}>
                      {/* Edit Button */}
                      <button
                        type='button'
                        onClick={() => handleEditItem(item)}
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
                  </>
                )}
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
