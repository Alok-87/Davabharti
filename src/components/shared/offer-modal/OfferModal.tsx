"use client";
import { FiX, FiPercent } from "react-icons/fi";
import { setShowOfferModal } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchCart } from "@/features/cart/cartThunks";
import { fetchCustomerOffers } from "@/features/offers/offerThunks";

const OfferModal = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchCustomerOffers()); // ✅ FIXED
    }, [dispatch]);

    const showOfferModal = useAppSelector(
        (state) => state.userProfile.showOfferModal
    );

    const { offers } = useAppSelector((state) => state.offers);
    const cart = useAppSelector((state) => state.cart.carts);
    const minOrderValue = Number(offers?.[0]?.minimumOrderValue || 0);
    const cartTotal = Number(cart?.[0]?.sub_total || 0);

    const remainingAmount = Math.max(minOrderValue - cartTotal, 0);


    if (!showOfferModal) return null; // ✅ Correct

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative bg-white w-[90%] max-w-md rounded-lg shadow-xl p-6">

                <button
                    onClick={() => dispatch(setShowOfferModal(false))}
                    className="absolute right-4 top-4 text-gray-500 hover:text-black cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="bg-green-600 text-white p-2 rounded-full">
                        <FiPercent size={18} />
                    </div>
                    <h2 className="text-green-600 font-semibold text-lg tracking-wide">
                        {offers?.[0]?.code || "OFFER"}
                    </h2>
                </div>

                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 text-center">
                    Add items worth <span className="font-bold">₹{remainingAmount}</span> to avail this offer
                </div>

                <button onClick={() => dispatch(setShowOfferModal(false))} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer">
                    Add items
                </button>
            </div>
        </div>
    );
};

export default OfferModal;
