

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export interface Product {
  id: string;
  slug: string;
  name: string;
  images: string;
  price: number;
  discount?: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const router = useRouter();


  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : null;

  const handleClick = (slug: string) => {
    router.push(`/medicines/${slug}`);
  };

  const placeholderImage =
    '/no-image.png';

  return (
    <article
      className="px-4 py-1 md:py-2 bg-white rounded-lg hover:border-r hover:border-l border-gray-100 transition cursor-pointer flex flex-col mt-1 md:mt-2"
      onClick={() => handleClick(product.slug)}
      aria-label={`Product card for ${product.name}`}
    >
      {/* Product Image */}
      <div className="p-4 rounded-xl border border-gray-200 flex justify-center items-center">
        <div className="relative w-[90px] h-[100px] md:w-[160px] md:h-[170px] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
          <img
            src={product?.images || placeholderImage}
            alt={product?.name || 'Product Image'}
            loading="lazy"
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              // Prevent infinite loop if placeholder fails too
              if (target.src !== placeholderImage) {
                target.src = placeholderImage;
              }
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="ml-0.8 mt-2 md:mt-4">
        <h2 className="mt-1.5 md:mt-2 font-semibold text-gray-600 text-start text-[12px] md:text-[16px] line-clamp-2 tracking-[0.03em]">
          {product.name}
        </h2>

        <div className="flex flex-col items-start mt-1.5 md:mt-2 tracking-[0.03em]">
          {discountedPrice ? (
            <>
              <h3 className="text-red-400 font-semibold text-start text-[12px] md:text-[16px]">
                MRP <span className="line-through">₹{product.price.toFixed(2)}</span>
              </h3>
              <div className="mt-1.4 md:mt-2">
                <span className="text-gray-600 font-bold text-[12px] md:text-[14px]">
                  ₹{discountedPrice}
                </span>
                <span className="text-primary font-bold text-[10px] md:text-[12px] ml-[8px]">
                  ({product.discount}%)
                </span>
              </div>
            </>
          ) : (
            <span className="text-gray-600 font-bold text-[12px] md:text-[14px]">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        <p className="text-[12px] md:text-[14px] text-gray-500 mt-1 truncate">
          {product.description}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
