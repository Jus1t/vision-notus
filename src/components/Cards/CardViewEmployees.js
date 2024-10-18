import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'views/auth/api';

const CardViewEmployees = ({ color = "light" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const usersPerPage = 10; // Number of users per page
  const history = useHistory();

  const columnbaseclass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user-profile')
        setUsers(response.data)

        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleShowDetails = (employeeId) => {
    history.push(`/admin/employee/${employeeId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatRoleName = (role) => {
    if (!role) return '';
    return role
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, function(str){ return str.toUpperCase(); }); // Capitalize the first letter
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const totalPages = Math.ceil(users.length / usersPerPage);

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
            Employees
          </h3>
        </div>
      </div>
    </div>
    <div className="block w-full overflow-x-auto">
      {/* Employees table */}
      <table className="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th className={columnbaseclass + columnselectedclass}>Name</th>
            <th className={columnbaseclass + columnselectedclass}>Role</th>
            <th className={columnbaseclass + columnselectedclass}>Email</th>
            <th className={columnbaseclass + columnselectedclass}>Phone</th>
            <th
              className={
                "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                (color === "light"
                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                  : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
              }
            >
              Action
            </th> 
          </tr>
        </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td className={tdClass}> {user.FirstName} {user.LastName} </td>
                  <td className={tdClass}> {formatRoleName(user.Role)} </td>
                  <td className={tdClass}> {user.Email}  </td>
                  <td className={tdClass}> {user.PhoneNumber} </td>
                  <td className={tdClass}> <button
                      onClick={() => handleShowDetails(user.EmployeeObjectId)}
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    >
                      Details
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

export default CardViewEmployees;
