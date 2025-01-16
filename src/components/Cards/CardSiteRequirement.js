import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useHistory, useParams } from "react-router-dom";
import api from "views/auth/api";

export default function CardCreateSiteRequirement() {
  const { siteId } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({
    listOfItems: [],
    listOfProduct: [],
    dateOfRequest: "",
    requestedBy: "",
    dueDays: "",
    cleared: false,
    isDelivered: false,
  });

  const [itemList, setItemList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [itemForm, setItemForm] = useState({ ItemObjectId: "", ReqQty: "" });
  const [productForm, setProductForm] = useState({ Product: "", ReqQty: "" });

  useEffect(() => {
    // Fetch dropdown data for items and products
    const fetchDropdownData = async () => {
      try {
        const itemsResponse = await api.get("/item-details");
        const productsResponse = await api.get("/product-details");

        setItemList(
          itemsResponse.data.map((item) => ({
            value: item._id,
            label: item.ShortDesc,
          }))
        );

        setProductList(
          productsResponse.data.map((product) => ({
            value: product._id,
            label: product.productName,
          }))
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchRequestedBy = async () => {
      try {
        const response = await api.get("/verify-token");
        console.log(response.data);
        setFormData((prev) => ({ ...prev, requestedBy: response.data.oid }));
      } catch (error) {
        console.error("Error fetching requested by:", error);
      }
    };
    fetchDropdownData();
    fetchRequestedBy();
  }, []);

  const handleInputChange = ({ target: { id, value } }) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const handleAddItem = () => {
    if (!itemForm.ItemObjectId || !itemForm.ReqQty) {
      alert("Please select an item and enter the required quantity.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      listOfItems: [...prev.listOfItems, { ...itemForm }],
    }));
    setItemForm({ ItemObjectId: "", ReqQty: "" });
  };

  const handleAddProduct = () => {
    if (!productForm.Product || !productForm.ReqQty) {
      alert("Please select a product and enter the required quantity.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      listOfProduct: [...prev.listOfProduct, { ...productForm }],
    }));
    setProductForm({ Product: "", ReqQty: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      siteId,
    };
    try {
      console.log(payload);
      const response = await api.post("/site-requirements", payload);
      history.push(`/admin/view-site-requirement/${siteId}`);
    } catch (error) {
      console.error("Error submitting site requirements:", error);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Site Requirement</h6>
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
            Request Details
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Date of Request
              </label>
              <input
                type="date"
                id="dateOfRequest"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.dateOfRequest}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Due in Days
              </label>
              <input
                type="number"
                id="dueDays"
                className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full"
                value={formData.dueDays}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Items
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Select Item
              </label>
              <Select
                options={itemList}
                placeholder="Select Item"
                value={itemList.find((item) => item.value === itemForm.ItemObjectId)}
                onChange={(selectedOption) =>
                  setItemForm((prev) => ({
                    ...prev,
                    ItemObjectId: selectedOption.value,
                  }))
                }
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
                onChange={({ target: { value } }) =>
                  setItemForm((prev) => ({ ...prev, ReqQty: value }))
                }
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>
          </div>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Add Products
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Select Product
              </label>
              <Select
                options={productList}
                placeholder="Select Product"
                value={productList.find((product) => product.value === productForm.Product)}
                onChange={(selectedOption) =>
                  setProductForm((prev) => ({
                    ...prev,
                    Product: selectedOption.value,
                  }))
                }
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
                onChange={({ target: { value } }) =>
                  setProductForm((prev) => ({ ...prev, ReqQty: value }))
                }
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
        <div className="mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">Current Items</h6>
          <ul>
            {formData.listOfItems.map((item, index) => (
              <li key={index}>
                Item: {itemList.find((i) => i.value === item.ItemObjectId)?.label || "Unknown"} | Quantity: {item.ReqQty}
              </li>
            ))}
          </ul>
          <h6 className="text-blueGray-400 text-sm mt-3 font-bold uppercase">Current Products</h6>
          <ul>
            {formData.listOfProduct.map((product, index) => (
              <li key={index}>
                Product: {productList.find((p) => p.value === product.Product)?.label || "Unknown"} | Quantity: {product.ReqQty}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
