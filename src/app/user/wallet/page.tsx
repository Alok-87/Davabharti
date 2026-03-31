"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import walletimg from '@/assets/wallet.png';
import { FaWallet } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getToken } from "@/features/auth/utils/tokenManager";
import { fetchCustomerWallet, fetchUserProfile } from "@/features/user-profile/userProfileThunks";
import InfoPopup from "./components/InfoPopup";

const walletInfo = {
  cashBalance: {
    title: "Cash Balance",
    description:
      "Cash Balance is real money available in your wallet. You can use this balance to pay for medicine orders and other services on the app. This amount comes from refunds, successful referrals, or wallet credits. Cash Balance cannot be transferred to another user.",
  },
  coins: {
    title: "D Bharti Coins",
    description:
      "D Bharti Coins are reward points earned through cashback, referral bonuses, and special offers. These coins can be used only to order medicines on the app. Coins cannot be withdrawn as cash or transferred to a bank account.",
  },
};

export default function WalletPage() {



    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = getToken();
        if (token) {
            dispatch(fetchUserProfile());
            dispatch(fetchCustomerWallet());
        }
    }, [dispatch]);

    const { user, wallet } = useAppSelector((state) => state.userProfile);
    const [copied, setCopied] = useState(false);

    const code = user?.referral_code;

    const handleCopy = async () => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("COPY ERROR:", err);
        }
    };

    return (
        <div className=" bg-gray-50 p-4">

            {/* TOP BAR */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 text-primary rounded-full">
                    <FaWallet />
                </div>

                <h1 className="text-2xl font-semibold">My Wallet</h1>
            </div>

            {/* MAIN WALLET CARD */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow mb-6 relative ">

                {/* WALLET IMAGE (SAME SIZE AS BEFORE) */}
                <Image
                    src={walletimg}
                    alt="Wallet"
                    placeholder="empty"
                    className="
      absolute 
      right-2 sm:right-1 
      top-2 sm:top-0
      w-16 sm:w-24 md:w-2xs
      opacity-90
    "
                />

                <div className="flex items-center gap-2 ">
                    {/* TEXT CONTENT */}
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                        Cash Balance
                    </h2>
                    <InfoPopup
                        title={walletInfo.cashBalance.title}
                        description={walletInfo.cashBalance.description}
                    />
                </div>



                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2 sm:mt-3 md:mt-4">
                    ₹{wallet?.cashBalance}
                </p>

                <Link
                    href="/user/wallet/CashTransaction"
                    className="text-sm sm:text-base mt-4 sm:mt-5 flex items-center gap-2 text-primary"
                >
                    View Transactions
                    <span className="p-1 bg-blue-100 text-primary rounded-full">
                        <IoIosArrowForward />
                    </span>
                </Link>
            </div>



            {/* TWO SMALL CARDS — GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* DVB COIN CARD */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex item-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* TEXT CONTENT */}
                            <h3 className="text-lg font-semibold text-gray-700">D Bharti Coins</h3>
                            <InfoPopup
                                title={walletInfo.coins.title}
                                description={walletInfo.coins.description}
                            />
                        </div>
                        <div className="p-3 bg-blue-100 text-primary rounded-full">
                            <GiTwoCoins />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-primary mt-3">{wallet?.coinBalance} Coins</p>
                    <Link href="/user/wallet/CoinTransaction" className="text-gray-600 mt-5 flex items-center gap-2 text-primary">view Transactions <span className="p-0.5 bg-blue-100 text-primary rounded-full"><IoIosArrowForward /></span></Link>
                </div>

                {/* REFERRAL SECTION */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Refer & Earn</h3>
                    <p className="mt-2 text-gray-600">
                        Share your code and earn wallet cash for every successful referral.
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <span className="font-semibold text-gray-800">Your Code:</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-lg font-bold">
                            {user?.referral_code}
                        </span>
                    </div>

                    {copied ? (
                        <>
                            <button onClick={handleCopy} className="w-full mt-4 bg-primary text-white py-2 rounded-lg transition cursor-pointer">
                                Copied
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleCopy} className="w-full mt-4 bg-primary text-white py-2 rounded-lg transition cursor-pointer">
                                Copy Referral Code
                            </button>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
}
