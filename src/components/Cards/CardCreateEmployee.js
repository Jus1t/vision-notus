// src/views/admin/NewEmployeeForm.js

import React, { useState } from "react";
import api from "views/auth/api";
import { useHistory } from 'react-router-dom';
import { TextInput, TextArea, SelectInput, FileUpload } from "./Reusables";

export default function CardCreateEmployee() {
  const history = useHistory();
  
  const initialState = {
    FirstName: "",
    LastName: "",
    ContactDetails: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    FathersName: "",
    FathersContactDetails: "",
    SpouseName: "",
    SpouseContactDetails: "",
    DateOfBirth: "",
    PresentAddress: "",
    PermanentAddress: "",
    AadhaarDetails: "",
    pan: "",
    drivingLicense: "",
    licenseValidity: "",
    licenseScanFront: "",
    licenseScanBack: "",
    adhaarScan: "",
    bankAccount: "",
    bankBranch: "",
    ifscCode: "",
    pfNumber: "",
    esiCode: ""
  };
  
  const [formData, setFormData] = useState(initialState);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Track overall upload state
  const [isRoleSelected, setIsRoleSelected] = useState(false); // Track if role is selected

  // Handle input changes for text-based inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormData(prev => {
      const updatedFormData = { ...prev, [id]: value };
      
      // Handle password matching logic
      if (id === 'password' || id === 'confirmPassword') {
        const password = id === 'password' ? value : prev.password;
        const confirmPassword = id === 'confirmPassword' ? value : prev.confirmPassword;
        setPasswordMatch(password === confirmPassword);
      }

      // If role is being selected, update isRoleSelected
      if (id === 'role') {
        setIsRoleSelected(value !== "");
      }
      
      return updatedFormData;
    });
  };
  
  // Handler for successful file upload
  const handleFileUploadSuccess = (field) => (uploadedFileId) => {
    console.log(`Uploaded file for ${field}: ${uploadedFileId}`); // Debugging line
    setFormData(prev => ({ ...prev, [field]: uploadedFileId }));
  };
  
  const validateForm = () => {
    // Define required fields based on role
    let requiredFields = [
      "FirstName", "LastName", "ContactDetails", "role",
      "FathersName", "FathersContactDetails", "DateOfBirth", "PresentAddress", "PermanentAddress",
      "AadhaarDetails", "pan", "drivingLicense", "licenseValidity", "bankAccount",
      "bankBranch", "ifscCode", "pfNumber", "esiCode",
      "licenseScanFront", "licenseScanBack", "adhaarScan"
    ];

    // If role is not 'Employee', add user-specific fields
    if (formData.role !== "employee") {
      requiredFields.push("email", "password", "confirmPassword");
    }

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length) {
      // Convert field IDs to readable labels
      const fieldLabels = {
        FirstName: "First Name",
        LastName: "Last Name",
        ContactDetails: "Contact Details",
        role: "Role",
        FathersName: "Father's Name",
        FathersContactDetails: "Father's Contact Details",
        DateOfBirth: "Date of Birth",
        PresentAddress: "Present Address",
        PermanentAddress: "Permanent Address",
        AadhaarDetails: "Aadhaar Number",
        pan: "PAN Number",
        drivingLicense: "Driving License No.",
        licenseValidity: "Driving License Validity",
        bankAccount: "Bank Account No",
        bankBranch: "Name of Bank and Branch",
        ifscCode: "IFSC Code",
        pfNumber: "PF No.",
        esiCode: "ESIC Code",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password"
      };
      const missingLabels = missingFields.map(field => fieldLabels[field] || field);
      alert(`Please fill in the following required fields: ${missingLabels.join(", ")}`);
      return false;
    }
  
    if (formData.role !== "employee" && !passwordMatch) {
      alert("Passwords do not match!");
      return false;
    }
  
    if (formData.role !== "employee") {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return false;
      }
    }
  
    const phoneRegex = /^\d{10}$/;
    const phoneFields = ["ContactDetails", "FathersContactDetails", "SpouseContactDetails"];
    for (let field of phoneFields) {
      if (formData[field] && !phoneRegex.test(formData[field])) {
        let label;
        if (field === "SpouseContactDetails") label = "Spouse's Contact Details";
        else if (field === "FathersContactDetails") label = "Father's Contact Details";
        else label = "Phone Number";
        alert(`Please enter a valid 10-digit phone number for ${label}.`);
        return false;
      }
    }
  
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    
    if (!validateForm()) return;
    
    try {
      // First request to save employee details
      const employeeDetails = {
        FirstName: `${formData.FirstName} ${formData.LastName}`,
        LastName: formData.LastName,
        FathersName: formData.FathersName,
        FathersContactDetails: formData.FathersContactDetails,
        SpouseName: formData.SpouseName,
        SpouseContactDetails: formData.SpouseContactDetails,
        DateOfBirth: formData.DateOfBirth,
        PresentAddress: formData.PresentAddress,
        PermanentAddress: formData.PermanentAddress,
        ContactDetails: formData.ContactDetails,
        AadhaarDetails: formData.AadhaarDetails,
        PanDetails: formData.pan,
        DrivingLicenseNo: formData.drivingLicense,
        DlValidityUpto: formData.licenseValidity,
        DlScan: formData.licenseScanFront,
        DlScan2: formData.licenseScanBack,
        AdhaarCardScan: formData.adhaarScan,
        BankAccountNo: formData.bankAccount,
        NameOfBankAndBranch: formData.bankBranch,
        IfscCode: formData.ifscCode,
        PfNo: formData.pfNumber,
        EsiCode: formData.esiCode
      };
      
      console.log('Submitting Employee Details:', employeeDetails); // Debugging line
      
      const response = await api.post('/employee-details', employeeDetails, {
        headers: {
          'Content-Type': 'application/json', // Adjust based on backend expectations
        },
      });
      console.log('Employee details uploaded successfully:', response.data);
      
      const employeeId = response.data._id; // Assuming _id is returned in the response

      if (formData.role !== "employee") {
        // Only create user credentials if role is not 'Employee'
        const user = {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          PhoneNumber: formData.ContactDetails,
          Email: formData.email,
          Role: formData.role,
          EmployeeObjectId: employeeId
        };
    
        const credentials = {
          Email: formData.email,
          Password: formData.password
        };
    
        // Second request to save user details
        await api.post('/user-profile', user);
        await api.post('/credentials', credentials);
    
        console.log('User created successfully');
      }
      else{
        const user = {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          PhoneNumber: formData.ContactDetails,
          Email: "",
          Role: formData.role,
          EmployeeObjectId: employeeId
        };
        await api.post('/user-profile', user);
      }
      
      // Redirect to the employee detail page
      history.push(`/admin/employee/${employeeId}`);
  
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };
  
  const inputFields = [
    // Moved Role field to its own section initially
    { component: SelectInput, label: "Role", id: "role", required: true, options: [
        { value: "employee", label: "Employee" }, // Added "Employee" option
        { value: "boardMember", label: "Board Member" },
        { value: "planningTeam", label: "Planning Team" },
        { value: "financeTeam", label: "Finance Team" },
        { value: "projectManager", label: "Project Manager" },
        { value: "supervisor", label: "Supervisor" },
        { value: "siteEngineer", label: "Site Engineer" },
        { value: "Site Manager", label: "Site Manager" },
      ]
    },
  ];
  
  const userFields = [
    { component: TextInput, label: "Email Address", id: "email", required: true, type: "email" },
    { component: TextInput, label: "Password", id: "password", required: true, type: "password" },
    { component: TextInput, label: "Confirm Password", id: "confirmPassword", required: true, type: "password" },
  ];
  
  const employeeDetailsFields = [
    { component: TextInput, label: "First Name", id: "FirstName", required: true },
    { component: TextInput, label: "Last Name", id: "LastName", required: true },
    { component: TextInput, label: "Date of Birth", id: "DateOfBirth", required: true, type: "date" },
    { component: TextInput, label: "Mobile Number", id: "ContactDetails", required: true, type: "tel" },
    { component: TextInput, label: "Father's Name", id: "FathersName", required: true },
    { component: TextInput, label: "Father's Mobile Number", id: "FathersContactDetails", required: true, type: "tel" },
    { component: TextInput, label: "Emergency Contact Name", id: "SpouseName" },
    { component: TextInput, label: "Emergency Mobile Number", id: "SpouseContactDetails", type: "tel" },
    { component: TextArea, label: "Present Address", id: "PresentAddress", required: true },
    { component: TextArea, label: "Permanent Address", id: "PermanentAddress", required: true },
    { component: TextInput, label: "Aadhaar Number", id: "AadhaarDetails", required: true },
    { 
      component: FileUpload, 
      label: "Adhaar Card Scan", 
      id: "adhaarScan", 
      onUploadSuccess: handleFileUploadSuccess("adhaarScan") 
    },
    { component: TextInput, label: "PAN Number", id: "pan", required: true },
    { component: TextInput, label: "Driving License No.", id: "drivingLicense", required: true },
    { component: TextInput, label: "Driving License Validity Upto", id: "licenseValidity", required: true, type: "date" },
    { 
      component: FileUpload, 
      label: "Driving License Scan Front", 
      id: "licenseScanFront", 
      onUploadSuccess: handleFileUploadSuccess("licenseScanFront") 
    },
    { 
      component: FileUpload, 
      label: "Driving License Scan Back", 
      id: "licenseScanBack", 
      onUploadSuccess: handleFileUploadSuccess("licenseScanBack") 
    },
    { component: TextInput, label: "Bank Account No", id: "bankAccount", required: true },
    { component: TextInput, label: "Name of Bank and Branch", id: "bankBranch", required: true },
    { component: TextInput, label: "IFSC Code", id: "ifscCode", required: true },
    { component: TextInput, label: "PF No.", id: "pfNumber", required: true },
    { component: TextInput, label: "ESIC Code", id: "esiCode", required: true },
  ];
  
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New User Information</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleSubmit}
            disabled={isUploading} // Prevent submission during upload
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Role Selection
          </h6>
          <div className="flex flex-wrap">
            {inputFields.map(field => {
              const Component = field.component;
              return (
                <Component
                  key={field.id}
                  label={field.label}
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required={field.required}
                  type={field.type}
                  options={field.options}
                />
              );
            })}
          </div>

          {isRoleSelected && (
            <>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              {formData.role !== "employee" && (
                <>
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    User Credentials
                  </h6>
                  <div className="flex flex-wrap">
                    {userFields.map(field => {
                      const Component = field.component;
                      return (
                        <Component
                          key={field.id}
                          label={field.label}
                          id={field.id}
                          value={formData[field.id]}
                          onChange={handleChange}
                          required={field.required}
                          type={field.type}
                        />
                      );
                    })}
                    {!passwordMatch && (
                      <div className="w-full lg:w-6/12 px-4 mb-3">
                        <p className="text-red-500 text-sm">Passwords do not match</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Employee Details
              </h6>
              <div className="flex flex-wrap">
                {employeeDetailsFields.map(field => {
                  const Component = field.component;
                  if (Component === FileUpload) {
                    // For FileUpload, pass the onUploadSuccess prop
                    return (
                      <Component
                        key={field.id}
                        label={field.label}
                        id={field.id}
                        onUploadSuccess={field.onUploadSuccess}
                      />
                    );
                  }
                  return (
                    <Component
                      key={field.id}
                      label={field.label}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required={field.required}
                      type={field.type}
                      options={field.options}
                    />
                  );
                })}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
