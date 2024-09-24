import React, {useState} from "react";

export default function NewEmployeeForm() {
  const [formData, setFormData] = useState({
    FirstName: "",
    // lastName: "",
    ContactDetails: "",
    // email: "",
    // password: "",
    // confirmPassword:"",
    // role: "",
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
    licenseScanFront: null,
    licenseScanBack: null,
    bankAccount: "",
    bankBranch: "",
    ifscCode: "",
    pfNumber: "",
    esiCode: ""
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [id]: files[0] }); // Handle file uploads
    } else {
      setFormData({ ...formData, [id]: value });
    }
    if (id === 'password' || id === 'confirmPassword') {
      setPasswordMatch(
        id === 'password'
          ? value === formData.confirmPassword
          : value === formData.password
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "FirstName", "lastName", "ContactDetails", "email", "password", "role",
      "FathersName", "FathersContactDetails", "DateOfBirth", "PresentAddress", "PermanentAddress",
      "AadhaarDetails", "pan", "drivingLicense", "licenseValidity", "bankAccount",
      "bankBranch", "ifscCode", "pfNumber", "esiCode"
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return; // Stop form submission if any fields are missing
    }
    
    
        if(!passwordMatch){
          alert("Passwords do not match!");
          return;
        }
    
    // Create FormData object to handle file uploads
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    // Log form data before submission
    for (let pair of submissionData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      console.log("here atleast 1");
      const response = await fetch("http://localhost:3000/api/employee-details", {
        method: "POST",
        body: submissionData
      });
      console.log("here atleast");
      if (response.ok) {
        const data = await response.json();
        alert("Employee data submitted successfully!");
      } else {
        alert("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data", error);
      alert("Error submitting data");
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New User Information</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Username Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="first-name">
                  First Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="FirstName"
                  required
                  value={formData.FirstName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="last-name">
                  Last Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="phone-number">
                  Phone Number<span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  id="ContactDetails"
                  required
                  value={formData.ContactDetails}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                  Email Address<span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="password">
                Password<span className="text-red-500"> *</span>
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password<span className="text-red-500"> *</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>
          {!passwordMatch && (
                <div className="w-full lg:w-6/12 px-4">
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                </div>
          )}
          
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Employee Details
          </h6>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="role">
                Role<span className="text-red-500"> *</span>
              </label>
              <select
                id="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option value="">Select Role</option>
                <option value="boardMember">Board Member</option>
                <option value="planningTeam">Planning Team</option>
                <option value="financeTeam">Finance Team</option>
                <option value="projectManager">Project Manager</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="fathers-name">
                  Father's Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="FathersName"
                  required
                  value={formData.FathersName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="fathers-phone">
                  Father's Phone Number<span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  id="FathersContactDetails"
                  required
                  value={formData.FathersContactDetails}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="spouse-name">
                  Spouse Name
                </label>
                <input
                  type="text"
                  id="spousName"
                  required
                  value={formData.SpouseName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="spouse-phone">
                  Spouse Phone Number
                </label>
                <input
                  type="tel"
                  id="SpouseContactDetails"
                  required
                  value={formData.SpouseContactDetails}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="DateOfBirth">
                  Date of Birth<span className="text-red-500"> *</span>
                </label>
                <input
                  type="date"
                  id="DateOfBirth"
                  required
                  value={formData.DateOfBirth}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="present-address">
                  Present Address<span className="text-red-500"> *</span>
                </label>
                <textarea
                  id="PresentAddress"
                  rows="3"
                  required
                  value={formData.PresentAddress}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                ></textarea>
              </div>
            </div>
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="permanent-address">
                  Permanent Address<span className="text-red-500"> *</span>
                </label>
                <textarea
                  id="PermanentAddress"
                  rows="3"
                  required
                  value={formData.PermanentAddress}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                ></textarea>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="AadhaarDetails">
                  AadhaarDetails Number<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="AadhaarDetails"
                  required
                  value={formData.AadhaarDetails}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="pan">
                  PAN Number<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="pan"
                  required
                  value={formData.pan}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="driving-license">
                  Driving License No.<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="drivingLicense"
                  required
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="license-validity">
                  Driving License Validity Upto<span className="text-red-500"> *</span>
                </label>
                <input
                  type="date"
                  id="licenseValidity"
                  required
                  value={formData.licenseValidity}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="license-scan-front">
                  Driving License Scan Front
                </label>
                <input
                  type="file"
                  id="license-scan-front"
                  accept="image/*"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="license-scan-back">
                  Driving License Scan Back
                </label>
                <input
                  type="file"
                  id="license-scan-back"
                  accept="image/*"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="bank-account">
                  Bank Account No<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  required
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="bank-branch">
                  Name of Bank and Branch<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="bankBranch"
                  required
                  value={formData.bankBranch}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="ifsc-code">
                  IFS Code<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  required
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="pf-number">
                  PF No.<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="pfNumber"
                  required
                  value={formData.pfNumber}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="esi-code">
                  ESI Code<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="esiCode"
                  required
                  value={formData.esiCode}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}