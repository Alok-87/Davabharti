'use client';

import { BeakerIcon } from '@heroicons/react/24/outline';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';

interface MedicineInfoCardProps {
  returnable?: string | boolean;
  prescriptionRequired?: string | boolean;
  typeOfMedicine?: string;
}

export default function MedicineInfoCard({
  returnable,
  prescriptionRequired,
  typeOfMedicine,
}: MedicineInfoCardProps) {
  const info = [
    {
      id: 1,
      name: 'Returnable',
      value:
        typeof returnable === 'boolean' ? (returnable ? 'Yes' : 'No') : returnable || 'N/A',
      icon: TbTruckDelivery,
    },
    {
      id: 2,
      name: 'Prescription Required',
      value:
        typeof prescriptionRequired === 'boolean'
          ? prescriptionRequired
            ? 'Yes'
            : 'No'
          : prescriptionRequired || 'N/A',
      icon: HiOutlineClipboardList,
    },
    {
      id: 3,
      name: 'Type of Medicine',
      value: typeOfMedicine || 'N/A',
      icon: BeakerIcon,
    },
  ];

  return (
    <div className="bg-white py-4 md:py-6 mt-8">
      <div className="max-w-6xl mx-auto flex  sm:flex-wrap justify-center items-center px-5 gap-3 sm:gap-5">

        {info.map((item, index) => {
          const Icon = item.icon;
          const showDivider = index < info.length - 1;

          return (
            <div key={item.id} className="flex items-center">

              {/* Item Block */}
              <div className="flex flex-col sm:flex-row items-center gap-3 min-w-[120px]">
                <Icon className="h-6 w-6 md:h-10 md:w-10 text-primary" />

                <div className="flex flex-col items-center  text-center ">
                  <p className="text-xs md:text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {item.value}
                  </p>
                </div>
              </div>


              {/* Vertical Divider (desktop only) */}
              {showDivider && (
                <div className="hidden md:block mx-6 h-10 w-px bg-gray-300"></div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
