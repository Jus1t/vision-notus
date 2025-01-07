import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "views/auth/api";
import { useHistory } from 'react-router-dom';

export default function AdvancePayment() {
  const { employeeId } = useParams();
  const history = useHistory();
  
  console.log('Component rendering, employeeId:', employeeId);

  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [formData, setFormData] = useState({
    employeeObjectId: employeeId,
    date: new Date().toISOString().split('T')[0],
    amountPaid: "",
    paidBy: "",
    cleared: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modify the token verification useEffect
  useEffect(() => {
    const fetchPaidByDetails = async () => {
      try {
        const response = await api.get('/verify-token');
        const userData = response.data;
        
        // Set the paidBy ID in the form data
        setFormData(prev => ({
          ...prev,
          paidBy: userData.oid
        }));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching authorized user:', err);
        setError('Failed to load authorized user');
        setLoading(false);
      }
    };

    fetchPaidByDetails();
  }, []);

  // Add new useEffect to fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        console.log('Fetching employee details...');
        const response = await api.get(`/employee-details/${employeeId}`);
        console.log('Employee details received:', response.data);
        setEmployeeDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load employee details');
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    try {
      await api.post('/advance-payment', formData);
      alert('Advance payment recorded successfully');
      history.goBack(); // or redirect to a specific page
    } catch (err) {
      setError('Failed to record advance payment');
      console.error('Error:', err);
    }
  };

  // Add early return conditions with visual feedback
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!employeeDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">No employee details found</div>
      </div>
    );
  }

  console.log('Rendering component with employeeDetails:', employeeDetails);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Record Advance Payment</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        {/* Employee Details Section */}
        <div className="mb-6 border-b border-blueGray-200 pb-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Employee Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Employee Name
              </label>
              <p className="text-blueGray-600 text-sm">
                {employeeDetails?.FirstName || 'N/A'}
              </p>
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Father's Name
              </label>
              <p className="text-blueGray-600 text-sm">
                {employeeDetails?.FathersName || 'N/A'}
              </p>
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Contact Number
              </label>
              <p className="text-blueGray-600 text-sm">
                {employeeDetails?.ContactDetails || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-100 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  readOnly
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="amountPaid"
                >
                  Amount
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
