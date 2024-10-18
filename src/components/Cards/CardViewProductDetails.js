import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

const CardViewProductDetails = ({ color = 'light' }) => {
  const { id } = useParams(); // Get product id from URL parameters
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product details using the product ID from the URL
        const response = await api.get(`/product-details/${id}`);
        setProductData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!productData) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  // Define classes for styling
  const columnbaseclass =
    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ';
  const lightClass = 'bg-blueGray-50 text-blueGray-500 border-blueGray-100';
  const darkClass = 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700';
  const columnselectedclass = color === 'light' ? lightClass : darkClass;
  const tdClass =
    'border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4';

  return (
    <div
      className={
        'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
        (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
      }
    >
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <h6 className="text-blueGray-700 text-xl font-bold">Product Details</h6>
      </div>
      <div className="px-4 lg:px-10 py-10 pt-0">
        <div className="mb-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Product Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Product Name
              </label>
              <p className="text-blueGray-700 text-sm">{productData.productName}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Description
              </label>
              <p className="text-blueGray-700 text-sm">{productData.description}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Unit
              </label>
              <p className="text-blueGray-700 text-sm">{productData.unit}</p>
            </div>
          </div>
        </div>

        {/* Items List Section */}
        <div className="block w-full overflow-x-auto mt-6">
          <h6 className="text-blueGray-400 text-sm font-bold uppercase">Associated Items</h6>
          <table className="items-center w-full bg-transparent border-collapse table-auto">
            <thead>
              <tr>
                <th className={columnbaseclass + columnselectedclass}>#</th>
                <th className={columnbaseclass + columnselectedclass}>Item Name</th>
                <th className={columnbaseclass + columnselectedclass}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {productData.itemList &&
                productData.itemList.map((item, index) => (
                  <tr key={index}>
                    <td className={tdClass}>{index + 1}</td>
                    <td className={tdClass}>{item.ShortDesc}</td>
                    <td className={tdClass}>{item.Quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CardViewProductDetails;
