import React, { useState, useEffect } from "react";
import Select from "react-select";

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
  { value: "authority1", label: "Authority 1", contact: "contact1@auth1.com" },
  { value: "authority2", label: "Authority 2", contact: "contact2@auth2.com" },
  { value: "authority3", label: "Authority 3", contact: "contact3@auth3.com" },
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
    emdAmount: "",
    tenderContactDetails: "",
    tenderSource: null,
  });

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
  const handleSelectChange = (selectedOption, { id }) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: selectedOption,
    }));
    if (id === "publishingAuthority") {
      setFormData((prevData) => ({
        ...prevData,
        tenderContactDetails: selectedOption.contact || "",
      }));
    }
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
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
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Tender Information
          </h6>
          <div className="flex flex-wrap">
            {/* Company Reference No. */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="company-reference-no">
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
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="publishing-authority">
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
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-no">
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
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-publishing-date">
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

            {/* Tender Submission Date (with reminder) */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-submission-date">
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
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-fee">
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

            {/* EMD Type */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emd-type">
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
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emd-amount">
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

            {/* Tender Contact Details */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-contact-details">
                  Tender Contact Details
                </label>
                <input
                  type="text"
                  id="tenderContactDetails"
                  value={formData.tenderContactDetails}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Contact Details"
                />
              </div>
            </div>

            {/* Tender Source */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-source">
                  Tender Source
                </label>
                <Select
                  options={tenderSources}
                  styles={customStyles}
                  placeholder="Select Tender Source"
                  id="tenderSource"
                  value={formData.tenderSource}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "tenderSource" })}
                  isCreatable
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
