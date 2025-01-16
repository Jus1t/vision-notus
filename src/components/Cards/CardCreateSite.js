import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import api from "views/auth/api";

// Define custom styles for the Select component
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

export default function CardCreateSite() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    tenderId: "",
    boqId: "",
    stages: [],
  });
  const [stageForm, setStageForm] = useState({
    stageName: "",
    subBoq: {
      ItemList: [],
      ProductList: [],
    },
    completed: false,
    startDate: "",
    duration: "",
    expectedCost: "",
  });
  const [itemForm, setItemForm] = useState({ ItemObjectId: "", ReqQty: "" });
  const [productForm, setProductForm] = useState({ Product: "", ReqQty: "" });
  const [itemOptions, setItemOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);

  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const handleStageChange = ({ target: { id, value } }) =>
    setStageForm((prev) => ({ ...prev, [id]: value }));

  const handleSubBoqChange = ({ target: { id, value } }) =>
    setStageForm((prev) => ({
      ...prev,
      subBoq: { ...prev.subBoq, [id]: value },
    }));

  const handleItemChange = ({ target: { id, value } }) =>
    setItemForm((prev) => ({ ...prev, [id]: value }));

  const handleProductChange = ({ target: { id, value } }) =>
    setProductForm((prev) => ({ ...prev, [id]: value }));

  const addItem = () => {
    setStageForm((prev) => ({
      ...prev,
      subBoq: {
        ...prev.subBoq,
        ItemList: [...prev.subBoq.ItemList, { ...itemForm }],
      },
    }));
    setAddedItems((prev) => [...prev, { ...itemForm }]);
    setItemForm({ ItemObjectId: "", ReqQty: "" });
  };

  const addProduct = () => {
    setStageForm((prev) => ({
      ...prev,
      subBoq: {
        ...prev.subBoq,
        ProductList: [...prev.subBoq.ProductList, { ...productForm }],
      },
    }));
    setAddedProducts((prev) => [...prev, { ...productForm }]);
    setProductForm({ Product: "", ReqQty: "" });
  };

  const addStage = () => {
    setFormData((prev) => ({
      ...prev,
      stages: [...prev.stages, { ...stageForm }],
    }));
    resetStageForm();
    setAddedItems([]);
    setAddedProducts([]);
  };

  const resetStageForm = () => {
    setStageForm({
      stageName: "",
      subBoq: {
        ItemList: [],
        ProductList: [],
      },
      completed: false,
      startDate: "",
      duration: "",
      expectedCost: "",
    });
    setItemForm({ ItemObjectId: "", ReqQty: "" });
    setProductForm({ Product: "", ReqQty: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await api.post("/sites", formData);
      history.push(`/admin/viewsite/${response.data._id}`);
    } catch (error) {
      console.error("Error submitting site details:", error);
    }
  };

  // Fetch items and products
  useEffect(() => {
    const fetchItemsAndProducts = async () => {
      try {
        const itemsResponse = await api.get("/item-details");
        const itemNamesId = itemsResponse.data.map(i => ({
          value: i._id,
          label: i.ShortDesc
        }));
        setItemOptions(itemNamesId);

        const productResponse = await api.get("/product-details");
        const productNamesId = productResponse.data.map(i => ({
          value: i._id,
          label: i.productName
        }));
        setProductOptions(productNamesId);
      } catch (error) {
        console.error("Error fetching items/products", error);
      }
    };
    fetchItemsAndProducts();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Create Site</h6>
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
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Site Details
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Tender ID
              </label>
              <input
                type="text"
                id="tenderId"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.tenderId}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                BOQ ID
              </label>
              <input
                type="text"
                id="boqId"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.boqId}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Stages
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Stage Name
              </label>
              <input
                type="text"
                id="stageName"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={stageForm.stageName}
                onChange={handleStageChange}
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={stageForm.startDate}
                onChange={handleStageChange}
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                id="duration"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={stageForm.duration}
                onChange={handleStageChange}
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Expected Cost
              </label>
              <input
                type="number"
                id="expectedCost"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={stageForm.expectedCost}
                onChange={handleStageChange}
              />
            </div>
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Sub-BOQ Details
          </h6>
          <div className="flex flex-wrap">
            {/* Removed Boq Serial No field */}
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Items to Sub-BOQ
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Item
              </label>
              <Select
                options={itemOptions}
                styles={customStyles}
                placeholder="Select Item"
                value={itemOptions.find(option => option.value === itemForm.ItemObjectId) || null}
                onChange={(selectedOption) => setItemForm(prev => ({ ...prev, ItemObjectId: selectedOption.value }))}
                isSearchable
              />
            </div>
            
            <div className="w-full lg:w-3/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Required Quantity
              </label>
              <input
                type="number"
                id="ReqQty"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={itemForm.ReqQty}
                onChange={handleItemChange}
              />
            </div>
          </div>
          <div className="block w-full overflow-x-auto mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">Added Items</h6>
          <table className="items-center w-full bg-transparent border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Item Name</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Required Quantity</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item, index) => (
                <tr key={index}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{itemOptions.find(option => option.value === item.ItemObjectId)?.label}</td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.ReqQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Products to Sub-BOQ
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Product
              </label>
              <Select
                options={productOptions}
                styles={customStyles}
                placeholder="Select Product"
                value={productOptions.find(option => option.value === productForm.Product) || null}
                onChange={(selectedOption) => setProductForm(prev => ({ ...prev, Product: selectedOption.value }))}
                isSearchable
              />
            </div>
            <div className="w-full lg:w-3/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Required Quantity
              </label>
              <input
                type="number"
                id="ReqQty"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={productForm.ReqQty}
                onChange={handleProductChange}
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
              onClick={addProduct}
            >
              Add Product
            </button>
          </div>
          <div className="block w-full overflow-x-auto mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">Added Products</h6>
          <table className="items-center w-full bg-transparent border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Product Name</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Required Quantity</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{productOptions.find(option => option.value === product.Product)?.label}</td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{product.ReqQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
              onClick={addStage}
            >
              Add Stage
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">Stages Added</h6>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Stage Name</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Start Date</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Duration (days)</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Expected Cost</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Completed</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Items</th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Products</th>
                </tr>
              </thead>
              <tbody>
                {formData.stages.map((stage, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stage.stageName}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stage.startDate}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stage.duration}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stage.expectedCost}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stage.completed ? "Yes" : "No"}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <ul>
                        {stage.subBoq.ItemList.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {itemOptions.find(option => option.value === item.ItemObjectId)?.label} - Qty: {item.ReqQty}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <ul>
                        {stage.subBoq.ProductList.map((product, productIndex) => (
                          <li key={productIndex}>
                            {productOptions.find(option => option.value === product.Product)?.label} - Qty: {product.ReqQty}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>        
      </div>
    </div>
  );
}
