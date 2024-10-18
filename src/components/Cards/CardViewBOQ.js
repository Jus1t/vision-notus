import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

const CardViewBOQ = ({ color = 'light' }) => {
  const { id } = useParams(); // Get BOQ id from URL parameters
  const [boqData, setBoqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishingAuthority, setPublishingAuthority] = useState(null);

  useEffect(() => {
    const fetchBOQ = async () => {
      try {
        // Fetch the BOQ details using the BOQ ID from the URL
        const response = await api.get(`/boq-details/${id}`);
        const boqDetails = response.data;
        console.log(response.data)
        setBoqData(boqDetails);
        // Fetch the publishing authority name using the PublishingAuthId from the BOQ details
        const pubAuthResponse = await api.get(`/publishing-auth/${boqDetails.PublishingAuthId}`);
        setPublishingAuthority(pubAuthResponse.data.name);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching BOQ data:', error);
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
  const totalSorAmount =
    boqData.ItemList &&
    boqData.ItemList.reduce((acc, item) => acc + item.SorAmount, 0).toFixed(2);

  return (
    <div
      className={
        'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
        (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
      }
    >
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <h6 className="text-blueGray-700 text-xl font-bold">BOQ Details</h6>
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
                Tender No
              </label>
              <p className="text-blueGray-700 text-sm">{boqData.TenderNo}</p>
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
              {boqData.ItemList &&
                boqData.ItemList.map((i, index) => (
                  <tr key={index}>
                    <td className={tdClass}>{index + 1}</td>
                    <td className={tdClass}>{i.Item.ShortDesc}</td>
                    <td className={tdClass}>{i.ReqQty}</td>
                    <td className={tdClass}>{i.SorRate}</td>
                    <td className={tdClass}>{i.SorAmount.toFixed(2)}</td>
                  </tr>
                ))}
              {boqData.ProductList &&
                boqData.ProductList.map((product, index) => (
                  <tr key={`product-${index}`}>
                    <td className={tdClass}>{boqData.ItemList.length + index + 1}</td>
                    <td className={tdClass}>{product.Product.productName}</td>
                    <td className={tdClass}>{product.ReqQty}</td>
                    <td className={tdClass}>{product.SorRate}</td>
                    <td className={tdClass}>{product.SorAmount.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Display total SOR Amount */}
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
