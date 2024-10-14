import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

// Custom styles for react-select to match Tailwind classes
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.25rem",
    borderColor: state.isFocused ? "#3b82f6" : "transparent",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.5)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "transparent"
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e5e7eb" : null,
    color: state.isSelected ? "white" : "#1f2937",
  }),
};

// Sample options for dropdowns
const publishingAuthorities = [
  { value: "authority1", label: "Authority 1", phone: "1234567890", email: "contact1@auth1.com" },
  { value: "authority2", label: "Authority 2", phone: "0987654321", email: "contact2@auth2.com" },
  { value: "authority3", label: "Authority 3", phone: "1122334455", email: "contact3@auth3.com" },
];

const emdTypes = [
  { value: "type1", label: "Type 1" },
  { value: "type2", label: "Type 2" },
];

const tenderSources = [
  { value: "source1", label: "Source 1" },
  { value: "source2", label: "Source 2" },
];

export default function CardNewTender() {
  // State for form fields
  const [formData, setFormData] = useState({
    companyReferenceNo: "",
    publishingAuthority: null,
    tenderNo: "",
    tenderPublishingDate: "",
    tenderSubmissionDate: "",
    tenderFee: "",
    emdType: null,
    emdValidUpto: "",
    emdAmount: "",
    phoneNumber: "",
    email: "",
    tenderSource: null,
  });

  const [NewTenderSourceAdded, setNewTenderSourceAdded] = useState(false);
  const [reminder, setReminder] = useState(null);

  // Handle change for input fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle change for select fields
  const handleSelectChange = (selectedOption) => {
    if (selectedOption.__isNew__) {
      // A new option was added
      setNewTenderSourceAdded(true);
    } else {
      setNewTenderSourceAdded(false);
    }
    console.log(NewTenderSourceAdded)
    setFormData((prevData) => ({
      ...prevData,
      tenderSource: selectedOption,
    }));
  };

  // Auto-set reminder 5 days before submission
  useEffect(() => {
    if (formData.tenderSubmissionDate) {
      const submissionDate = new Date(formData.tenderSubmissionDate);
      const reminderDate = new Date(submissionDate);
      reminderDate.setDate(submissionDate.getDate() - 5);
      setReminder(reminderDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  }, [formData.tenderSubmissionDate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (NewTenderSourceAdded && formData.tenderSource) {
      try {
        const response = await fetch("/api/tender-sources", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: formData.tenderSource.label }),
        });

        if (response.ok) {
          console.log("New tender source added successfully!");
        } else {
          console.error("Error adding new tender source.");
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    }
    // Here you would typically send the data to your backend
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New Tender</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Tender Information */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Tender Information
          </h6>
          <div className="flex flex-wrap">
            {/* Company Reference No. */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="companyReferenceNo">
                  Company Reference No.
                </label>
                <input
                  type="text"
                  id="companyReferenceNo"
                  value={formData.companyReferenceNo}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Company Reference No."
                />
              </div>
            </div>

            {/* Publishing Authority */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="publishingAuthority">
                  Publishing Authority
                </label>
                <Select
                  options={publishingAuthorities}
                  styles={customStyles}
                  placeholder="Select Authority"
                  id="publishingAuthority"
                  value={formData.publishingAuthority}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, { id: "publishingAuthority" })
                  }
                  isSearchable
                />
              </div>
            </div>

            {/* Tender No. */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tenderNo">
                  Tender No.
                </label>
                <input
                  type="text"
                  id="tenderNo"
                  value={formData.tenderNo}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Tender No."
                />
              </div>
            </div>

            {/* Tender Publishing Date */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tenderPublishingDate">
                  Tender Publishing Date
                </label>
                <input
                  type="date"
                  id="tenderPublishingDate"
                  value={formData.tenderPublishingDate}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>

            {/* Tender Submission Date */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tenderSubmissionDate">
                  Tender Submission Date
                </label>
                <input
                  type="date"
                  id="tenderSubmissionDate"
                  value={formData.tenderSubmissionDate}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                {reminder && (
                  <p className="text-sm text-red-500 mt-2">
                    Reminder: {reminder} (5 days before submission)
                  </p>
                )}
              </div>
            </div>

            {/* Tender Fee */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tenderFee">
                  Tender Fee
                </label>
                <input
                  type="number"
                  id="tenderFee"
                  value={formData.tenderFee}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* Section 2: EMD Details */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            EMD Details
          </h6>
          <div className="flex flex-wrap">
            {/* EMD Type */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emdType">
                  EMD Type
                </label>
                <Select
                  options={emdTypes}
                  styles={customStyles}
                  placeholder="Select EMD Type"
                  id="emdType"
                  value={formData.emdType}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "emdType" })}
                />
              </div>
            </div>

            {/* EMD Amount */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emdAmount">
                  EMD Amount
                </label>
                <input
                  type="number"
                  id="emdAmount"
                  value={formData.emdAmount}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>

            {/* EMD Validity */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emdValidUpto">
                  EMD Valid Upto
                </label>
                <input
                  type="date"
                  id="emdValidUpto"
                  value={formData.emdValidUpto}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Information */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Contact Information
          </h6>
          <div className="flex flex-wrap">
            {/* Phone Number */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                />
              </div>
            </div>

            {/* Tender Source */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-source">
                  Tender Source
                </label>
                <CreatableSelect
                  options={tenderSources}
                  styles={customStyles}
                  placeholder="Select or Add Tender Source"
                  id="tenderSource"
                  value={formData.tenderSource}
                  onChange={handleSelectChange}
                  isSearchable
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
