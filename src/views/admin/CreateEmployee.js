import React from "react";

// components

import CardCreateEmployee from "components/Cards/CardCreateEmployee"

export default function CreateEmployee() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardCreateEmployee />
        </div>
        
      </div>
    </>
  );
}
