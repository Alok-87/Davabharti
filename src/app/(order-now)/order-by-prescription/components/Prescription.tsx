import Image from 'next/image';
import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

interface PrescriptionProp {
  img: string;
  id: number;
}

function Prescription({ item }: { item: PrescriptionProp }) {
  return (
    <div className="border border-gray-100 max-w-[150] max-h-[200] relative">
      <Image src={item.img} alt="id" height={200} width={150} />
      <button className="absolute z-10  rounded top-2 right-2 cursor-pointer ">
        <MdDeleteForever className="text-red-500 text-2xl" />
      </button>
    </div>
  );
}

export default Prescription;
