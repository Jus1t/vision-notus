import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import api from "views/auth/api";

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
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e5e7eb" : null,
    color: state.isSelected ? "white" : "#1f2937",
  }),
};

export default function CardNewTender() {
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
  });
  const [loading, setLoading] = useState(true);
  const [publishingAuthorities, setPublishingAuthorities] = useState([]);
  const [tenderSources, setTenderSources] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [newTenderSourceAdded, setNewTenderSourceAdded] = useState(false);
  const [newEmdTypeAdded, SetNewEmdTypeAdded] = useState(false);
  const [newBankAdded, setNewBankAdded] = useState(false);
  const [banks, setBanks] = useState([]);
  const [emdTypes, setEmdTypes] = useState([]);
  const history = useHistory();
  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  // Update the publishing authority and fetch its details
  const handleSelectChange = async (selectedOption, field) => {
    const newOrNot = selectedOption.__isNew__;
    if (selectedOption.__isNew__ && field === 'TenderSource') setNewTenderSourceAdded(newOrNot);
    if (selectedOption.__isNew__ && field === 'bank') setNewBankAdded(newOrNot);
    if (selectedOption.__isNew__ && field === 'emdType') SetNewEmdTypeAdded(newOrNot);
    
    setFormData((prev) => ({ ...prev, [field]: selectedOption }));

    // Fetch the details of the selected publishing authority
    if (field === "PublisinghAuthObjectId" && selectedOption) {
      try {
        const response = await api.get(`/publishing-auth/${selectedOption.value}`);
        const { email, phone } = response.data;
        setFormData((prev) => ({
          ...prev,
          LeadEmail: email, // Auto-fill the email
          phoneNumber: phone, // Auto-fill the phone number
        }));
      } catch (error) {
        console.error("Error fetching publishing authority details", error);
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      scanCopy: e.target.files[0], // Store the file
    }));
  };

  useEffect(() => {
    const fetchData = async (url, setState, transform) => {
      try {
        const response = await api.get(url);
        setState(transform(response.data));
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData("/publishing-auth", setPublishingAuthorities, (data) =>
      data.map(({ _id, name }) => ({ value: _id, label: name }))
    );
    fetchData("/tender-source", setTenderSources, (data) =>
      data.map(({ _id, name }) => ({ value: _id, label: name }))
    );
    fetchData("/banks", setBanks, (data) =>
      data.map(({ _id, name }) => ({ value: _id, label: name }))
    );
    fetchData("/emd-types", setEmdTypes, (data) =>
      data.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  }, []);

  useEffect(() => {
    if (formData.TenderSubmissionDate) {
      const submissionDate = new Date(formData.TenderSubmissionDate);
      const reminderDate = new Date(submissionDate);
      reminderDate.setDate(submissionDate.getDate() - 5);
      setReminder(reminderDate.toISOString().split("T")[0]);
    }
  }, [formData.TenderSubmissionDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newTenderSourceAdded) await api.post("/tender-source", { name: formData.TenderSource.label });
      if (newBankAdded) await api.post("/banks", { name: formData.bank.label });
      if (newEmdTypeAdded) await api.post("/emd-types", { name: formData.emdType.label });
    } catch (err) {
      console.log("Adding a new field", err)
    }
    console.log(formData)
    let emdresponse = "";
    try {
      const emdpayload = {
        EmdType: formData.emdType.label,
        EmdAmount: formData.emdAmount,
        Date: formData.emdDate,
        Bank: formData.bank.label,
        ValidityRequired: formData.validityRequired,
        ScanCopyId: "placeholderScanCopyId"
      }
      console.log(emdpayload)
      emdresponse = await api.post("/emd-details", emdpayload)
      console.log("EMD created successfully", emdresponse)
    } catch (error) {
      console.error("Error creating emd details object", error)
      return;
    }
    const emdObjectId = emdresponse.data._id;
    try {
      const tenderpayload = {
        CompanyReferenceNo: formData.CompanyReferenceNo,
        PublisinghAuthObjectId: formData.PublisinghAuthObjectId.value,
        TenderNo: formData.TenderNo,
        TenderName: formData.TenderName,
        TenderDescription: formData.TenderDescription,
        TenderPublisingDate: formData.TenderPublisingDate,
        TenderSubmissionDate: formData.TenderSubmissionDate,
        TenderFee: formData.TenderFee,
        EmdDetailsObjectId: emdObjectId,
        LeadEmail: formData.LeadEmail,
        LeadPhoneNumber: formData.phoneNumber,
        TenderSource: formData.TenderSource.value
      }
      console.log(tenderpayload)
      const response = await api.post("/lead", tenderpayload)
      console.log("Tender created successfully", response)
      history.push(`/admin/tender/${response.data._id}`)
    } catch (error) {
      console.error("Error creating new tender", error)
    }
  };

  const renderInput = (id, label, type = "text", placeholder = "") => (
    <div className="w-full lg:w-6/12 px-4">
      <div className="relative w-full mb-3">
        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={formData[id]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
  );

  const renderSelect = (id, label, options, isCreatable = false) => {
    const SelectComponent = isCreatable ? CreatableSelect : Select;
    return (
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
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
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New Tender</h6>
          <button
            className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Tender Information</h6>
          <div className="flex flex-wrap">
            {renderInput("CompanyReferenceNo", "Company Reference No.")}
            {renderSelect("PublisinghAuthObjectId", "Publishing Authority", publishingAuthorities)}
            {renderInput("TenderNo", "Tender No. (UNIQUE)")}
            {renderInput("TenderName", "Tender Name (Nickname)")}
            {renderInput("TenderDescription", "Description")}
            {renderInput("TenderPublisingDate", "Tender Publishing Date", "date")}
            {renderInput("TenderSubmissionDate", "Tender Submission Date", "date")}
            {renderInput("TenderFee", "Tender Fee", "number")}
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Contact Information</h6>
          <div className="flex flex-wrap">
            {renderInput("phoneNumber", "Phone Number")}
            {renderInput("LeadEmail", "Email", "email")}
            {renderSelect("TenderSource", "Tender Source", tenderSources, true)}
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">EMD Details</h6>
          <div className="flex flex-wrap">
            {renderSelect("emdType", "EMD Type", emdTypes, true)}
            {renderInput("emdAmount", "EMD Amount", "number")}
            {renderInput("emdDate", "EMD Date", "date")}
            {renderInput("validityRequired", "Validity Required (Days)", "number")}
            {renderSelect("bank", "Bank", banks, true)}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="scanCopy">
                  Scan Copy
                </label>
                <input
                  type="file"
                  id="scanCopy"
                  onChange={handleFileChange}
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
