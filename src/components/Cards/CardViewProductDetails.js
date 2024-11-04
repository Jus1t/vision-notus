import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "views/auth/api";
import { useParams } from "react-router-dom";

// Custom styles for react-select
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

const CardViewProductDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    unit: "",
    selectedItem: null,
    Quantity: "",
  });
  const [itemList, setItemList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product and item details
  useEffect(() => {
    const fetchProductAndItems = async () => {
      try {
        // Fetch product details
        const productResponse = await api.get(`/product-details/${id}`);
        const productData = productResponse.data;
        console.log(productData)
        // Fetch item details for each item in productData.itemList
        const itemListFromProduct = productData.itemList || [];

        // Fetch all items for selection
        const itemsResponse = await api.get("/item-details");
        const items = itemsResponse.data.map((item) => ({
          ...item,
          value: item._id,
          label: item.ShortDesc,
        }));

        // Map itemListFromProduct to include item details
        const tableData = itemListFromProduct.map((item) => ({
          ItemObjectId: item.ItemObjectId,
          Quantity: item.Quantity,
        }));

        setFormData({
          productName: productData.productName,
          description: productData.description,
          unit: productData.unit,
          selectedItem: null,
          Quantity: "",
        });
        setItemList(items);
        setTableData(tableData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product or item data:", error);
        setLoading(false);
      }
    };
    fetchProductAndItems();
  }, [id]);

  // Handle input changes
  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  // Handle select changes
  const handleSelectChange = (selectedOption, { id }) =>
    setFormData((prev) => ({ ...prev, [id]: selectedOption }));

  // Reset form fields
  const resetForm = () =>
    setFormData((prev) => ({ ...prev, selectedItem: null, Quantity: "" }));

  // Add new item to the table
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

  // Delete item from the table
  const handleDeleteRow = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      resetForm();
    }
  };

  // Edit item in the table
  const handleEditRow = (index) => {
    const rowData = tableData[index];
    const selectedItem = itemList.find(
      (item) => item._id === rowData.ItemObjectId
    );
    setFormData({ ...formData, selectedItem, Quantity: rowData.Quantity });
    setEditIndex(index);
  };

  // Save edited item
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

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditMode(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setEditIndex(null);
    resetForm();
    // Re-fetch data to reset any unsaved changes
    setLoading(true);
    api
      .get(`/product-details/${id}`)
      .then((productResponse) => {
        const productData = productResponse.data;
        const itemListFromProduct = productData.itemList || [];
        const tableData = itemListFromProduct.map((item) => ({
          ItemObjectId: item.ItemObjectId,
          Quantity: item.Quantity,
        }));
        setFormData({
          productName: productData.productName,
          description: productData.description,
          unit: productData.unit,
          selectedItem: null,
          Quantity: "",
        });
        setTableData(tableData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error re-fetching product data:", error);
        setLoading(false);
      });
  };

  // Save changes
  const handleSave = async () => {
    try {
      const productData = {
        productName: formData.productName,
        description: formData.description,
        unit: formData.unit,
        itemList: tableData,
      };
      await api.put(`/product-details/${id}`, productData);
      console.log("Product updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Helper function to get item details by ItemObjectId
  const getItemById = (ItemObjectId) =>
    itemList.find((item) => item._id === ItemObjectId);

  // Render input fields
  const renderInput = (id, label, type = "text", disabled = false) => (
    <div className="w-full lg:w-4/12 px-4">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="border-0 px-3 py-2 bg-white rounded shadow focus:outline-none focus:ring w-full"
        value={formData[id]}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );

  // Render table rows
  const renderTableRow = (row, index) => {
    const item = getItemById(row.ItemObjectId);
    return (
      <tr key={index}>
        <td className="border-t-0 px-6 align-middle text-xs p-4">{index + 1}</td>
        <td className="border-t-0 px-6 align-middle text-xs p-4">
          {item?.ShortDesc || "Unknown Item"}
        </td>
        <td className="border-t-0 px-6 align-middle text-xs p-4">
          {editIndex === index ? (
            <input
              type="number"
              id="Quantity"
              value={formData.Quantity}
              onChange={handleInputChange}
              className="border px-2 py-1 w-20"
            />
          ) : (
            row.Quantity
          )}
        </td>
        {editMode && (
          <td className="border-t-0 px-6 align-middle text-xs p-4">
            {editIndex === index ? (
              <>
                <button
                  type="button"
                  className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2"
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
        )}
      </tr>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Product Details</h6>
          {editMode ? (
            <div>
              <button
                className="bg-lightBlue-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={handleSave} // This should handle form submission
              >
                Submit
              </button>

              <button
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={handleCancel} // This should cancel the editing and reset the form
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10">
        <form>
          <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
            Product Details
          </h6>
          <div className="flex flex-wrap">
            {renderInput("productName", "Product Name", "text", !editMode)}
            {renderInput("description", "Description", "text", !editMode)}
            {renderInput("unit", "Unit", "text", !editMode)}
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Associated Items
          </h6>
          {editMode && (
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
          )}
          {editMode && (
            <div className="mt-3">
              {editIndex !== null ? (
                <>
                  {/* Edit mode actions are handled in renderTableRow */}
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
          )}
          <div className="block w-full overflow-x-auto mt-6">
            <h6 className="text-blueGray-400 text-sm font-bold uppercase">
              Item List
            </h6>
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase font-semibold text-left">
                    #
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase font-semibold text-left">
                    Item
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase font-semibold text-left">
                    Quantity
                  </th>
                  {editMode && (
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase font-semibold text-left">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>{tableData.map(renderTableRow)}</tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardViewProductDetails;
