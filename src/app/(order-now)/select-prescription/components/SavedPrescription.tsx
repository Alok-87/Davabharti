'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Card from './Card';
import { IoDocumentsSharp } from 'react-icons/io5';

function SavedPrescription() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/user/prescription?from=select-prescription');
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card label="Saved Prescription">
        {' '}
        <IoDocumentsSharp className="text-4xl text-primary" />{' '}
      </Card>
    </div>
  );
}

export default SavedPrescription;
