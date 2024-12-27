import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import api from "views/auth/api";

const QRCodeScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [qrActive, setQrActive] = useState(true);
  const handleScan = async (result) => {
    if (!qrActive || !result?.text) return;
    try {
      setQrActive(false);
      let payloadJWT = await api.get(`/verify-token`);
      console.log(payloadJWT)
      if (result?.text) {
        setScannedData(result.text);
        // setError(null); // Clear any previous errors
        const payload ={
          employeeObjectId:result.text,
          markedBy:payloadJWT.data.oid
        };
        console.log(payload);
        const response = await api.post(`/attendance`,payload);
        console.log(response.data);
        setShowModal(true); // Show the modal
        setError(null); // Clear any previous errors
      }
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
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code Scanner</h1>
      <div style={{ width: "300px", margin: "0 auto" }}>
        {qrActive && ( // Only render the QR reader when QR scanning is active
          <QrReader
          constraints={{ facingMode: "environment" }} // Use back camera
          onResult={(result, error) => {
              if (result) console.log(result);
              if (error) console.error(error);
          }}
          style={{ width: "100%" }}
      />
        )}
      </div>
      {scannedData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Scanned Data:</h3>
          <p>{scannedData}</p>
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
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
            <h3>Attendance Marked!</h3>
            <p>The attendance for ID {scannedData} has been successfully marked.</p>
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
    </div>
  );
};


export default QRCodeScanner;
