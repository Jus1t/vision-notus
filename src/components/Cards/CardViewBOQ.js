// src/components/CardViewBOQ.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from 'views/auth/api';
import ExportButton from '../Buttons/ExportButton'; // Import the ExportButton component

const CardViewBOQ = ({ color = 'light' }) => {
  const { id } = useParams(); // Get BOQ id from URL parameters
  const [boqData, setBoqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishingAuthority, setPublishingAuthority] = useState(null);
  const [tenderName, setTenderName] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchBOQ = async () => {
      try {
        // Fetch the BOQ details using the BOQ ID from the URL
        const response = await api.get(`/boq-details/${id}`);
        const boqDetails = response.data;
        setBoqData(boqDetails);
        console.log(boqDetails);

        // Fetch the publishing authority name using the PublishingAuthId from the BOQ details
        const pubAuthResponse = await api.get(`/publishing-auth/${boqDetails.PublishingAuthId}`);
        setPublishingAuthority(pubAuthResponse.data.name);

        // Fetch the TenderName using the TenderObjId from the BOQ details
        const tenderResponse = await api.get(`/lead/${boqDetails.TenderObjId}`);
        setTenderName(tenderResponse.data.TenderName);

        // Fetch item details for each item in the ItemList
        const itemDetailsPromises = boqDetails.ItemList.map(item =>
          api.get(`/item-details/${item.ItemObjectId}`)
        );
        const itemDetailsResponses = await Promise.all(itemDetailsPromises);
        console.log(itemDetailsResponses);
        const itemDetailsData = itemDetailsResponses.map(res => res.data);
        setItemDetails(itemDetailsData);
        console.log(boqDetails);

        // Fetch product details for each product in the ProductList
        const productDetailsPromises = boqDetails.ProductList.map(product =>
          api.get(`/product-details/${product.Product}`)
        );
        const productDetailsResponses = await Promise.all(productDetailsPromises);
        const productDetailsData = productDetailsResponses.map(res => res.data);
        setProductDetails(productDetailsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching BOQ data or item/product details:', error);
        setLoading(false);
      }
    };

    fetchBOQ();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!boqData) {
    return <div className="text-center py-8">BOQ not found.</div>;
  }

  // Define classes for styling
  const columnbaseclass =
    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ';
  const lightClass = 'bg-blueGray-50 text-blueGray-500 border-blueGray-100';
  const darkClass = 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700';
  const columnselectedclass = color === 'light' ? lightClass : darkClass;
  const tdClass =
    'border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4';

  // Calculate total SOR Amount
  let totalSorAmount = 0;

  if (boqData.ItemList && boqData.ItemList.length > 0) {
    totalSorAmount += boqData.ItemList.reduce((acc, item) => acc + (item.SorAmount || 0), 0);
  }

  if (boqData.ProductList && boqData.ProductList.length > 0) {
    totalSorAmount += boqData.ProductList.reduce((acc, item) => acc + (item.SorAmount || 0), 0);
  }

  totalSorAmount = totalSorAmount.toFixed(2);

  // Define headers for Excel export
  const excelHeaders = ['#', 'Item/Product Name', 'Quantity', 'SOR Rate', 'SOR Amount'];

  // Prepare data for export (combine items and products)
  const exportData = [
    // Items
    ...itemDetails.map((item, index) => ({
      '#': index + 1,
      'Item/Product Name': item.ShortDesc,
      Quantity: boqData.ItemList[index].ReqQty,
      'SOR Rate': boqData.ItemList[index].SorRate,
      'SOR Amount': boqData.ItemList[index].SorAmount.toFixed(2),
    })),
    // Products
    ...productDetails.map((product, index) => ({
      '#': itemDetails.length + index + 1,
      'Item/Product Name': product.productName,
      Quantity: boqData.ProductList[index].ReqQty,
      'SOR Rate': boqData.ProductList[index].SorRate,
      'SOR Amount': boqData.ProductList[index].SorAmount.toFixed(2),
    })),
    // Summary Row
    {
      '#': '',
      'Item/Product Name': 'Total SOR Amount',
      Quantity: '',
      'SOR Rate': '',
      'SOR Amount': totalSorAmount,
    },
  ];

  return (
    <div
      className={
        'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
        (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
      }
    >
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">BOQ Details</h6>
          {/* Export Button */}
          <ExportButton
            data={exportData}
            fileName={`BOQ_${boqData.BoqSerialNo}`}
            headers={excelHeaders}
            buttonLabel="Export to Excel"
          />
        </div>
      </div>
      <div className="px-4 lg:px-10 py-10 pt-0">
        <div className="mb-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            BOQ Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                BOQ Serial No
              </label>
              <p className="text-blueGray-700 text-sm">{boqData.BoqSerialNo}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Publishing Authority
              </label>
              <p className="text-blueGray-700 text-sm">{publishingAuthority}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Tender Name
              </label>
              <p className="text-blueGray-700 text-sm">{tenderName}</p>
            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">BOQ Items</h6>
          <table className="items-center w-full bg-transparent border-collapse table-auto">
            <thead>
              <tr>
                <th className={columnbaseclass + columnselectedclass}>#</th>
                <th className={columnbaseclass + columnselectedclass}>Item/Product Name</th>
                <th className={columnbaseclass + columnselectedclass}>Quantity</th>
                <th className={columnbaseclass + columnselectedclass}>SOR Rate</th>
                <th className={columnbaseclass + columnselectedclass}>SOR Amount</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails.map((item, index) => (
                <tr key={`item-${index}`}>
                  <td className={tdClass}>{index + 1}</td>
                  <td className={tdClass}>{item.ShortDesc}</td>
                  <td className={tdClass}>{boqData.ItemList[index].ReqQty}</td>
                  <td className={tdClass}>{boqData.ItemList[index].SorRate}</td>
                  <td className={tdClass}>{boqData.ItemList[index].SorAmount.toFixed(2)}</td>
                </tr>
              ))}
              {productDetails.map((product, index) => (
                <tr key={`product-${index}`}>
                  <td className={tdClass}>{itemDetails.length + index + 1}</td>
                  <td className={tdClass}>
                    <Link
                      to={`/admin/viewproduct/${product._id}`}
                      style={{
                        color: '#2563eb',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.target.style.color = '#1e40af')}
                      onMouseLeave={e => (e.target.style.color = '#2563eb')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.productName}
                    </Link>
                  </td>
                  <td className={tdClass}>{boqData.ProductList[index].ReqQty}</td>
                  <td className={tdClass}>{boqData.ProductList[index].SorRate}</td>
                  <td className={tdClass}>{boqData.ProductList[index].SorAmount.toFixed(2)}</td>
                </tr>
              ))}
              {/* Note: No summary row added to the display table */}
            </tbody>
          </table>
        </div>

        {/* Optional: Separate Total Display Below the Table */}
        <div className="mt-4">
          <h6 className="text-blueGray-700 text-lg font-bold">
            Total SOR Amount: {totalSorAmount}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default CardViewBOQ;
