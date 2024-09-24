import React from "react";

// components

import CardNewEmployee from "components/Cards/CardNewEmployee"

export default function AddEmployee() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardNewEmployee />
        </div>
        
      </div>
    </>
  );
}
