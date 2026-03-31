import SavedPrescription from '@/app/(order-now)/select-prescription/components/SavedPrescription';
import ShowPrescriptions from '@/app/(order-now)/select-prescription/components/ShowPrescriptions';
import UploadCard from '@/app/(order-now)/select-prescription/components/UploadCard';
import React from 'react';

function UploadPrescription({
  href,
  orderType,
}: {
  href: string;
  orderType: 'order' | 'quickOrder';
}) {
  return (
    <section className="w-full md:w-[30dvw] md:min-h-[70dvh] border bg-white border-gray-300 shadow px-8 py-6  rounded-md">
      <div>
        <h1 className="font-bold text-xl">Upload Prescription</h1>
        <p className="mt-2 text-gray-600">Please attach a prescription to proceed</p>
        <div className="flex flex-col gap-4 mt-6">
          <UploadCard />
          <SavedPrescription />
        </div>

        <div className="mt-6 md:h-[38dvh] overflow-hidden">
          <h2>Attached Prescription</h2>

          {/* here add a component that will show the uploaded prescription */}
          <ShowPrescriptions href={href} orderType={orderType} />
        </div>
      </div>
    </section>
  );
}

export default UploadPrescription;
