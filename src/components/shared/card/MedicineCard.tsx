import { AiOutlineShoppingCart } from 'react-icons/ai';

interface MedicineCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    rating: number;
    reviewCount: number;
    imageSrc: string;
    imageAlt: string;
    href: string;
  };
}

const MedicineCard: React.FC<MedicineCardProps> = ({ product }) => {
  return (
    <div className="group relative border-r border-b border-gray-200 p-2 sm:p-4 md:p-6">
      {/* Image + Cart */}
      <div className="relative">
        <img
          alt={product.imageAlt}
          src={product.imageSrc}
          className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
        />
        <AiOutlineShoppingCart className="absolute top-2 sm:top-3 right-2 sm:right-3 text-2xl sm:text-4xl p-1.5 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100" />
      </div>

      {/* Content */}
      <div className="pt-2 sm:pt-4 pb-2 sm:pb-4 text-left">
        <h3 className="text-sm sm:text-md md:text-base font-medium text-black">
          <a href={product.href}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </a>
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          {/* Price */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
            {product.price}
          </p>

          {/* Rating */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-0.5 h-5 w-5 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
              {product.rating}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
