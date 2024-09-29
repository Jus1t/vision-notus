import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

export default function CardEmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await api.get(`/employee-details/${id}`);
        console.log(response)
        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employee details');
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!employee) return <div>No employee data found</div>;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Employee Details</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Personal Information
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="First Name" value={employee.FirstName} />
          <InfoField label="Last Name" value={employee.LastName} />
          <InfoField label="Date of Birth" value={new Date(employee.DateOfBirth).toLocaleDateString()} />
          <InfoField label="Father's Name" value={employee.FathersName} />
          <InfoField label="Spouse Name" value={employee.SpouseName} />
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Contact Information
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="Contact Details" value={employee.ContactDetails} />
          <InfoField label="Father's Contact" value={employee.FathersContactDetails} />
          <InfoField label="Spouse Contact" value={employee.SpouseContactDetails} />
          <InfoField label="Present Address" value={employee.PresentAddress} fullWidth />
          <InfoField label="Permanent Address" value={employee.PermanentAddress} fullWidth />
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Identification Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="Aadhaar Details" value={employee.AadhaarDetails} />
          <InfoField label="PAN Details" value={employee.PanDetails} />
          <InfoField label="Driving License No" value={employee.DrivingLicenseNo} />
          <InfoField label="DL Validity" value={new Date(employee.DlValidityUpto).toLocaleDateString()} />
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Employment Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="PF Number" value={employee.PfNo} />
          <InfoField label="ESI Code" value={employee.EsiCode} />
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Bank Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="Bank Account No" value={employee.BankAccountNo} />
          <InfoField label="IFSC Code" value={employee.IfscCode} />
          <InfoField label="Bank and Branch" value={employee.NameOfBankAndBranch} fullWidth />
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, fullWidth = false }) {
  return (
    <div className={`${fullWidth ? 'w-full' : 'w-full lg:w-6/12'} px-4`}>
      <div className="relative w-full mb-3">
        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
          {label}
        </label>
        <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}
