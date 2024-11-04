import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import api from "views/auth/api";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.25rem",
    borderColor: state.isFocused ? "#3b82f6" : "transparent",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)",
    "&:hover": { borderColor: state.isFocused ? "#3b82f6" : "transparent" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
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

export default function CardCreateProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    unit: "",
    selectedItem: null,
    Quantity: "",
  });
  const [itemList, setItemList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const history = useHistory();
  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const handleSelectChange = (selectedOption, { id }) =>
    setFormData((prev) => ({ ...prev, [id]: selectedOption }));

  const resetForm = () =>
    setFormData((prev) => ({ ...prev, selectedItem: null, Quantity: "" }));

  const handleAddItem = () => {
    const { selectedItem, Quantity } = formData;
    if (!selectedItem || !Quantity) {
      alert("Please select an item and enter Quantity.");
      return;
    }
    setTableData((prev) => [
      ...prev,
      { ItemObjectId: selectedItem._id, Quantity: parseFloat(Quantity) },
    ]);
    resetForm();
  };

  const handleDeleteRow = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      resetForm();
    }
  };

  const handleEditRow = (index) => {
    const rowData = tableData[index];
    const selectedItem = itemList.find((item) => item._id === rowData.ItemObjectId);
    setFormData({ ...formData, selectedItem, Quantity: rowData.Quantity });
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    setTableData((prev) =>
      prev.map((row, i) =>
        i === editIndex
          ? {
              ItemObjectId: formData.selectedItem._id,
              Quantity: parseFloat(formData.Quantity),
            }
          : row
      )
    );
    setEditIndex(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      productName: formData.productName,
      description: formData.description,
      unit: formData.unit,
      itemList: tableData,
    };
    try {
      const response = await api.post("/product-details", productData);
      console.log("Product saved:", response);
      history.push(`/admin/viewproduct/${response.data._id}`)
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/item-details");
        setItemList(
          data.map((item) => ({
            ...item,
            value: item._id,
            label: item.ShortDesc,
          }))
        );
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    })();
  }, []);

  const renderInput = (id, label, type = "text") => (
    <div className="w-full lg:w-4/12 px-4">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
        value={formData[id]}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderTableRow = (row, index) => {
    const item = itemList.find((item) => item._id === row.ItemObjectId);
    return (
      <tr key={index}>
        <td className="border-t-0 px-6 align-middle text-xs p-4">{index + 1}</td>
        <td className="border-t-0 px-6 align-middle text-xs p-4">
          {editIndex === index ? (
            <Select
              options={itemList}
              value={formData.selectedItem}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { id: "selectedItem" })
              }
              styles={customStyles}
            />
          ) : (
            item?.ShortDesc || "Unknown Item"
          )}
        </td>
        <td className="border-t-0 px-6 align-middle text-xs p-4">
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
        <td className="border-t-0 px-6 align-middle text-xs p-4">
          {editIndex === index ? (
            <>
              <button
                type="button"
                className="bg-green-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-500 text-white font-bold uppercase text-xs px-2 py-1 rounded"
                onClick={() => {
                  setEditIndex(null);
                  resetForm();
                }}
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
    );
  };

  return (
    <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-blueGray-100">
      <div className="rounded-t bg-white px-6 py-6">
        <div className="flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Create Product</h6>
          <button
            className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10">
        <form>
          <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
            Product Details
          </h6>
          <div className="flex flex-wrap">
            {renderInput("productName", "Product Name")}
            {renderInput("description", "Description")}
            {renderInput("unit", "Unit")}
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Items
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Item
              </label>
              <Select
                options={itemList}
                styles={customStyles}
                placeholder="Select Item"
                value={formData.selectedItem}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, { id: "selectedItem" })
                }
              />
            </div>
            {renderInput("Quantity", "Quantity", "number")}
          </div>
          <div className="mt-3">
            {editIndex !== null ? (
              <>
                <button
                  type="button"
                  className="bg-green-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mr-2"
                  onClick={handleSaveEdit}
                >
                  Save Edit
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                  onClick={() => {
                    setEditIndex(null);
                    resetForm();
                  }}
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            )}
          </div>
          <div className="block w-full overflow-x-auto mt-6">
            <h6 className="text-blueGray-400 text-sm font-bold uppercase">
              Item List
            </h6>
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  {["#", "Item", "Quantity", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 align-middle border border-solid py-3 text-xs uppercase font-semibold text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{tableData.map(renderTableRow)}</tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
}
