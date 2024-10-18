import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "views/auth/api";

export default function CardViewProducts({ color = "light" }) {
  const [productData, setProductData] = useState([]);
  const history = useHistory(); // Hook for navigation
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Fetch product data from API or use dummy data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product-details"); // Example API endpoint for product data
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product data, using dummy data", error);
        // Dummy data with consistent property names
        setProductData([
          { _id: "1", productName: "Product 1", description: "Description 1", unit: "Unit 1" },
          { _id: "2", productName: "Product 2", description: "Description 2", unit: "Unit 2" },
          // Add more dummy data as needed
        ]);
      }
    };
    fetchProducts();
  }, []);

  const handleViewProduct = (productId) => {
    history.push(`/admin/viewproduct/${productId}`); // Navigate to the detailed product view
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await api.delete(`/product-details/${id}`); // Adjust API endpoint as needed
        // Remove the deleted product from the state
        setProductData((prevData) => prevData.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Pagination logic
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productData.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productData.length / productsPerPage);

  const columnBaseClass =
    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ";
  const lightClass = "bg-blueGray-50 text-blueGray-500 border-blueGray-100";
  const darkClass = "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700";
  const columnSelectedClass = color === "light" ? lightClass : darkClass;
  const tdClass =
    "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <h6 className="text-blueGray-700 text-xl font-bold">View Products</h6>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className={columnBaseClass + columnSelectedClass}>Product Name</th>
              <th className={columnBaseClass + columnSelectedClass}>Description</th>
              <th className={columnBaseClass + columnSelectedClass}>Unit</th>
              <th className={columnBaseClass + columnSelectedClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={index}>
                <td className={tdClass}>{product.productName}</td>
                <td className={tdClass}>{product.description}</td>
                <td className={tdClass}>{product.unit}</td>
                <td className={tdClass}>
                  <button
                    className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mr-2"
                    onClick={() => handleViewProduct(product._id)}
                  >
                    View Product
                  </button>
                  <button
                    className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 rounded"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-blueGray-400" : "bg-gray-300"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 mx-1 bg-gray-300 rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
