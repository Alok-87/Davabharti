'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function RequiresPrescription() {
  const router = useRouter();

  const { register, watch } = useForm({
    defaultValues: {
      prescription: 'no',
    },
  });

  // Watch for radio value change
  const selected = watch('prescription');

  // Navigate when "yes" is selected

   useEffect(() => {
    if (selected === 'yes') {
      router.push('/checkout/upload-prescription');
    }
  }, [selected, router]);

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-7">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Item in your cart requires Prescription
      </h2>

      <div className="space-y-4">
        {/* Option 1: No Prescription */}
        <label className="flex items-start gap-3 cursor-pointer border border-gray-200 rounded-md p-3 hover:border-primary transition">
          <input
            type="radio"
            value="no"
            {...register('prescription')}
            className="mt-1 text-primary focus:ring-primary"
          />
          <div>
            <p className="font-medium text-gray-800">I don’t have a prescription</p>
            <p className="text-sm text-gray-600 leading-snug">
              Dava Bharti doctors will consult you without charges for your order.
            </p>
          </div>
        </label>

        {/* Option 2: Yes, I have Prescription */}
        <label className="flex items-start gap-3 cursor-pointer border border-gray-200 rounded-md p-3 hover:border-primary transition">
          <input
            type="radio"
            value="yes"
            {...register('prescription')}
            className="mt-1 text-primary focus:ring-primary"
          />
          <div>
            <p className="font-medium text-gray-800">I have a prescription</p>
            <p className="text-sm text-gray-600 leading-snug">
              Our pharmacist will dispense medicines only if the prescription is valid.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}
