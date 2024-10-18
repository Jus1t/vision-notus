import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "views/auth/api";

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

// Dummy item options
const dummyItems = [
  { value: "item1", label: "Item 1" },
  { value: "item2", label: "Item 2" },
  { value: "item3", label: "Item 3" },
];

export default function CardCreateProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    unit: "",
    selectedItem: null,
    Quantity: "",
  });
  const [itemList, setItemList] = useState(dummyItems);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
  const handleAddItem = () => {
    const { selectedItem, Quantity } = formData;
    if (!selectedItem || !Quantity) {
      alert("Please select an item and Quantity.");
      return;
    }

    const newRow = {
      ItemSerialNo: selectedItem.ItemSerialNo,
      ShortDesc: selectedItem.ShortDesc,
      LongDesc: selectedItem.LongDesc,
      Uom: selectedItem.Uom,
      Quantity: parseFloat(Quantity),
    };
    setTableData((prevData) => [...prevData, newRow]);
    setFormData({ ...formData, selectedItem: null, Quantity: "" });
  };

  // Handle row deletion
  const handleDeleteRow = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Handle row editing
  const handleEditRow = (index) => {
    const rowData = tableData[index];
    // Find the selected item from itemList by matching with the ShortDesc
    const selectedItem = itemList.find((item) => item.ShortDesc === rowData.ShortDesc);
    setFormData({
      ...formData,
      selectedItem: selectedItem,
      Quantity: rowData.Quantity,
    });
    setEditIndex(index);
  };

  // Save the edited row
  const handleSaveEdit = () => {
    const updatedRow = {
      ItemSerialNo: formData.selectedItem.ItemSerialNo,
      ShortDesc: formData.selectedItem.ShortDesc,
      LongDesc: formData.selectedItem.LongDesc,
      Uom: formData.selectedItem.Uom,
      Quantity: parseFloat(formData.Quantity),
    };
    const updatedTableData = [...tableData];
    updatedTableData[editIndex] = updatedRow;
    setTableData(updatedTableData);
    setEditIndex(null);
    setFormData({ ...formData, selectedItem: null, Quantity: "" }); // Reset form
  };

  // Cancel the editing process
  const handleCancelEdit = () => {
    setEditIndex(null);
    setFormData({ ...formData, selectedItem: null, Quantity: "" }); // Reset form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const productData = {
      productName: formData.productName,
      description: formData.description,
      unit: formData.unit,
      itemList: tableData,
    };

    console.log("Product details to submit:", productData);

    try {
      const response = await api.post("/product-details", productData);
      console.log("Response from server:", response);
    } catch (error) {
      console.error("Error submitting product details:", error);
    }
  };

  useEffect(() => {
    const fetchItemsAndProducts = async () => {
      try {
        const itemsResponse = await api.get("/item-details");
        const items = itemsResponse.data.map((i) => ({
          ...i,
          value: i._id,
          label: i.ShortDesc,
        }));
        setItemList(items);
      } catch (error) {
        console.error("Error fetching items/products, using dummy data", error);
      }
    };
    fetchItemsAndProducts();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Create Product</h6>
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
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Product Details</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Product Name</label>
              <input
                type="text"
                id="productName"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Description</label>
              <input
                type="text"
                id="description"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Unit</label>
              <input
                type="text"
                id="unit"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.unit}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Add Items</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Item</label>
              <Select
                options={itemList}
                styles={customStyles}
                placeholder="Select Item"
                value={formData.selectedItem}
                onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "selectedItem" })}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Quantity</label>
              <input
                type="number"
                id="Quantity"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.Quantity}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mt-3"
            onClick={handleAddItem}
          >
            Add Item
          </button>

          <div className="block w-full overflow-x-auto mt-6">
            <h6 className="text-blueGray-400 text-sm font-bold uppercase">Item List</h6>
            <table className="items-center w-full bg-transparent border-collapse table-auto">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">#</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Item</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Quantity</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{index + 1}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {editIndex === index ? (
                        <Select
                          options={itemList}
                          value={formData.selectedItem}
                          onChange={(selectedOption) => handleSelectChange(selectedOption, { id: "selectedItem" })}
                        />
                      ) : (
                        row.ShortDesc
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {editIndex === index ? (
                        <input
                          type="number"
                          id="Quantity"
                          value={formData.Quantity}
                          onChange={handleInputChange}
                          className="border px-2 py-1"
                        />
                      ) : (
                        row.Quantity
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
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
        </form>
      </div>
    </div>
  );
}
