import { Product } from '@/features/homepage/mapper';
import ProductCarouselHydratorTemp from './ProductCarouselHydratortTemp';
import Image from 'next/image';
import logo from '@/assets/clock.png'

export default function SectionTemp({
  title,
  subtitle = 'Up to 33% off',
  iconUrl = '/icons/award.png',
  products = [],
  seeAllFilter,
}: {
  title: string;
  subtitle?: string;
  iconUrl?: string;
  products?: Product[];
  seeAllFilter?: string | null;
}) {
  const fallbackProducts = [
    {
      id: 'placeholder-1',
      name: 'Product',
      price: 0,
      description: 'Description',
      images: '/placeholder.png',
    },
  ];

  const gridProducts = products.length ? products : fallbackProducts;

  return (
    <section className="py-4 px-2 sm:px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center bg-[#b7dcfc] rounded-2xl p-4 md:p-6">
        
        {/* LEFT CATEGORY LABEL */}
        <div className="w-full md:w-1/6 flex flex-col items-center text-center gap-2">
          <Image
            src={logo}
            alt="Category Icon"
            className="w-40 object-contain"
          />
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* RIGHT PRODUCT CAROUSEL */}
        <div className="w-full md:w-5/6 mt-4 md:mt-0">
          <ProductCarouselHydratorTemp products={gridProducts} />
        </div>
      </div>
    </section>
  );
}
