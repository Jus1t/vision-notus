import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

// Custom styles for react-select to match Tailwind classes
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.25rem",
    borderColor: state.isFocused ? "#3b82f6" : "transparent",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.5)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "transparent",
    },
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

// Dummy options for publishing authorities if API call fails
const dummyAuthorities = [
  { value: "authority1", label: "Authority 1" },
  { value: "authority2", label: "Authority 2" },
  { value: "authority3", label: "Authority 3" },
];

// Dummy product/item options
const dummyItems = [
  { value: "item1", label: "Item 1" },
  { value: "item2", label: "Item 2" },
  { value: "product1", label: "Product 1" },
  { value: "product2", label: "Product 2" },
];

export default function CardCreateBOQ({ color = "light" }) {
  const [formData, setFormData] = useState({
    publishingAuthority: null,
    tenderNo: "",
    boqSerialNo: "",
    productName: null,
    quantity: "",
    sorRate: "",
  });
  const [authorities, setAuthorities] = useState([]);
  const [items, setItems] = useState(dummyItems);
  const [tableData, setTableData] = useState([]);
  const [totalSorAmount, setTotalSorAmount] = useState(0);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the row being edited

  const columnbaseclass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  // Fetch publishing authorities from API (fallback to dummy if API call fails)
  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const response = await axios.get("/api/authorities"); // Example API endpoint
        setAuthorities(response.data);
      } catch (error) {
        console.error("Error fetching authorities, using dummy data", error);
        setAuthorities(dummyAuthorities);
      }
    };
    fetchAuthorities();
  }, []);

  // Fetch items/products from API (dummy data for now)
  useEffect(() => {
    const fetchItemsAndProducts = async () => {
      try {
        const itemsResponse = await axios.get("/api/items"); // Example API call
        const productsResponse = await axios.get("/api/products");
        setItems([...itemsResponse.data, ...productsResponse.data]);
      } catch (error) {
        console.error("Error fetching items/products, using dummy data", error);
      }
    };
    fetchItemsAndProducts();
  }, []);

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
  };

  // Handle adding new row to the table
  const handleAdd = () => {
    const { productName, quantity, sorRate } = formData;
    if (!productName || !quantity || !sorRate) {
      alert("Please fill all fields before adding an item.");
      return;
    }
    const newRow = {
      productName,
      quantity: parseFloat(quantity),
      sorRate: parseFloat(sorRate),
      sorAmount: parseFloat(quantity) * parseFloat(sorRate),
    };
    setTableData((prevData) => [...prevData, newRow]);
    setFormData({ ...formData, productName: null, quantity: "", sorRate: "" });
  };

  // Calculate total SOR Amount
  useEffect(() => {
    const total = tableData.reduce((acc, row) => acc + row.sorAmount, 0);
    setTotalSorAmount(total.toFixed(2));
  }, [tableData]);

  // Handle row deletion
  const handleDeleteRow = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Handle row editing
  const handleEditRow = (index) => {
    const rowData = tableData[index];
    setFormData({
      productName: rowData.productName,
      quantity: rowData.quantity,
      sorRate: rowData.sorRate,
    });
    setEditIndex(index); // Set the current row index to edit mode
  };

  // Save the edited row
  const handleSaveEdit = (e) => {
    e.preventDefault()
    const updatedRow = {
      productName: formData.productName,
      quantity: parseFloat(formData.quantity),
      sorRate: parseFloat(formData.sorRate),
      sorAmount: parseFloat(formData.quantity) * parseFloat(formData.sorRate),
    };
    const updatedTableData = [...tableData];
    updatedTableData[editIndex] = updatedRow;
    setTableData(updatedTableData);
    setEditIndex(null); // Exit edit mode
  };

  // Cancel the editing process
  const handleCancelEdit = (e) => {
    e.preventDefault()
    setEditIndex(null); // Exit edit mode without saving changes
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Create BOQ</h6>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          {/* Section 1: BOQ Details */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            BOQ Details
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Publishing Authority
              </label>
              <Select
                options={authorities}
                styles={customStyles}
                placeholder="Select Authority"
                id="publishingAuthority"
                value={formData.publishingAuthority}
                onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "publishingAuthority" })}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Tender No
              </label>
              <input
                type="text"
                id="tenderNo"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.tenderNo}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                BOQ Serial No
              </label>
              <input
                type="text"
                id="boqSerialNo"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.boqSerialNo}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section 2: Add Items and Products */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Items and Products
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Product/Item Name
              </label>
              <Select
                options={items}
                styles={customStyles}
                placeholder="Select Item"
                id="productName"
                value={formData.productName}
                onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "productName" })}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                SOR Rate
              </label>
              <input
                type="number"
                id="sorRate"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.sorRate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mt-3"
            onClick={handleAdd}
          >
            Add
          </button>
          <div className="block w-full overflow-x-auto">
            {/* Section 3: Table */}
            <h6 className="text-blueGray-400 text-sm mt-6 font-bold uppercase">
              BOQ
            </h6>
            <table className="items-center w-full bg-transparent border-collapse table-auto">
              <thead>
                <tr>
                  <th className={columnbaseclass + columnselectedclass}>#</th>
                  <th className={columnbaseclass + columnselectedclass}>Product/Item Name</th>
                  <th className={columnbaseclass + columnselectedclass}>Quantity</th>
                  <th className={columnbaseclass + columnselectedclass}>SOR Rate</th>
                  <th className={columnbaseclass + columnselectedclass}>SOR Amount</th>
                  <th className={columnbaseclass + columnselectedclass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className={tdClass}>{index + 1}</td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <Select
                          options={items}
                          value={formData.productName}
                          onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "productName" })}
                        />
                      ) : (
                        row.productName.label
                      )}
                    </td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <input
                          type="number"
                          id="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="border px-2 py-1"
                        />
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <input
                          type="number"
                          id="sorRate"
                          value={formData.sorRate}
                          onChange={handleInputChange}
                          className="border px-2 py-1"
                        />
                      ) : (
                        row.sorRate
                      )}
                    </td>
                    <td className={tdClass}>{row.sorAmount.toFixed(2)}</td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <>
                          <button
                            type="button"
                            className="bg-yellow-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="bg-red-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="bg-yellow-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2"
                            onClick={() => handleEditRow(index)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="bg-red-500 text-white font-bold uppercase text-xs px-2 py-1 rounded"
                            onClick={() => handleDeleteRow(index)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total SOR Amount */}
          <div className="mt-4">
            <h6 className="text-blueGray-700 text-lg font-bold">
              Total SOR Amount: {totalSorAmount}
            </h6>
          </div>
        </form>
      </div>
    </div>
  );
}
