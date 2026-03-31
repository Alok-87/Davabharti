// import { useState } from "react";
// import { FaBookmark } from "react-icons/fa";
// import noimage from '@/assets/noimage.png'
// import { useRouter } from "next/navigation";
// import { addToCart } from "@/features/cart/cartThunks";
// import { useAppDispatch } from "@/store/hooks";

// export interface Product {
//   id: string;
//   name: string;
//   images: string;
//   price: number; // final sale price
//   mrp?: number; // original price
//   discount?: number; // percentage
//   description: string;
// }

// interface ProductCardProps {
//   product: Product;
//   onClick?: (product: Product) => void;
// }

// const MedicineCardTemp: React.FC<ProductCardProps> = ({ product }) => {
//   const [count, setCount] = useState(0);

//   // Price Calculation
//   const mrp = product?.mrp || product.price;
//   const discount = product?.discount || 0;
//   const salePrice = mrp - (mrp * discount) / 100;

//   const router = useRouter();
//   const handleClick = (id: string) => {
//     router.push(`/medicines/${id}`);
//   };

//   const dispatch = useAppDispatch();
//   const clickHanlder = (id: string) => {
//     dispatch(
//       addToCart({
//         medicineId: id,
//         quantity: 1,
//       })
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl p-3 relative transition w-full h-[330px] flex flex-col">
//       {/* Wishlist Icon */}
//       {/* <button className="absolute top-3 right-3 bg-white p-2 transition">
//         <FaBookmark className="text-gray-600 text-lg cursor-pointer" />
//       </button> */}

//       {/* Product Image */}
//       <div className="w-full h-32 sm:h-36 lg:h-40 bg-white rounded-lg flex items-center justify-center overflow-hidden cursor-pointer">
//         <img
//           src={product?.images || "/no-image.png"}
//           alt={product?.name || "Product Image"}
//           className="object-contain h-full w-auto"
//           onClick={() => handleClick(product.id)}
//         />
//       </div>

//       {/* Product Info */}
//       <div className="mt-2 flex flex-col flex-grow">
//         <h3 className="text-gray-800 text-sm font-medium line-clamp-2 leading-snug cursor-pointer" onClick={() => handleClick(product.id)}>
//           {product.name}
//         </h3>

//         <div className="mt-2 flex items-center gap-2">
//           <p className="text-sm font-semibold text-black">
//             ₹{salePrice.toFixed(2)}
//           </p>
//           {discount > 0 && (
//             <p className="text-xs text-gray-500 line-through">₹{mrp.toFixed(2)}</p>
//           )}
//         </div>

//         {discount > 1 && (
//           <p className="text-sm font-semibold text-pink-700 mt-1">
//             {discount}% OFF
//           </p>
//         )}

//         {/* Add / Quantity Buttons */}
//         <div className="mt-auto">
//           <button
//             onClick={() => clickHanlder(product.id)}
//             className="bg-primary text-white mt-3 w-full py-2 rounded-full text-base font-semibold cursor-pointer"
//           >
//             Add to cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicineCardTemp;


'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/features/cart/cartThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import noimage from '@/assets/noimage.png';
import { getToken } from "@/features/auth/utils/tokenManager";
import { useAuthModal } from "@/hooks/useAuthModal";
import ProfileAlertDialog from "../alert/ProfileAlert";

export interface Product {
  id: string;
  name: string;
  images: string;
  price: number; // final sale price
  mrp?: number; // original price
  discount?: number; // percentage
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const MedicineCardTemp: React.FC<ProductCardProps> = ({ product }) => {
  const [count, setCount] = useState(0);
  const { user } = useAppSelector((state) => state.userProfile);
     const [showProfileDialog, setShowProfileDialog] = useState(false);
  const mrp = product?.mrp || product.price;
  const discount = product?.discount || 0;
  const salePrice = mrp - (mrp * discount) / 100;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { openLogin } = useAuthModal();
  const handleClick = (slug: string) => {
    router.push(`/medicines/${slug}`);
  };

  const clickHandler = (id: string) => {
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

  const placeholderImage = "/no-image.png";

  return (
    <>{/* Alert */}
      <ProfileAlertDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
    <div className="bg-white rounded-xl p-3 relative transition w-full h-[330px] flex flex-col">
      {/* Product Image */}
      <div className="w-full h-32 sm:h-36 lg:h-40 bg-white rounded-lg flex items-center justify-center overflow-hidden cursor-pointer">
        <img
          src={product?.images || placeholderImage}
          alt={product?.name || "Product Image"}
          className="object-contain h-full w-auto"
          onClick={() => handleClick(product.slug)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== placeholderImage) {
              target.src = placeholderImage;
            }
          }}
        />
      </div>

      {/* Product Info */}
      <div className="mt-2 flex flex-col flex-grow">
        <h3
          className="text-gray-800 text-sm font-medium line-clamp-2 leading-snug cursor-pointer"
          onClick={() => handleClick(product.slug)}
        >
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm font-semibold text-black">₹{salePrice.toFixed(2)}</p>
          {discount > 0 && (
            <p className="text-xs text-gray-500 line-through">₹{mrp.toFixed(2)}</p>
          )}
        </div>

        {discount > 1 && (
          <p className="text-sm font-semibold text-pink-700 mt-1">{discount}% OFF</p>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <button
            onClick={() => clickHandler(product.id)}
            className="bg-primary text-white mt-3 w-full py-2 rounded-full text-base font-semibold cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MedicineCardTemp;
