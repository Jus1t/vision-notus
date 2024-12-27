// src/components/AttendanceCard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas  } from 'qrcode.react';
import api from 'views/auth/api'; // Assuming the API configuration exists

const AttendanceCard = ({ color = 'light' }) => {
  const { id } = useParams(); // Get Object ID from URL
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch employee data using the Object ID
        const response = await api.get(`/employee-details/${id}`);
        setEmployeeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!employeeData) {
    return <div className="text-center py-8">Employee not found.</div>;
  }

  // Define classes for styling
  const cardClass =
    'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
    (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white');
  const labelClass = 'block uppercase text-blueGray-600 text-xs font-bold mb-2';
  const valueClass = 'text-blueGray-700 text-sm';

  return (
    <div className={cardClass}>
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <h6 className="text-blueGray-700 text-xl font-bold">Attendance Card</h6>
      </div>
      <div className="px-4 lg:px-10 py-10 pt-0">
        <div className="mb-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Employee Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>First Name</label>
              <p className={valueClass}>{employeeData.FirstName}</p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>Last Name</label>
              <p className={valueClass}>{employeeData.LastName}</p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>Father's Name</label>
              <p className={valueClass}>{employeeData.FathersName}</p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>Contact Details</label>
              <p className={valueClass}>{employeeData.ContactDetails}</p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>Father's Contact Details</label>
              <p className={valueClass}>{employeeData.FathersContactDetails}</p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className={labelClass}>Spouse Contact Details</label>
              <p className={valueClass}>{employeeData.SpouseContactDetails}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="text-center">
            <h6 className="text-blueGray-400 text-sm font-bold uppercase">
              QR Code
            </h6>
            <QRCodeCanvas  value={id} size={150} />
            {/* <p className="text-blueGray-700 text-sm mt-4">
              Scan to View Employee ID: {id}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
