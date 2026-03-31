import React from 'react';
import UploadPrescription from '@/components/shared/upload-prescription/UploadPrescription';

function page() {
  return (
    <main className="md:min-h-[80dvh] flex flex-col md:flex-row items-center justify-center gap-6 px-6 py-6">
      {/* <section className='w-full md:w-[30dvw] md:min-h-[70dvh] border border-gray-300 shadow px-8 py-6 '>
           <div>
            <h1 className='font-bold text-xl'>Upload Prescription</h1>
            <p className='mt-2 text-gray-600'>Please attach a prescription to proceed</p>
           <div className='flex flex-col gap-4 mt-6'>
            <UploadCard/>
            <SavedPrescription/>
           </div>
          
           <div className='mt-6'>
            <h2>Attached Prescription</h2>
             <div className='flex flex-wrap items-center gap-4 py-4 ' >
                <div className='w-30 h-30 bg-gray-100 flex justify-center items-center'>
                  <FaFilePrescription className='text-5xl text-gray-400' />
                
                </div>
                {/* here add a component that will show the uploaded prescription */}
      {/* <ShowPrescriptions/>
             </div>
           </div>

           </div> */}
      {/* </section>  */}
      <UploadPrescription href="/order-by-prescription" orderType="quickOrder" />

      <article className="w-full md:w-[40dvw] min-h-[88dvh] rounded border border-gray-300 shadow overflow-hidden flex flex-col md:px-6 py-6">
        {/* Heading row */}
        <header className="flex items-center justify-between px-4 py-3">
          <h3 className="text-lg font-semibold">Guide for a valid prescription</h3>
        </header>

        {/* Content area: image + bullets */}
        <div className="flex flex-col md:flex-row flex-1 px-4 py-3 gap-4">
          {/* Left: image (takes 70% of the whole card height) */}
          <div className="w-full md:w-1/2 h-[280px] md:h-[70%] rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
            {/* Using object-cover to preserve aspect ratio and fill the container */}
            <img
              src="/validate_rx.png"
              alt="Prescription upload preview"
              className="w-full h-full md:object-cover "
              draggable={false}
            />
          </div>

          {/* Right: bullet points */}
          <div className="w-1/2 h-full overflow-auto">
            <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Validate Prescription Guide</strong>
              </li>
              <li>Don’t crop out any part of the image</li>
              <li>Avoid blurred image</li>
              <li>Include details of doctor and patient + clinic visit date</li>
              <li>Medicines will be dispensed as per prescription</li>
              <li>Supported files type: jpeg, jpg, png, pdf</li>
              <li>Maximum allowed file size: 5MB</li>
            </ul>
          </div>
        </div>
        <p className="mb-2 ml-4 text-xs font-medium">
          *Government regulations require a valid prescription
        </p>
      </article>
    </main>
  );
}

export default page;
