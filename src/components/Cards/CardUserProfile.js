import React from 'react';

const UserProfileCard = ({ user, onShowDetails }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{user.FirstName} {user.LastName}</h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-gray-600 font-semibold w-32">Phone Number:</span>
          <span className="text-gray-800">{user.PhoneNumber}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 font-semibold w-32">Email:</span>
          <span className="text-gray-800">{user.Email}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 font-semibold w-32">Role:</span>
          <span className="text-gray-800">{user.Role}</span>
        </div>
        <div className="mt-6">
          <button
            onClick={() => onShowDetails(user.EmployeeObjectId)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Show Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;