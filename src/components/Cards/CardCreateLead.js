import React, { useState } from "react";
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
  { value: "authority1", label: "Authority 1" },
  { value: "authority2", label: "Authority 2" },
  { value: "authority3", label: "Authority 3" },
];

const emdTypes = [
  { value: "type1", label: "Type 1" },
  { value: "type2", label: "Type 2" },
  { value: "type3", label: "Type 3" },
];

const banks = [
  { value: "bank1", label: "Bank 1" },
  { value: "bank2", label: "Bank 2" },
  { value: "bank3", label: "Bank 3" },
];

export default function CardNewLead() {
  // State for form fields
  const [formData, setFormData] = useState({
    publishingAuthority: null,
    tenderPublishingDate: "",
    tenderSubmissionDate: "",
    tenderFee: "",
    tenderSource: "",
    followUpDate: "",
    emdType: null,
    emdAmount: "",
    emdDate: "",
    emdBank: null,
    leadEmail: "",
    leadPhone: "",
  });

  // Handle change for input fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle change for select fields
  const handleSelectChange = (selectedOption, { id }) => {
    setFormData(prevData => ({
      ...prevData,
      [id]: selectedOption
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New Lead</h6>
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
            General
          </h6>
          <div className="flex flex-wrap">
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
                  onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "publishingAuthority" })}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-publishing-date">
                  Tender Publishing Date
                </label>
                <input
                  type="date"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="tenderPublishingDate"
                  value={formData.tenderPublishingDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-submission-date">
                  Tender Submission Date
                </label>
                <input
                  type="date"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="tenderSubmissionDate"
                  value={formData.tenderSubmissionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-fee">
                  Tender Fee
                </label>
                <input
                  type="number"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="tenderFee"
                  value={formData.tenderFee}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="tender-source">
                  Tender Source
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="tenderSource"
                  value={formData.tenderSource}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="follow-up-date">
                  Follow Up Date
                </label>
                <input
                  type="date"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            EMD Details
          </h6>
          <div className="flex flex-wrap">
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
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emd-amount">
                  EMD Amount
                </label>
                <input
                  type="number"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="emdAmount"
                  value={formData.emdAmount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emd-date">
                  Date
                </label>
                <input
                  type="date"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="emdDate"
                  value={formData.emdDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="emd-bank">
                  Bank
                </label>
                <Select
                  options={banks}
                  styles={customStyles}
                  placeholder="Select Bank"
                  id="emdBank"
                  value={formData.emdBank}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "emdBank" })}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Lead Contacts
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="lead-email">
                  Email
                </label>
                <input
                  type="email"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="leadEmail"
                  value={formData.leadEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="lead-phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="leadPhone"
                  value={formData.leadPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}