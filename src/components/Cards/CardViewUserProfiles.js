import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'views/auth/api';

const CardViewUserProfiles = ({ color = "light" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const usersPerPage = 10; // Number of users per page
  const history = useHistory();

  const dummyUsers = [
    { _id: '1', FirstName: 'John', LastName: 'Doe', PhoneNumber: '+1 (555) 123-4567', Email: 'john.doe@example.com', Role: 'Developer', EmployeeObjectId: '60d5ecb74f421b29c81e1111' },
    { _id: '2', FirstName: 'Jane', LastName: 'Smith', PhoneNumber: '+1 (555) 987-6543', Email: 'jane.smith@example.com', Role: 'Designer', EmployeeObjectId: '60d5ecb74f421b29c81e2222' },
    { _id: '3', FirstName: 'Mike', LastName: 'Johnson', PhoneNumber: '+1 (555) 555-5555', Email: 'mike.johnson@example.com', Role: 'Manager', EmployeeObjectId: '60d5ecb74f421b29c81e3333' },
    { _id: '4', FirstName: 'Emily', LastName: 'Brown', PhoneNumber: '+1 (555) 444-3333', Email: 'emily.brown@example.com', Role: 'QA Engineer', EmployeeObjectId: '60d5ecb74f421b29c81e4444' },
    { _id: '5', FirstName: 'Alex', LastName: 'Wilson', PhoneNumber: '+1 (555) 222-1111', Email: 'alex.wilson@example.com', Role: 'DevOps Engineer', EmployeeObjectId: '60d5ecb74f421b29c81e5555' },
    { _id: '6', FirstName: 'Sara', LastName: 'Parker', PhoneNumber: '+1 (555) 666-7777', Email: 'sara.parker@example.com', Role: 'Product Manager', EmployeeObjectId: '60d5ecb74f421b29c81e6666' },
    { _id: '7', FirstName: 'Chris', LastName: 'Evans', PhoneNumber: '+1 (555) 888-9999', Email: 'chris.evans@example.com', Role: 'Support Engineer', EmployeeObjectId: '60d5ecb74f421b29c81e7777' },
    { _id: '8', FirstName: 'Sam', LastName: 'Taylor', PhoneNumber: '+1 (555) 555-9999', Email: 'sam.taylor@example.com', Role: 'Software Architect', EmployeeObjectId: '60d5ecb74f421b29c81e8888' },
    { _id: '9', FirstName: 'Kate', LastName: 'Williams', PhoneNumber: '+1 (555) 123-5555', Email: 'kate.williams@example.com', Role: 'Scrum Master', EmployeeObjectId: '60d5ecb74f421b29c81e9999' },
    { _id: '10', FirstName: 'Paul', LastName: 'Harris', PhoneNumber: '+1 (555) 555-7777', Email: 'paul.harris@example.com', Role: 'Business Analyst', EmployeeObjectId: '60d5ecb74f421b29c81e1010' },
    { _id: '11', FirstName: 'Laura', LastName: 'Miller', PhoneNumber: '+1 (555) 000-1111', Email: 'laura.miller@example.com', Role: 'HR Manager', EmployeeObjectId: '60d5ecb74f421b29c81e1112' },
    { _id: '12', FirstName: 'Ben', LastName: 'Carter', PhoneNumber: '+1 (555) 333-2222', Email: 'ben.carter@example.com', Role: 'CTO', EmployeeObjectId: '60d5ecb74f421b29c81e1113' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // setUsers(dummyUsers);
        console.log(localStorage.getItem('authorization'))
        const response = api.get('/api/user-profiles')
        console.log(response)
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        // setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleShowDetails = (employeeId) => {
    history.push(`/employee/${employeeId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <h6 className="text-blueGray-900 text-xl font-bold">
                Employees
              </h6>
            </div>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Name
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Role
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Email
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Phone
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.FirstName} {user.LastName}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.Role}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.Email}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.PhoneNumber}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <button
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

export default CardViewUserProfiles;
