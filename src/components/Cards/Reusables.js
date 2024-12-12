// src/components/Reusables.js

import React from 'react';
import FileUpload from './FileUpload';

// TextInput Component
export const TextInput = ({ label, id, value, onChange, required = false, type = "text" }) => (
  <div className="w-full lg:w-6/12 px-4 mb-3">
    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <input
      type={type}
      id={id}
      required={required}
      value={value}
      onChange={onChange}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
    />
  </div>
);

// TextArea Component
export const TextArea = ({ label, id, value, onChange, required = false }) => (
  <div className="w-full lg:w-12/12 px-4 mb-3">
    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <textarea
      id={id}
      rows="3"
      required={required}
      value={value}
      onChange={onChange}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
    ></textarea>
  </div>
);

// SelectInput Component
export const SelectInput = ({ label, id, value, onChange, options, required = false }) => (
  <div className="w-full lg:w-6/12 px-4 mb-3">
    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor={id}>
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <select
      id={id}
      required={required}
      value={value}
      onChange={onChange}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// FileUpload Component
export { default as FileUpload } from './FileUpload';
