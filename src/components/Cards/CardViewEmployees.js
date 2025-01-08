import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'views/auth/api';
import ExportButton from '../Buttons/ExportButton'; // Import the ExportButton component

const CardViewEmployees = ({ color = "light" }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const usersPerPage = 10; // Number of users per page
  const history = useHistory();

  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user-profile');
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(user =>
      `${user.FirstName} ${user.LastName}`.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const handleNavigation = (employeeId, path) => {
    history.push(`/admin/${path}/${employeeId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatRoleName = (role) => {
    if (!role) return '';
    return role
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Prepare data for export
  const excelHeaders = ['Name', 'Role', 'Email', 'Phone'];
  const exportData = users.map(user => ({
    Name: `${user.FirstName} ${user.LastName}`,
    Role: formatRoleName(user.Role),
    Email: user.Email,
    Phone: user.PhoneNumber,
  }));

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <h3
            className={
              "font-semibold text-lg " +
              (color === "light" ? "text-blueGray-700" : "text-white")
            }
          >
            Employees
          </h3>
          <ExportButton
            data={exportData}
            fileName="Employees_List"
            headers={excelHeaders}
            buttonLabel="Export to Excel"
          />
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg w-full"
          />
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={tdClass}>Name</th>
              <th className={tdClass}>Role</th>
              <th className={tdClass}>Email</th>
              <th className={tdClass}>Phone</th>
              <th className={tdClass}>Options</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td className={tdClass}>{user.FirstName} {user.LastName}</td>
                <td className={tdClass}>{formatRoleName(user.Role)}</td>
                <td className={tdClass}>{user.Email}</td>
                <td className={tdClass}>{user.PhoneNumber}</td>
                <td className={tdClass}>
                  <select
                    onChange={(e) => handleNavigation(user.EmployeeObjectId, e.target.value)}
                    className="border rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Option</option>
                    <option value="employee">Details</option>
                    <option value="attendance-card">Card</option>
                    <option value="working-history">Work History</option>
                    <option value="payment-page">Payment</option>
                    <option value="advance-payment">Advance Payment</option>
                    <option value="view-payments">Payment History</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${
            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CardViewEmployees;
