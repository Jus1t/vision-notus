import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "views/auth/api";

export default function CardViewPayments() {
  const { employeeId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeeResponse = await api.get(`/employee-details/${employeeId}`);
        setEmployeeDetails(employeeResponse.data);

        const response = await api.get(`/payment/employee/${employeeId}`);
        const sortedPayments = response.data.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
        setPayments(sortedPayments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payment history');
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
          Payment History - {employeeDetails?.FirstName} {employeeDetails?.LastName}
        </h2>
      </div>

      {/* Payment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {payments.map((payment) => (
          <div 
            key={payment._id} 
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-blueGray-100"
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
                <span className="text-blueGray-600 font-medium">Total Amount:</span>
                <span className="font-semibold text-blueGray-800">₹{payment.totalAmound}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blueGray-600 font-medium">Advance Cleared:</span>
                <span className="font-semibold text-blueGray-800">₹{payment.totalAdvanceCleared}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blueGray-600 font-medium">Net Amount Paid:</span>
                <span className="font-semibold text-blueGray-800">₹{payment.amountPaid}</span>
              </div>
              <div className="border-t border-blueGray-200 my-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-blueGray-600 font-medium">Full Days:</span>
                  <span>{payment.fullWorkingDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blueGray-600 font-medium">Half Days:</span>
                  <span>{payment.halfWorkingDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blueGray-600 font-medium">Holidays:</span>
                  <span>{payment.holidays}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blueGray-600 font-medium">Daily Wage:</span>
                <span className="font-semibold text-blueGray-800">₹{payment.wage}</span>
              </div>
              <div className="text-sm text-blueGray-500 mt-3">
                Previous Payment: {new Date(payment.previousPaymentDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12 text-blueGray-600 text-lg">
          No payment history found for this employee.
        </div>
      )}
    </div>
  );
}
