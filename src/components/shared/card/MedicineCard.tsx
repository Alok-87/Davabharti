

'use client';

import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/features/cart/cartThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getToken } from '@/features/auth/utils/tokenManager';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useState } from 'react';
import ProfileAlertDialog from '../alert/ProfileAlert';

interface MedicineCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: string; // Sale price
    mrp?: string; // Original price (optional)
    discount?: string; // Discount string like "10% OFF" (optional)
    rating: number;
    reviewCount: number;
    imageSrc?: string;
    imageAlt: string;
    href: string;
    in_stock: string;
  };
}

const MedicineCard: React.FC<MedicineCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { openLogin } = useAuthModal();
  const { user } = useAppSelector((state) => state.userProfile);
  const [showProfileDialog, setShowProfileDialog] = useState(false);


  // Use placeholder if no image
  const placeholderImage = "/no-image.png";
  const imageUrl = product.imageSrc && product.imageSrc.trim() !== '' ? product.imageSrc : placeholderImage;

  // Navigate to medicine details page
  const handleClick = (slug: string) => {
    router.push(`/medicines/${slug}`);
  };

  // Handle add to cart with auth check
  const handleCartClick = (id: string) => {
    const token = getToken();
    if (!token) {
      openLogin(window.location.pathname); // open login modal if not logged in
      return;
    }
    // ✅ Profile completeness check
    if (!user?.is_profile_complete) {
      setShowProfileDialog(true);
      return;
    }
    dispatch(
      addToCart({
        medicineId: id,
        quantity: 1,
      })
    );
  };

  const formatPrice = (value?: string) => {
    if (!value) return "0.00";

    // remove currency symbols, spaces etc.
    const num = Number(value.replace(/[^\d.]/g, ""));

    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };


  return (
    <>{/* Alert */}
      <ProfileAlertDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
      <div className="group relative border-r border-b border-gray-200 p-2 sm:p-4 md:p-6 cursor-pointer">
        {/* Image + Cart */}
        <div className="relative">
          <img
            alt={product.imageAlt}
            src={imageUrl}
            className="aspect-square rounded-lg bg-gray-100 object-cover w-full h-auto group-hover:opacity-80 transition-opacity duration-200"
            onClick={() => handleClick(product.slug)}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== placeholderImage) {
                target.src = placeholderImage;
              }
            }}
          />

          {product.in_stock ? (
            <AiOutlineShoppingCart
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xl sm:text-2xl md:text-3xl p-1.5 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering handleClick
                handleCartClick(product.id);
              }}
            />
          ) : (
            <AiOutlineShoppingCart
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xl sm:text-2xl md:text-3xl p-1.5 bg-red-300 rounded-full shadow cursor-not-allowed"
            />
          )}
        </div>

        {/* Content */}
        <div className="pt-2 sm:pt-4 pb-2 sm:pb-4 text-left" onClick={() => handleClick(product.slug)}>
          <h3 className="text-sm sm:text-md md:text-base font-medium text-gray-700 line-clamp-2 tracking-wide">
            {product.name}
          </h3>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-2 sm:mt-3 flex justify-between">
            {product.discount ? (
              <div className="flex flex-col">
                <span className="text-red-400 font-semibold text-xs sm:text-sm">
                  MRP <span className="line-through">₹{formatPrice(product.mrp)}</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-700 font-bold text-sm sm:text-base">₹{formatPrice(product.price)}</span>
                  <span className="text-primary font-semibold text-xs sm:text-sm">
                    ({product.discount})
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-gray-700 font-bold text-sm sm:text-base">₹{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineCard;
