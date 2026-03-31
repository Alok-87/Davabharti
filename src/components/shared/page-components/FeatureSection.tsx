import Image from 'next/image';
import family from '@/assets/family.svg';
import location from '@/assets/locationMarker.svg';
import medicine from '@/assets/medicine.svg';
import deliverboy from '@/assets/deliveryBoy.svg';

const statsData = [
  {
    title: '5 Million+',
    description: 'Registered users ',
    icon: family,
  },
  {
    title: '7 Million+',
    description: 'Orders on Davabharti ',
    icon: deliverboy,
  },
  {
    title: '60000+',
    description: 'Unique items sold',
    icon: medicine,
  },
  {
    title: '19000+',
    description: 'Pin codes serviced ',
    icon: location,
  },
];

const FeatureSection = () => {
  return (
    <div className="w-full mt-2 px-3 sm:px-4 lg:px-15">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-12 py-6">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center justify-center gap-2 bg-white rounded-lg shadow-none p-3 sm:p-4"
          >
            <div>
              <Image
                src={stat.icon}
                alt="item icon"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 sm:mb-3 object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                {stat.title}
              </div>
              <div className="mt-1 text-gray-600 text-xs sm:text-sm md:text-base leading-snug">
                {stat.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
