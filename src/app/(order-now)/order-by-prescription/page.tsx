import SelectAddress from '@/components/shared/select-address/SelectAddress';
import React from 'react';
import Link from 'next/link';
import SelectedPrescription from './components/SelectedPrescription';
import PlaceOrderButton from './components/PlaceOrderButton';

function Page() {
  return (
    <main className="md:min-h-[80dvh] flex flex-col md:flex-row items-start justify-center gap-6 px-6 py-6">
      <section className="w-full md:w-[34dvw] md:min-h-[80dvh] border border-gray-300 shadow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
          <h1 className="font-bold text-lg md:text-xl text-gray-600">Selected Prescription</h1>
          <Link href="/select-prescription" className="text-primary font-bold">
            Add New
          </Link>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* {prescriptions.map((item) => (
      <Prescription key={item.id} item={item} />
    ))} */}
          <SelectedPrescription />
        </div>
      </section>

      <section className="w-full md:w-[50dvw] md:max-h-[80dvh] flex flex-col border border-gray-300 shadow">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-4">
          <SelectAddress />
        </div>

        {/* Fixed footer */}
        <div className="w-full flex justify-between md:justify-end py-2 px-6 ">
          <PlaceOrderButton />
        </div>
      </section>
    </main>
  );
}

export default Page;
