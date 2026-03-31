'use client';

import { IoClose } from "react-icons/io5";
import ReturnForm from "@/app/user/orders/components/ReturnForm";
import { setShowReturnDrawer } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
interface ReturnDrawerProps {
  orderId: string;
 
}
export default function ReturnDrawer({ orderId }: ReturnDrawerProps) {
    const showReturnDrawer = useAppSelector((state) => state.userProfile.showReturnDrawer);
    const dispatch = useAppDispatch();

    if (!showReturnDrawer) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay with fade-in */}
            <div
                className="flex-1 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={() => dispatch(setShowReturnDrawer(false))}
            ></div>

            {/* Drawer with smooth slide-in */}
            <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">Initiate Return</h3>
                    <button
                        onClick={() => dispatch(setShowReturnDrawer(false))}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <IoClose className="text-2xl text-gray-600 cursor-pointer" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1">
                    <ReturnForm orderId={orderId}  />
                </div>
            </div>
        </div>
    );
}
