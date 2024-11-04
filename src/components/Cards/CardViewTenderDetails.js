import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import api from "views/auth/api";
import { useParams } from "react-router-dom";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.25rem",
    borderColor: state.isFocused ? "#3b82f6" : "transparent",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
      : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    "&:hover": { borderColor: state.isFocused ? "#3b82f6" : "transparent" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#e5e7eb"
        : null,
    color: state.isSelected ? "white" : "#1f2937",
  }),
};

export default function CardViewTenderDetails() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    CompanyReferenceNo: "",
    PublisinghAuthObjectId: null,
    TenderNo: "",
    TenderName: "",
    TenderDescription: "",
    TenderPublisingDate: "",
    TenderSubmissionDate: "",
    TenderFee: "",
    emdType: null,
    emdAmount: "",
    emdDate: "",
    bank: null,
    validityRequired: "",
    scanCopy: null,
    phoneNumber: "",
    LeadEmail: "",
    TenderSource: null,
    EmdDetailsObjectId: null,
  });
  const [originalData, setOriginalData] = useState(null); // Store original data for cancel functionality
  const [loading, setLoading] = useState(true);
  const [publishingAuthorities, setPublishingAuthorities] = useState([]);
  const [tenderSources, setTenderSources] = useState([]);
  const [banks, setBanks] = useState([]);
  const [emdTypes, setEmdTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [reminder, setReminder] = useState(null);
  const [newTenderSourceAdded, setNewTenderSourceAdded] = useState(false);
  const [newEmdTypeAdded, setNewEmdTypeAdded] = useState(false);
  const [newBankAdded, setNewBankAdded] = useState(false);

  // Fetch tender and EMD details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dropdown options first
        const [
          publishingAuthoritiesResponse,
          tenderSourcesResponse,
          banksResponse,
          emdTypesResponse,
        ] = await Promise.all([
          api.get("/publishing-auth"),
          api.get("/tender-source"),
          api.get("/banks"),
          api.get("/emd-types"),
        ]);

        const fetchedPublishingAuthorities = publishingAuthoritiesResponse.data.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }));
        const fetchedTenderSources = tenderSourcesResponse.data.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }));
        const fetchedBanks = banksResponse.data.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }));
        const fetchedEmdTypes = emdTypesResponse.data.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }));

        setPublishingAuthorities(fetchedPublishingAuthorities);
        setTenderSources(fetchedTenderSources);
        setBanks(fetchedBanks);
        setEmdTypes(fetchedEmdTypes);

        // Now fetch tender and EMD details
        const tenderResponse = await api.get(`/lead/${id}`);
        const tenderData = tenderResponse.data;

        const emdResponse = await api.get(`/emd-details/${tenderData.EmdDetailsObjectId}`);
        const emdData = emdResponse.data;

        // Find matching options
        const publishingAuthorityOption = fetchedPublishingAuthorities.find(
          (authority) => authority.value === tenderData.PublisinghAuthObjectId
        );
        const tenderSourceOption = fetchedTenderSources.find(
          (source) => source.value === tenderData.TenderSource
        );
        const emdTypeOption = emdData.EmdType
          ? { value: emdData.EmdType, label: emdData.EmdType }
          : null;
        const bankOption = emdData.Bank
          ? { value: emdData.Bank, label: emdData.Bank }
          : null;

        // Map data to formData
        const initialFormData = {
          CompanyReferenceNo: tenderData.CompanyReferenceNo || "",
          PublisinghAuthObjectId: publishingAuthorityOption || null,
          TenderNo: tenderData.TenderNo || "",
          TenderName: tenderData.TenderName || "",
          TenderDescription: tenderData.TenderDescription || "",
          TenderPublisingDate: tenderData.TenderPublisingDate
            ? tenderData.TenderPublisingDate.split("T")[0]
            : "",
          TenderSubmissionDate: tenderData.TenderSubmissionDate
            ? tenderData.TenderSubmissionDate.split("T")[0]
            : "",
          TenderFee: tenderData.TenderFee || "",
          emdType: emdTypeOption,
          emdAmount: emdData.EmdAmount || "",
          emdDate: emdData.Date ? emdData.Date.split("T")[0] : "",
          bank: bankOption,
          validityRequired: emdData.ValidityRequired || "",
          scanCopy: emdData.ScanCopyId || null,
          phoneNumber: tenderData.LeadPhoneNumber || "",
          LeadEmail: tenderData.LeadEmail || "",
          TenderSource: tenderSourceOption || null,
          EmdDetailsObjectId: tenderData.EmdDetailsObjectId,
        };

        setFormData(initialFormData);
        setOriginalData(initialFormData); // Save original data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const handleSelectChange = (selectedOption, field) => {
    const newOrNot = selectedOption?.__isNew__;
    if (newOrNot && field === "TenderSource") setNewTenderSourceAdded(newOrNot);
    if (newOrNot && field === "bank") setNewBankAdded(newOrNot);
    if (newOrNot && field === "emdType") setNewEmdTypeAdded(newOrNot);
    setFormData((prev) => ({ ...prev, [field]: selectedOption }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      scanCopy: e.target.files[0], // Store the file
    }));
  };

  // Calculate reminder date
  useEffect(() => {
    if (formData.TenderSubmissionDate) {
      const submissionDate = new Date(formData.TenderSubmissionDate);
      const reminderDate = new Date(submissionDate);
      reminderDate.setDate(submissionDate.getDate() - 5);
      setReminder(reminderDate.toISOString().split("T")[0]);
    }
  }, [formData.TenderSubmissionDate]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditMode(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    // Reset new option flags
    setNewTenderSourceAdded(false);
    setNewEmdTypeAdded(false);
    setNewBankAdded(false);
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Add new options if created
      if (newTenderSourceAdded)
        await api.post("/tender-source", { name: formData.TenderSource.label });
      if (newBankAdded)
        await api.post("/banks", { name: formData.bank.label });
      if (newEmdTypeAdded)
        await api.post("/emd-types", { name: formData.emdType.label });

      // Update EMD details
      const emdPayload = {
        EmdType: formData.emdType.label,
        EmdAmount: formData.emdAmount,
        Date: formData.emdDate,
        Bank: formData.bank.label,
        ValidityRequired: formData.validityRequired,
        ScanCopyId: formData.scanCopy, // Handle file upload appropriately
      };
      await api.put(`/emd-details/${formData.EmdDetailsObjectId}`, emdPayload);

      // Update tender details
      const tenderPayload = {
        CompanyReferenceNo: formData.CompanyReferenceNo,
        PublisinghAuthObjectId: formData.PublisinghAuthObjectId.value,
        TenderNo: formData.TenderNo,
        TenderName: formData.TenderName,
        TenderDescription: formData.TenderDescription,
        TenderPublisingDate: formData.TenderPublisingDate,
        TenderSubmissionDate: formData.TenderSubmissionDate,
        TenderFee: formData.TenderFee,
        EmdDetailsObjectId: formData.EmdDetailsObjectId,
        LeadEmail: formData.LeadEmail,
        LeadPhoneNumber: formData.phoneNumber,
        TenderSource: formData.TenderSource.value,
      };
      await api.put(`/lead/${id}`, tenderPayload);

      // Update original data to the new saved data
      setOriginalData(formData);
      setEditMode(false);
      console.log("Tender details updated successfully");
    } catch (error) {
      console.error("Error updating tender details:", error);
    }
  };

  // Render input fields
  const renderInput = (id, label, type = "text", placeholder = "") => (
    <div className="w-full lg:w-6/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor={id}
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={formData[id] || ""}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={!editMode}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
  );

  // Render select fields
  const renderSelect = (id, label, options, isCreatable = false) => {
    const SelectComponent = isCreatable ? CreatableSelect : Select;
    return (
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor={id}
          >
            {label}
          </label>
          <SelectComponent
            options={options}
            styles={customStyles}
            placeholder={`Select ${label}`}
            id={id}
            value={formData[id]}
            onChange={(selectedOption) => handleSelectChange(selectedOption, id)}
            isSearchable
            isDisabled={!editMode}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            Tender Details
          </h6>
          {editMode ? (
            <div>
              <button
                className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSave}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Tender Information
          </h6>
          <div className="flex flex-wrap">
            {renderInput("TenderName", "Name")}
            {renderInput("TenderDescription", "Description")}
            {renderInput("CompanyReferenceNo", "Company Reference No.")}
            {renderSelect(
              "PublisinghAuthObjectId",
              "Publishing Authority",
              publishingAuthorities
            )}
            {renderInput("TenderNo", "Tender No. (UNIQUE)")}
            {renderInput(
              "TenderPublisingDate",
              "Tender Publishing Date",
              "date"
            )}
            {renderInput(
              "TenderSubmissionDate",
              "Tender Submission Date",
              "date"
            )}
            {renderInput("TenderFee", "Tender Fee", "number")}
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Contact Information
          </h6>
          <div className="flex flex-wrap">
            {renderInput("phoneNumber", "Phone Number")}
            {renderInput("LeadEmail", "Email", "email")}
            {renderSelect("TenderSource", "Tender Source", tenderSources, true)}
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            EMD Details
          </h6>
          <div className="flex flex-wrap">
            {renderSelect("emdType", "EMD Type", emdTypes, true)}
            {renderInput("emdAmount", "EMD Amount", "number")}
            {renderInput("emdDate", "EMD Date", "date")}
            {renderInput(
              "validityRequired",
              "Validity Required (Days)",
              "number"
            )}
            {renderSelect("bank", "Bank", banks, true)}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="scanCopy"
                >
                  Scan Copy
                </label>
                <input
                  type="file"
                  id="scanCopy"
                  onChange={handleFileChange}
                  disabled={!editMode}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                {formData.scanCopy && !editMode && (
                  <a
                    href={`path_to_files/${formData.scanCopy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Scan Copy
                  </a>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
