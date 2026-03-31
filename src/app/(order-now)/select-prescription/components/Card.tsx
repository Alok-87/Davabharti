import React from 'react';

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="md:w-[25dvw] h-[80px] border border-gray-300 shadow-lg rounded-[10px] flex overflow-hidden">
      <div className="w-[30%] h-full bg-gray-100 flex justify-center items-center">{children}</div>
      <div className="w-[70%] flex items-center ">
        <p className="font-bold text-gray-700 ml-6">{label}</p>
      </div>
    </div>
  );
}

export default Card;
