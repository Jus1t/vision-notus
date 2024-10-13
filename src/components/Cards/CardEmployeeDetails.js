import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

export default function CardEmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState(employee);
  const [originalValues, setOriginalValues] = useState(employee);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await api.get(`/employee-details/${id}`);
        console.log(response)
        setEmployee(response.data);
        setFormValues(response.data);
        setOriginalValues(response.data);
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

  const handleCancelClick = () => {
    setFormValues(originalValues); // Reset to original values
    setIsEditMode(false); // Exit edit mode
    console.log(formValues)
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
      setFormValues((formValues) => ({
        ...formValues,
        [id]: value, // Set the regular input value
      }));
  };

  // Handle submit
  const handleSubmitClick = () => {
    // Make an API call with formValues
    // submitApiCall(formValues);
    setOriginalValues(formValues); // Update original values after successful submission
    setIsEditMode(false); // Exit edit mode
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
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleEditClick} // This should enable edit mode
            >
              Edit
            </button>
          ) : (
            <div>
              <button
                className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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

        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Personal Information
        </h6>
        <div className="flex flex-wrap">
          <InfoField name="FirstName" label="First Name" value={formValues.FirstName} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="LastName" label="Last Name" value={formValues.LastName} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="DateOfBirth" label="Date of Birth" value={formValues.DateOfBirth} isEditMode={isEditMode} handleInputChange={handleChange} />
          <InfoField name="FathersName" label="Father's Name" value={formValues.FathersName} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="SpouseName" label="Spouse Name" value={formValues.SpouseName} isEditMode={isEditMode} handleInputChange={handleChange}/>
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Contact Information
        </h6>
        <div className="flex flex-wrap">
          <InfoField name="ContactDetails" label="Contact Details" value={formValues.ContactDetails} isEditMode={isEditMode} handleInputChange={handleChange} />
          <InfoField name="FathersContactDetails" label="Father's Contact" value={formValues.FathersContactDetails} isEditMode={isEditMode}handleInputChange={handleChange} />
          <InfoField name="SpouseContactDetails" label="Spouse Contact" value={formValues.SpouseContactDetails} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="PresentAddress" label="Present Address" value={formValues.PresentAddress} fullWidth isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="PermanentAddress" label="Permanent Address" value={formValues.PermanentAddress} fullWidth isEditMode={isEditMode} handleInputChange={handleChange}/>
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Identification Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField name="AadhaarDetails" label="Aadhaar Details" value={formValues.AadhaarDetails} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="PanDetails" label="PAN Details" value={formValues.PanDetails} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="DrivingLicenseNo" label="Driving License No" value={formValues.DrivingLicenseNo} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="DlValidityUpto" label="DL Validity" value={new Date(formValues.DlValidityUpto).toLocaleDateString()} isEditMode={isEditMode} handleInputChange={handleChange}/>
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Employment Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField name="PfNo" label="PF Number" value={formValues.PfNo} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="EsiCode" label="ESI Code" value={formValues.EsiCode} isEditMode={isEditMode} handleInputChange={handleChange}/>
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Bank Details
        </h6>
        <div className="flex flex-wrap">
          <InfoField name="BankAccountNo" label="Bank Account No" value={formValues.BankAccountNo} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="IfscCode" label="IFSC Code" value={formValues.IfscCode} isEditMode={isEditMode} handleInputChange={handleChange}/>
          <InfoField name="NameOfBankAndBranch" label="Bank and Branch" value={formValues.NameOfBankAndBranch} fullWidth isEditMode={isEditMode} handleInputChange={handleChange}/>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value, name, handleInputChange, isEditMode, fullWidth = false }) => {
  let type = "text"
  if(name==="DateOfBirth" || name==="DlValidityUpto") type = "date";
  return (
    <div className={`${fullWidth ? 'w-full' : 'w-full lg:w-6/12'} px-4`}>
      <div className="relative w-full mb-3">
        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
          {label}
        </label>

        {/* If isEditMode is true, show input field */}
        {isEditMode ? (
          <input
            type={type}
            name={name}
            id={name}
            value={value || ''}
            onChange={handleInputChange} // Call the parent's handleInputChange method
            className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full"
          />
        ) : ( 
          <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
            {value || 'N/A'}
          </p>
        )}
      </div>
    </div>
  );
};