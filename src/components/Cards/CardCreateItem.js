import React, { useState } from "react";
import api from "views/auth/api";

export default function CardNewItem() {
  // State for form fields
  const [formData, setFormData] = useState({
    ItemSerialNo: "",
    ShortDesc: "",
    LongDesc: "",
    Uom: "",
  });

  // Handle change for input fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    const response = await api.post('/item-details', formData)
    console.log(response)
    // Here you would typically send the data to your backend
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">New Item</h6>
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
            Item Details
          </h6>
          <div className="flex flex-wrap">
            {/* Item Serial No */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="item-serial-no">
                  Item Serial No
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="ItemSerialNo"
                  value={formData.ItemSerialNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Short Description */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="short-description">
                  Short Description
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="ShortDesc"
                  value={formData.ShortDesc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Long Description */}
            <div className="w-full px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="long-description">
                  Long Description
                </label>
                <textarea
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="LongDesc"
                  value={formData.LongDesc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Unit of Measurement */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="unit">
                  Unit of Measurement
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="Uom"
                  value={formData.Uom}
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
