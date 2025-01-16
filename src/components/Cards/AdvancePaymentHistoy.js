import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "views/auth/api";

export default function CardViewAdvancePayments() {
  const { employeeId } = useParams();
  const [advancePayments, setAdvancePayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employee details
        const employeeResponse = await api.get(`/employee-details/${employeeId}`);
        setEmployeeDetails(employeeResponse.data);

        // Fetch advance payments
        const response = await api.get(`/advance-payment/employee/${employeeId}`);
        // Sort payments by date in descending order
        const sortedPayments = response.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setAdvancePayments(sortedPayments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching advance payments:', err);
        setError('Failed to load advance payment history');
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blueGray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full bg-gray-50 min-h-screen py-8 px-4 md:px-10">
      {/* Employee Header */}
      <div className="bg-white rounded-xl shadow-lg px-8 py-6 mb-6">
        <h2 className="text-2xl font-bold text-blueGray-800 text-center">
          Advance Payment History - {employeeDetails?.FirstName} {employeeDetails?.LastName}
        </h2>
      </div>

      {/* Advance Payment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {advancePayments.map((payment) => (
          <div 
            key={payment._id} 
            className={`bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border ${
              payment.cleared ? 'border-green-200' : 'border-yellow-200'
            }`}
          >
            {/* Payment Date */}
            <div className="text-lg font-bold text-blueGray-700 mb-4">
              {new Date(payment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blueGray-600 font-medium">Amount:</span>
                <span className="font-semibold text-blueGray-800">₹{payment.amountPaid}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blueGray-600 font-medium">Status:</span>
                <span className={`font-semibold ${
                  payment.cleared ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {payment.cleared ? 'Cleared' : 'Pending'}
                </span>
              </div>

              {payment.paidBy && (
                <div className="text-sm text-blueGray-500 mt-3">
                  Paid by: {payment.paidBy.FirstName} {payment.paidBy.LastName}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {advancePayments.length === 0 && (
        <div className="text-center py-12 text-blueGray-600 text-lg">
          No advance payment history found for this employee.
        </div>
      )}

      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-lg px-8 py-6 mt-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-blueGray-600 font-medium">Total Advance Amount:</span>
            <span className="font-semibold text-blueGray-800 ml-2">
              ₹{advancePayments.reduce((total, payment) => total + payment.amountPaid, 0)}
            </span>
          </div>
          <div>
            <span className="text-blueGray-600 font-medium">Pending Amount:</span>
            <span className="font-semibold text-blueGray-800 ml-2">
              ₹{advancePayments
                .filter(payment => !payment.cleared)
                .reduce((total, payment) => total + payment.amountPaid, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
