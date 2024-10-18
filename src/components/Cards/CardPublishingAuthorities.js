import React, { useState, useEffect } from 'react';
import api from 'views/auth/api';

const CardPublishingAuthorities = ({ color = "light" }) => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAuthorityId, setEditingAuthorityId] = useState(null);
  const [editedAuthorityData, setEditedAuthorityData] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const authoritiesPerPage = 10; // Number of authorities per page

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const response = await api.get('/publishing-auth');
        setAuthorities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching authorities:', error);
        setLoading(false);
      }
    };

    fetchAuthorities();
  }, []);

  const handleEditAuthority = (authority) => {
    setEditingAuthorityId(authority._id);
    setEditedAuthorityData({
      name: authority.name,
      company: authority.company,
      location: authority.location,
      phone: authority.phone,
      email: authority.email,
    });
  };

  const handleSaveAuthority = async (authorityId) => {
    try {
      // Make API call to update the authority
      await api.put(`/publishing-auth/${authorityId}`, editedAuthorityData);
      // Update the authority in the state
      setAuthorities((prevAuthorities) =>
        prevAuthorities.map((authority) =>
          authority._id === authorityId ? { ...authority, ...editedAuthorityData } : authority
        )
      );
      // Reset editing state
      setEditingAuthorityId(null);
      setEditedAuthorityData({});
    } catch (error) {
      console.error('Error updating authority:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAuthorityId(null);
    setEditedAuthorityData({});
  };

  const handleDeleteAuthority = async (authorityId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this authority?");
    if (confirmDelete) {
      try {
        // Make API call to delete the authority
        await api.delete(`/publishing-auth/${authorityId}`);
        // Remove the authority from the state
        setAuthorities((prevAuthorities) =>
          prevAuthorities.filter((authority) => authority._id !== authorityId)
        );
      } catch (error) {
        console.error('Error deleting authority:', error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current authorities for pagination
  const indexOfLastAuthority = currentPage * authoritiesPerPage;
  const indexOfFirstAuthority = indexOfLastAuthority - authoritiesPerPage;
  const currentAuthorities = authorities.slice(indexOfFirstAuthority, indexOfLastAuthority);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const totalPages = Math.ceil(authorities.length / authoritiesPerPage);

  // Define classes for styling
  const columnbaseclass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass =
    "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

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
              Publishing Authorities
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Authorities table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={columnbaseclass + columnselectedclass}>Name</th>
              <th className={columnbaseclass + columnselectedclass}>Company</th>
              <th className={columnbaseclass + columnselectedclass}>Location</th>
              <th className={columnbaseclass + columnselectedclass}>Phone</th>
              <th className={columnbaseclass + columnselectedclass}>Email</th>
              <th className={columnbaseclass + columnselectedclass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAuthorities.map((authority) => (
              <tr key={authority._id}>
                {authority._id === editingAuthorityId ? (
                  // Render input fields for editing
                  <>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedAuthorityData.name}
                        onChange={(e) =>
                          setEditedAuthorityData({ ...editedAuthorityData, name: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedAuthorityData.company}
                        onChange={(e) =>
                          setEditedAuthorityData({ ...editedAuthorityData, company: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedAuthorityData.location}
                        onChange={(e) =>
                          setEditedAuthorityData({
                            ...editedAuthorityData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="text"
                        value={editedAuthorityData.phone}
                        onChange={(e) =>
                          setEditedAuthorityData({ ...editedAuthorityData, phone: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      <input
                        type="email"
                        value={editedAuthorityData.email}
                        onChange={(e) =>
                          setEditedAuthorityData({ ...editedAuthorityData, email: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className={tdClass}>
                      {/* Save and Cancel Buttons */}
                      <button
                        type="button"
                        onClick={() => handleSaveAuthority(authority._id)}
                        className="bg-lightBlue-500 text-white active:bg-green-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-orange-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // Render normal display
                  <>
                    <td className={tdClass}>{authority.name}</td>
                    <td className={tdClass}>{authority.company}</td>
                    <td className={tdClass}>{authority.location}</td>
                    <td className={tdClass}>{authority.phone}</td>
                    <td className={tdClass}>{authority.email}</td>
                    <td className={tdClass}>
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleEditAuthority(authority)}
                        className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteAuthority(authority._id)}
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
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

export default CardPublishingAuthorities;
