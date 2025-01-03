import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

export default function CardWorkHistory() {
  const { id } = useParams();
  const [basicInfo, setBasicInfo] = useState(null);
  const [workSummary, setWorkSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const response = await api.get(`/employee-details/${id}`);
        setBasicInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employee details');
        setLoading(false);
      }
    };

    fetchBasicInfo();
  }, [id]);

  const fetchWorkHistory = async (month, year) => {
    try {
      const response = await api.get(`/working-days/${id}/${month}/${year}`);
      setWorkSummary(response.data);
    } catch (err) {
      console.error('Failed to fetch work history:', err);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setWorkSummary(null); // Clear work summary when month changes
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setWorkSummary(null); // Clear work summary when year changes
  };

  const handleViewClick = () => {
    if (selectedMonth && selectedYear) {
      fetchWorkHistory(selectedMonth, selectedYear);
    } else {
      alert('Please select both month and year.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!basicInfo) return <div>No employee data found</div>;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Work History</h6>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        {/* Basic Information */}
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Basic Information
        </h6>
        <div className="flex flex-wrap">
          <InfoField label="Name" value={`${basicInfo.FirstName} ${basicInfo.LastName}`} />
          <InfoField label="Phone Number" value={basicInfo.ContactDetails} />
          <InfoField label="Father's Name" value={basicInfo.FathersName} />
        </div>

        {/* Work History */}
        <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">
          Work Summary
        </h6>
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-6/12 px-4 mb-4">
            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
              Month
            </label>
            <select
              className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-4">
            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
              Year
            </label>
            <select
              className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="bg-orange-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          onClick={handleViewClick}
        >
          View
        </button>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        {/* Render Work Summary */}
        <div className="mt-6">
          {workSummary ? (
            <div className="bg-white rounded shadow-lg p-4">
              <h6 className="text-blueGray-700 text-lg font-bold mb-4">Work Summary for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h6>
              <p><strong>Total Working Days:</strong> {workSummary.totalWorkingDays}</p>
              <p><strong>Half Working Days:</strong> {workSummary.halfWorkingDays}</p>
              <p><strong>Holidays:</strong> {workSummary.holidays}</p>
            </div>
          ) : (
            <p className="text-blueGray-600 text-center mt-4">No data available for selected month and year.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value }) => (
  <div className="w-full lg:w-6/12 px-4">
    <div className="relative w-full mb-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
        {label}
      </label>
      <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);
