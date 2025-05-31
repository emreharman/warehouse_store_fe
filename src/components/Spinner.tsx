"use client";

import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-full p-3 shadow-md">
        <img
          src="/spinner.gif"
          alt="Yükleniyor..."
          className="w-20 h-20 object-contain"
        />
      </div>
    </div>
  );
};

export default Spinner;
