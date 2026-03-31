"use client";
import { fetchCart } from "@/features/cart/cartThunks";
import { applyOffer } from "@/features/offers/offerSlice";
import { fetchCustomerOffers } from "@/features/offers/offerThunks";
import { setShowOfferModal } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FiGift } from "react-icons/fi";

export default function OfferStripTop() {

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchCustomerOffers());
    }, []);

    const { offers } = useAppSelector((state) => state.offers);
    const cart = useAppSelector((state) => state.cart.carts);

    const homeOffer = offers?.find(o => o.showOnHome === true);

    console.log(homeOffer);

    const minOrderValue = Number(homeOffer?.minimumOrderValue || 0);
    const cartTotal = Number(cart?.[0]?.sub_total || 0);

    const remainingAmount = Math.max(minOrderValue - cartTotal, 0);

    const clickHandler = () => {
        if (cartTotal < minOrderValue) {
            dispatch(setShowOfferModal(true));
        } else {
            dispatch(applyOffer(homeOffer?.code));
        }
    };

    if (!homeOffer) return null;

    return (
        <div className="fixed left-0 w-full z-40">

            {/* Full-width bottom line */}
            <div className="w-full h-[3px] bg-primary"></div>

            {/* Centered Floating Card */}
            <div className="
        w-full flex justify-center 
        absolute top-0
        px-3
      ">
                <div className="
          bg-primary text-white
          rounded-b-lg shadow-lg
          flex items-center gap-3
          px-5 py-2
          max-w-2xl w-full
        ">
                    {/* ICON */}
                    <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
                        <FiGift size={18} />
                    </div>

                    {/* TEXT */}
                    <p className="flex-1 text-sm md:text-base font-medium whitespace-nowrap overflow-hidden">
                        {offers[0].discountType}{offers[0].discountValue} + {offers[0].description} | Limited Time Offer
                    </p>

                    {/* BUTTON */}
                    <button onClick={clickHandler} className="
            bg-white text-primary 
            px-4 py-1.5 rounded-lg
            font-semibold 
            text-sm
            hover:bg-gray-100 cursor-pointer
          ">
                        Apply
                    </button>
                </div>
            </div>

        </div>
    );
}
