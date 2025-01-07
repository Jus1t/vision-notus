import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "views/auth/api";
import { useHistory } from 'react-router-dom';

export default function PaymentPage() {
  const { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [advancePayments, setAdvancePayments] = useState([]);
  const [lastPaymentDate,setLastPaymentDate]=useState(null);
  const [paidBy,setPaidBy]=useState(null);
  const [pendingAdvancesCleared,setPendingAdvancesCleared]=useState([]);
  const [amountPaid,setAmountPaid]=useState(null);
  const [workingDays, setWorkingDays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate ();
  const history = useHistory();
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee details
        const employeeResponse = await api.get(`/employee-details/${employeeId}`);
        setEmployeeDetails(employeeResponse.data);

        // Fetch advance payments
        const advanceResponse = await api.get(`/advance-payment/employee/${employeeId}`);
        setAdvancePayments(advanceResponse.data);
        
        const lastPaymentDateResponse = await api.get(`/last-payment/employee/${employeeId}`);
        console.log(lastPaymentDateResponse.data.lastDate);
        // Convert the ISO date string to YYYY-MM-DD format and ensure it's a string
        const formattedDate = String(lastPaymentDateResponse.data.lastDate.split('T')[0]);
        setLastPaymentDate(formattedDate);
        console.log(formattedDate);
        // Fetch working days with formatted date
        const workingDaysResponse = await api.get(`/working-days/${employeeId}/${formattedDate}`);
        setWorkingDays(workingDaysResponse.data);

        const paidByResponse=await api.get(`/verify-token/`);
        setPaidBy(paidByResponse.data.oid);

        console.log(currentDate)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Add function to calculate total advance payments
  const calculateTotalAdvance = () => {
    return advancePayments.reduce((total, payment) => total + payment.amountPaid, 0);
  };

  // Add function to calculate net payment
  const calculateNetPayment = () => {
    if (!employeeDetails || !workingDays) return 0;

    const wagePerDay = employeeDetails.WagePerDay || 0;
    const fullDayAmount = workingDays.totalWorkingDays * wagePerDay;
    const halfDayAmount = workingDays.halfWorkingDays * (wagePerDay / 2);
    const totalAdvance = calculateTotalAdvance();
    
    return fullDayAmount + halfDayAmount - totalAdvance;
  };

  // Add a useEffect to handle amountPaid updates
  useEffect(() => {
    if (employeeDetails && workingDays) {
      const netPayment = calculateNetPayment();
      setAmountPaid(netPayment);
    }
  }, [employeeDetails, workingDays, advancePayments]); // Add dependencies that affect the calculation

  // Add handlePaymentSubmission function after other functions
  const handlePaymentSubmission = async () => {
    try {
      // Get current date and format it to YYYY-MM-DD
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      const paymentData = {
        employeeObjectId: employeeId,
        date: formattedDate,  // Using the formatted date
        amountPaid: calculateNetPayment(),
        pendingAdvancesCleared: advancePayments.map(payment => payment._id),
        paidBy: paidBy
      };

      await api.post('/payment', paymentData);
      alert('Payment submitted successfully');
      history.push(`/admin/payment-page/${employeeId}`);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment');
    }
  };

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

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      {/* Employee Details Section */}
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Payment Details</h6>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        {/* Basic Information */}
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Employee Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Name</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.FirstName} {employeeDetails?.LastName}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Father's Name</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.FathersName}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Contact</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.ContactDetails}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="w-full lg:w-6/12 px-4">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Financial Details
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Bank Account</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.BankAccountNo}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Bank & Branch</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.NameOfBankAndBranch}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">IFSC Code</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.IfscCode}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">PF Number</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.PfNo}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">ESI Code</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.EsiCode}</p>
              </div>
              <div className="w-full lg:w-6/12 px-4 mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Wage Per Day</label>
                <p className="text-blueGray-600 text-sm">{employeeDetails?.WagePerDay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Days Information */}
        <div className="mt-6 border-t border-blueGray-200 pt-6">
          <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
            Working Days (Current Month)
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Total Working Days</label>
              <p className="text-blueGray-600 text-sm">{workingDays?.totalWorkingDays}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Half Working Days</label>
              <p className="text-blueGray-600 text-sm">{workingDays?.halfWorkingDays}</p>
            </div>
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Holidays</label>
              <p className="text-blueGray-600 text-sm">{workingDays?.holidays}</p>
            </div>
          </div>
        </div>

        {/* Advance Payments Table */}
        <div className="mt-6 border-t border-blueGray-200 pt-6">
          <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
            Advance Payments History
          </h6>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Date
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {advancePayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      ₹{payment.amountPaid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Payment Calculation Section - Now after the advance payments table */}
        <div className="mt-6 border-t border-blueGray-200 pt-6">
          <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
            Payment Calculation
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Full Day Amount
              </label>
              <p className="text-blueGray-600 text-sm">
                ₹{(workingDays?.totalWorkingDays || 0) * (employeeDetails?.WagePerDay || 0)}
              </p>
              <p className="text-xs text-blueGray-400">
                ({workingDays?.totalWorkingDays || 0} days × ₹{employeeDetails?.WagePerDay || 0})
              </p>
            </div>
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Half Day Amount
              </label>
              <p className="text-blueGray-600 text-sm">
                ₹{(workingDays?.halfWorkingDays || 0) * ((employeeDetails?.WagePerDay || 0) / 2)}
              </p>
              <p className="text-xs text-blueGray-400">
                ({workingDays?.halfWorkingDays || 0} days × ₹{(employeeDetails?.WagePerDay || 0) / 2})
              </p>
            </div>
            <div className="w-full lg:w-4/12 px-4 mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Total Advance
              </label>
              <p className="text-blueGray-600 text-sm">₹{calculateTotalAdvance()}</p>
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full px-4">
              <div className="bg-blueGray-50 rounded-lg p-4">
                <label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
                  Net Payment
                </label>
                <p className="text-blueGray-700 text-2xl font-bold">
                  ₹{calculateNetPayment()}
                </p>
                <p className="text-xs text-blueGray-400 mt-1">
                  (Full Day Amount + Half Day Amount - Total Advance)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add this button before the closing div of the payment calculation section */}
        <div className="flex flex-wrap mt-6">
          <div className="w-full px-4">
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handlePaymentSubmission}
            >
              Submit Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
