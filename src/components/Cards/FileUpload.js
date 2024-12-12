// src/components/FileUpload.js

import React, { useState } from 'react';
import api from 'views/auth/api';

export default function FileUpload({ label, id, onUploadSuccess }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setErrorMessage(null); // Clear any previous errors
      setSuccessMessage(false); // Clear success message
      setIsUploading(true); // Set uploading state

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(true);
      console.log('File uploaded successfully:', response.data);

      if (onUploadSuccess) {
        // Ensure response.data.id exists
        if (response.data && response.data.id) {
          onUploadSuccess(response.data.id); // Pass the uploaded file ID back to parent
        } else {
          throw new Error('Invalid response from server: Missing file ID.');
        }
      }
    } catch (error) {
      setErrorMessage('Error uploading file: ' + (error.response?.data?.message || error.message));
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="w-full lg:w-6/12 px-4 mb-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type="file"
        id={id}
        accept="image/*"
        onChange={handleFileChange}
        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
      />
      {isUploading && <p>Uploading...</p>}
      {successMessage && <p className="text-green-500">Upload Successful</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
