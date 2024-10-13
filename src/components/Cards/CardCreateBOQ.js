import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from 'views/auth/api';

// Custom styles for react-select to match Tailwind classes
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.25rem",
    borderColor: "transparent",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "&:hover": {
      borderColor: "#3b82f6"
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
};

export default function CardCreateBOQ() {
  const [formData, setFormData] = useState({
    publishingAuthority: "",
    tenderNo: null,
    items: [{ itemDetails: "", product: "", qty: 0, sorRate: 0, sorAmount: 0 }],
  });

  const [tenders, setTenders] = useState([]);
  const [authorities, setAuthorities] = useState([]);

  useEffect(() => {
    const fetchTendersAndAuthorities = async () => {
      try {
        // Fetch tenders and authorities from the API
        const tenderResponse = await api.get('/leads/tenders');
        const authorityResponse = await api.get('/publishing-authorities');
        setTenders(tenderResponse.data);
        setAuthorities(authorityResponse.data);
      } catch (error) {
        console.error("Error fetching tenders or authorities:", error);
      }
    };

    fetchTendersAndAuthorities();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "qty" || field === "sorRate") {
      updatedItems[index].sorAmount = updatedItems[index].qty * updatedItems[index].sorRate;
    }

    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems
    }));
  };

  // Handle adding a new item
  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { itemDetails: "", product: "", qty: 0, sorRate: 0, sorAmount: 0 }]
    }));
  };

  // Handle removing an item
  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems
    }));
  };

  const handleSelectChange = (selectedOption, id) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: selectedOption
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // You would typically send the form data to your backend here
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">BOQ Details</h6>
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
          {/* Publishing Authority */}
          <div className="relative w-full mb-3">
            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
              Publishing Authority
            </label>
            <Select
              options={authorities.map((authority) => ({
                value: authority._id,
                label: authority.name
              }))}
              styles={customStyles}
              placeholder="Select Publishing Authority"
              isSearchable
              value={formData.publishingAuthority}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "publishingAuthority")}
            />
          </div>

          {/* Tender No */}
          <div className="relative w-full mb-3">
            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
              Tender No
            </label>
            <Select
              options={tenders.map((tender) => ({
                value: tender._id,
                label: tender.tenderNo
              }))}
              styles={customStyles}
              placeholder="Select Tender No"
              value={formData.tenderNo}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "tenderNo")}
            />
          </div>

          {/* List of Items */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Items</h6>
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-wrap mb-4">
              <div className="w-full lg:w-4/12 px-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Item Details
                </label>
                <input
                  type="text"
                  value={item.itemDetails}
                  onChange={(e) => handleInputChange(index, "itemDetails", e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Item Details"
                />
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Product
                </label>
                <input
                  type="text"
                  value={item.product}
                  onChange={(e) => handleInputChange(index, "product", e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Product"
                />
              </div>
              <div className="w-full lg:w-2/12 px-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  QTY
                </label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleInputChange(index, "qty", e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="QTY"
                />
              </div>
              <div className="w-full lg:w-2/12 px-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  SOR Rate
                </label>
                <input
                  type="number"
                  value={item.sorRate}
                  onChange={(e) => handleInputChange(index, "sorRate", e.target.value)}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="SOR Rate"
                />
              </div>
              <div className="w-full lg:w-2/12 px-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  SOR Amount
                </label>
                <input
                  type="number"
                  value={item.sorAmount}
                  readOnly
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
              <div className="w-full lg:w-1/12 px-4 flex items-end">
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
