import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';
import { useHistory } from 'react-router-dom';

export default function CardEmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const [userprofile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formEmpDetails, setFormEmpDetails] = useState({});
  const [originalValues, setOriginalValues] = useState({});
  const history = useHistory();
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await api.get(`/user-profile/getbyempid/${id}`);
        setUserProfile(res.data);

        const response = await api.get(`/employee-details/${id}`);
        const employeeData = response.data;
        console.log(response.data);
        // Format date fields to YYYY-MM-DD for input type="date"
        const formattedEmpDetails = {
          ...employeeData,
          DateOfBirth: employeeData.DateOfBirth
            ? new Date(employeeData.DateOfBirth).toISOString().substr(0, 10)
            : '',
          DlValidityUpto: employeeData.DlValidityUpto
            ? new Date(employeeData.DlValidityUpto).toISOString().substr(0, 10)
            : '',
        };
        console.log(response.data)
        setEmployee(employeeData);
        setFormEmpDetails(formattedEmpDetails);
        setOriginalValues(formattedEmpDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employee details');
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleWorkHistoryClick = () => {
    history.push(`/admin/working-history/${id}`);
  };
  

  const handleCancelClick = () => {
    setFormEmpDetails(originalValues); // Reset to original values
    setIsEditMode(false); // Exit edit mode
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'Role') {
      setUserProfile((values) => ({
        ...values,
        [id]: value,
      }));
    }
    else {
      setFormEmpDetails((formValues) => ({
        ...formValues,
        [id]: value,
      }));
    }
  };

  // Handle submit
  const handleSubmitClick = async () => {
    try {
      await api.put(`/employee-details/${id}`, formEmpDetails);

      const user = {
        FirstName: formEmpDetails.FirstName,
        LastName: formEmpDetails.LastName,
        PhoneNumber: formEmpDetails.ContactDetails,
        Email: userprofile.Email,
        Role: userprofile.Role,
        EmployeeObjectId: id,
      };
      await api.put(`/user-profile/${userprofile._id}`, user);

      setOriginalValues(formEmpDetails); // Update original values after successful submission
      setIsEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating employee details:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!employee) return <div>No employee data found</div>;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Employee Details</h6>
          {!isEditMode ? (
            // Render Edit button if isEditMode is false
            <button
              className="bg-orange-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleEditClick} // This should enable edit mode
            >
              Edit
            </button>
          ) : (
            <div>
              <button
                className="bg-lightBlue-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={handleSubmitClick} // This should handle form submission
              >
                Submit
              </button>

              <button
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={handleCancelClick} // This should cancel the editing and reset the form
              >
                Cancel
              </button>
            </div>
          )}
            <button
              className="bg-orange-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleWorkHistoryClick} // This should enable edit mode
            >
              work history
            </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Profile
        </h6>
        <div className="flex flex-wrap">
          <InfoField
            name="FirstName"
            label="First Name"
            value={formEmpDetails.FirstName}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="LastName"
            label="Last Name"
            value={formEmpDetails.LastName}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="Role"
            label="Role"
            value={userprofile.Role}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
            isSelect
            options={[
              { value: '', label: 'Select Role' },
              { value: 'boardMember', label: 'Board Member' },
              { value: 'planningTeam', label: 'Planning Team' },
              { value: 'financeTeam', label: 'Finance Team' },
              { value: 'projectManager', label: 'Project Manager' },
              { value: 'supervisor', label: 'Supervisor' },
            ]}
          />
          <InfoField
            name="ContactDetails"
            label="Phone"
            value={formEmpDetails.ContactDetails}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="DateOfBirth"
            label="Date of Birth"
            value={formEmpDetails.DateOfBirth}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
            isDate
          />
          <InfoField
            name="WagePerDay"
            label="Wage Per Day"
            value={formEmpDetails.WagePerDay}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        {/* Continue updating other sections similarly */}

        {/* Contact Information */}
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Personal Information
        </h6>
        <div className="flex flex-wrap">

          <InfoField
            name="PresentAddress"
            label="Present Address"
            value={formEmpDetails.PresentAddress}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="PermanentAddress"
            label="Permanent Address"
            value={formEmpDetails.PermanentAddress}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="FathersName"
            label="Father's Name"
            value={formEmpDetails.FathersName}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="FathersContactDetails"
            label="Father's Contact"
            value={formEmpDetails.FathersContactDetails}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="SpouseName"
            label="Spouse Name"
            value={formEmpDetails.SpouseName}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="SpouseContactDetails"
            label="Spouse Contact"
            value={formEmpDetails.SpouseContactDetails}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          {/* ... other contact fields ... */}
        </div>

        {/* Identification Details */}
        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Document Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField
            name="AadhaarDetails"
            label="Aadhaar Details"
            value={formEmpDetails.AadhaarDetails}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="PanDetails"
            label="PAN Details"
            value={formEmpDetails.PanDetails}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="DrivingLicenseNo"
            label="Driving License No"
            value={formEmpDetails.DrivingLicenseNo}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="DlValidityUpto"
            label="DL Validity"
            value={formEmpDetails.DlValidityUpto}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
            isDate
          />
        </div>

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Bank and Other Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField
            name="NameOfBankAndBranch"
            label="Bank and Branch"
            value={formEmpDetails.NameOfBankAndBranch}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="BankAccountNo"
            label="Account No"
            value={formEmpDetails.BankAccountNo}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="IfscCode"
            label="IFSC"
            value={formEmpDetails.IfscCode}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
          <InfoField
            name="PfNo"
            label="PF No"
            value={formEmpDetails.PfNo}
            isEditMode={isEditMode}
            handleInputChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

const InfoField = ({
  label,
  value,
  name,
  handleInputChange,
  isEditMode,
  fullWidth = false,
  isDate = false,
  isSelect = false,
  options = [],
}) => {
  let type = 'text';
  if (isDate) type = 'date';

  const formattedValue = isDate && value ? new Date(value).toLocaleDateString() : value;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-full lg:w-6/12'} px-4`}>
      <div className="relative w-full mb-3">
        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
          {label}
        </label>

        {/* If isEditMode is true, show input field */}
        {isEditMode ? (
          isSelect ? (
            <select
              id={name}
              value={value || ''}
              onChange={handleInputChange}
              className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              value={value || ''}
              onChange={handleInputChange}
              className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full"
            />
          )
        ) : (
          <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
            {isSelect ? formatRoleName(value) : formattedValue || 'N/A'}
          </p>
        )}
      </div>
    </div>
  );
};

// Utility function to format role names
const formatRoleName = (role) => {
  if (!role) return 'N/A';
  return role
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
};
