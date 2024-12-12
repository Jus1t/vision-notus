import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import api from "views/auth/api";

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

const dummyAuthorities = [
  { value: "authority1", label: "Authority 1" },
  { value: "authority2", label: "Authority 2" },
  { value: "authority3", label: "Authority 3" },
];

const dummyItems = [
  { value: "item1", label: "Item 1" },
  { value: "item2", label: "Item 2" },
  { value: "product1", label: "Product 1" },
  { value: "product2", label: "Product 2" },
];

export default function CardCreateBOQ({ color = "light" }) {
  const [formData, setFormData] = useState({
    pubauthid: null,
    tenderNo: null,
    boqSerialNo: "",
    selectionName: null,
    quantity: "",
    sorRate: "",
  });
  const [authorities, setAuthorities] = useState();
  const [items, setItems] = useState([]);
  const [itemList, setItemList] = useState(dummyItems);
  const [options, setOptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalSorAmount, setTotalSorAmount] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [tenderOptions, setTenderOptions] = useState([]);
  const history = useHistory();

  const columnbaseclass = "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnselectedclass = color === "light" ? lightClass : darkClass;
  const tdClass = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  useEffect(() => {
    const mergedOptions = [...itemList, ...productList];
    setOptions(mergedOptions);
  }, [itemList, productList]);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const response = await api.get("/publishing-auth");
        const namesId = response.data.map(pubauth => ({
          value: pubauth._id,
          label: pubauth.name
        }));
        setAuthorities(namesId);
      } catch (error) {
        console.error("Error fetching authorities, using dummy data", error);
        setAuthorities(dummyAuthorities);
      }
    };
    fetchAuthorities();
  }, []);

  useEffect(() => {
    const fetchItemsAndProducts = async () => {
      try {
        const itemsResponse = await api.get("/item-details");
        const itemNamesId = itemsResponse.data.map(i => ({
          value: i._id,
          label: i.ShortDesc
        }));
        setItemList(itemNamesId);
        setItems(itemsResponse.data);

        const productResponse = await api.get("/product-details");
        const productNamesId = productResponse.data.map(i => ({
          value: i._id,
          label: i.productName
        }));
        setProductList(productNamesId);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching items/products, using dummy data", error);
      }
    };
    fetchItemsAndProducts();
  }, []);

  const fetchTenders = async (pubauthid) => {
    try {
      const response = await api.get(`/lead/getbypublishingauthid/${pubauthid}`);
      const tenderData = response.data.map((tender) => ({
        value: tender._id,
        label: `${tender.TenderNo} - ${tender.TenderName}`,
      }));
      setTenderOptions(tenderData);
    } catch (error) {
      console.error("Error fetching tenders", error);
      setTenderOptions([]);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (selectedOption, id) => {
    if (id === "pubauthid") {
      fetchTenders(selectedOption.value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]: selectedOption,
    }));
  };

  const processSelection = (selectionName, quantity, sorRate, processedItems, processedProducts) => {
    let selectedIsProduct = true;
    let selection = items.find(i => i.ShortDesc === selectionName.label);

    if (selection) {
      selectedIsProduct = false;
    } else {
      selection = products.find(i => i.productName === selectionName.label);
    }

    if (!selection) {
      console.log("Selection is neither a product nor an item.");
      return;
    }

    if (!selectedIsProduct) {
      processedItems.push({
        ItemObjectId: selection._id,
        ReqQty: quantity,
        SorRate: sorRate,
        SorAmount: sorRate * quantity,
      });
    } else {
      processedProducts.push({
        Product: selection._id,
        ReqQty: quantity,
        SorRate: sorRate,
        SorAmount: sorRate * quantity
      });
    }
  };

  const handleAdd = () => {
    const { selectionName, quantity, sorRate } = formData;
    if (!selectionName || !quantity || !sorRate) {
      alert("Please fill all fields before adding an item.");
      return;
    }

    const newRow = {
      selectionName: selectionName,
      quantity: parseFloat(quantity),
      sorRate: parseFloat(sorRate),
      sorAmount: parseFloat(quantity) * parseFloat(sorRate),
    };
    setTableData((prevData) => [...prevData, newRow]);
    setFormData({ ...formData, selectionName: null, quantity: "", sorRate: "" });
  };

  useEffect(() => {
    const total = tableData.reduce((acc, row) => acc + row.sorAmount, 0);
    setTotalSorAmount(total.toFixed(2));
  }, [tableData]);

  const handleDeleteRow = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleEditRow = (index) => {
    const rowData = tableData[index];
    setFormData({
      selectionName: rowData.selectionName,
      quantity: rowData.quantity,
      sorRate: rowData.sorRate,
    });
    setEditIndex(index);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedRow = {
      selectionName: formData.selectionName,
      quantity: parseFloat(formData.quantity),
      sorRate: parseFloat(formData.sorRate),
      sorAmount: parseFloat(formData.quantity) * parseFloat(formData.sorRate),
    };
    const updatedTableData = [...tableData];
    updatedTableData[editIndex] = updatedRow;
    setTableData(updatedTableData);
    setEditIndex(null);
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    setEditIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedItems = [];
    const processedProducts = [];

    tableData.forEach((row) => {
      const { selectionName, quantity, sorRate } = row;
      processSelection(selectionName, quantity, sorRate, processedItems, processedProducts);
    });

    const boqdetails = {
      PublishingAuthId: formData.pubauthid.value,
      TenderObjId: formData.tenderNo.value,
      BoqSerialNo: formData.boqSerialNo,
      ItemList: processedItems,
      ProductList: processedProducts,
    };

    console.log(boqdetails);
    try {
      const response = await api.post('/boq-details', boqdetails);
      console.log("Response from server:", response);
      const boqid = response.data._id;
      history.push(`/viewboq/${boqid}`);
    } catch (error) {
      console.error("Error submitting BOQ details:", error);
    }
  };

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
          <h6 className="text-blueGray-700 text-xl font-bold">Create BOQ</h6>
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
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">BOQ Details</h6>
          <div className="flex flex-wrap">
            {renderSelect("pubauthid", "Publishing Authority", authorities)}
            {renderSelect("tenderNo", "Tender", tenderOptions)}
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">BOQ Serial No</label>
              <input type="text" id="boqSerialNo" className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full" value={formData.boqSerialNo} onChange={handleInputChange} />
            </div>
          </div>

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Add Items and Products</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Product/Item Name</label>
              <Select
                options={options}
                styles={customStyles}
                placeholder="Select Item"
                value={formData.selectionName}
                onChange={(selectedOption) => handleSelectChange(selectedOption, "selectionName")}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Quantity</label>
              <input type="number" id="quantity" className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full" value={formData.quantity} onChange={handleInputChange} />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">SOR Rate</label>
              <input type="number" id="sorRate" className="border-0 px-3 py-3 bg-white rounded shadow focus:outline-none focus:ring w-full" value={formData.sorRate} onChange={handleInputChange} />
            </div>
          </div>

          <button type="button" className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mt-3" onClick={handleAdd}>
            Add
          </button>

          <div className="block w-full overflow-x-auto mt-6">
            <h6 className="text-blueGray-400 text-sm font-bold uppercase">BOQ</h6>
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
                        <Select options={itemList} value={formData.selectionName} onChange={(selectedOption) => handleSelectChange(selectedOption, "selectionName")} />
                      ) : (
                        row.selectionName.label
                      )}
                    </td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <input type="number" id="quantity" value={formData.quantity} onChange={handleInputChange} className="border px-2 py-1" />
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <input type="number" id="sorRate" value={formData.sorRate} onChange={handleInputChange} className="border px-2 py-1" />
                      ) : (
                        row.sorRate
                      )}
                    </td>
                    <td className={tdClass}>{row.sorAmount.toFixed(2)}</td>
                    <td className={tdClass}>
                      {editIndex === index ? (
                        <>
                          <button type="button" className="bg-yellow-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2" onClick={handleSaveEdit}>Save</button>
                          <button type="button" className="bg-red-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2" onClick={handleCancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="bg-yellow-500 text-white font-bold uppercase text-xs px-2 py-1 rounded mr-2" onClick={() => handleEditRow(index)}>Edit</button>
                          <button type="button" className="bg-red-500 text-white font-bold uppercase text-xs px-2 py-1 rounded" onClick={() => handleDeleteRow(index)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h6 className="text-blueGray-700 text-lg font-bold">Total SOR Amount: {totalSorAmount}</h6>
          </div>
        </form>
      </div>
    </div>
  );
}
