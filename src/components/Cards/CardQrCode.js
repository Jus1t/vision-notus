import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import api from "views/auth/api";
// import {Date} from "date";
const QRCodeScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [qrActive, setQrActive] = useState(true);
  const [optionBox,setOptionBox] = useState(false);
  const [messageBox,setMessageBox] = useState(false);
  const [message ,setMessage] =useState(null);
  const [scanResult,setScanResult] =useState(null);
  const handleInTime=async(result) =>{
    try {
      let payloadJWT = await api.get(`/verify-token`);
      console.log(payloadJWT)
      if (scanResult) {
        setScannedData(scanResult);
        // setError(null); // Clear any previous errors
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const payload ={
          employeeObjectId:scanResult,
          markedBy:payloadJWT.data.oid,
          date:currentDate,
          inTime:currentTime,
          outTime:"",
        };
        // console.log(payload);
        const response = await api.post(`/attendance`,payload);
        console.log(response.data);
        // setShowModal(true); // Show the modal
        setOptionBox(false);
        setMessage(response.data.message);
        setMessageBox(true);
        setError(null); // Clear any previous errors
        scanResult(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleOutTime = async(result) =>{
    try {
      let payloadJWT = await api.get(`/verify-token`);
      console.log(payloadJWT)
      if (scanResult) {
        setScannedData(scanResult);
        // setError(null); // Clear any previous errors
        const currentDate= new Date().toLocaleDateString();
        const currentTime= new Date().toLocaleTimeString();
        const payload ={
          employeeObjectId:scanResult,
          markedBy:payloadJWT.data.oid,
          date:currentDate,
          outTime:currentTime,
        };
        // console.log(payload);
        const response = await api.post(`/attendance/outtime`,payload);
        // console.log(response.data);
        setShowModal(true); // Show the modal
        setMessage(response.data.message);
        setMessageBox(true);
        setOptionBox(false);
        setError(null); // Clear any previous errors
        setScanResult(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleScan = async (result) => {
    if (!qrActive || !result?.text) return;
    try {
      setMessage(null);
      setQrActive(false);
      setShowModal(false);
      setError(false);
      setOptionBox(true);
      setScanResult(result.text);
      
    } catch (error) {
      console.error("Error verifying token:", error);
      setQrActive(true);
    }
  };

  const handleError = (err) => {
    if (qrActive) {
      // setError("Error scanning QR code. Please try again.");
      // console.error(err);
    }
  };

  const handleContinue = () => {
    setScannedData(null); // Clear the scanned data
    setShowModal(false); // Hide the modal
    setQrActive(true); // Re-enable QR scanning
    setMessageBox(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* <h1>QR Code Scanner</h1> */}
      <div style={{ width: "300px", margin: "0 auto" }}>
        <div>
          <h1>Scan QR Code</h1>
        </div>
        {qrActive && (
          <>
            <QrReader
              constraints={{ facingMode: "environment" }} // Use back camera
              onResult={(result, error) => {
                if (result) handleScan(result);
                if (error) handleError(error);
              }}
              style={{ width: "100%" }}
            />
            <p>Scan QR Code</p> {/* This will now render properly */}
          </>
        )}
      </div>
  
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
  
      {/* Modal */}
      {messageBox && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Message</h3>
            <p>{message}</p>
            <button
              onClick={handleContinue}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Continue Marking
            </button>
          </div>
        </div>
      )}
      {optionBox && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>What do you want to mark?</h3>
            <button
              onClick={handleInTime}
              style={{
                marginTop: "20px",
                padding: "2px 5px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              InTime
            </button>
            <button
              onClick={handleOutTime}
              style={{
                marginTop: "20px",
                marginLeft: "10px",
                padding: "2px 5px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              OutTime
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};


export default QRCodeScanner;
