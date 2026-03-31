"use client"
import React, { useState } from 'react'
import refer from "@/assets/refer_2.png";
import refer_1 from "@/assets/refer_4.png";
import refer_2 from "@/assets/refer_5.png";
import refer_3 from "@/assets/wallet.png";
import Image from "next/image";
import { useAppSelector } from '@/store/hooks';
import { FiCopy } from 'react-icons/fi';

const ReferSection = ({ setOpenModal }: any) => {

    const { user } = useAppSelector((state) => state.userProfile);
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
        <div>
            <div className="relative bg-primary rounded-xl p-6 md:p-10 pb-28 md:pb-20 ">

                {/* LEFT TEXT */}
                <h2 className="text-white text-xl md:text-3xl font-semibold leading-snug">
                    Tell your friend about DavaBharti &
                </h2>

                <h2 className="text-white text-3xl md:text-4xl font-bold mt-1">
                    Earn Coins
                </h2>

                {/* FLOATING REFERRAL CARD */}
                <div className="
          absolute 
          left-6 md:left-10 
          top-40 md:top-32 
          w-[85%] md:w-[330px] 
          bg-white rounded-xl p-5 
          shadow-xl
        ">
                    <label className="text-gray-600 text-sm">Your Referral Code</label>

                    <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                        <span className="font-semibold tracking-widest flex-1">
                            {code}
                        </span>

                        {
                            copied ? "copied" : <button
                                onClick={handleCopy}
                                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            >
                                <FiCopy size={18} />
                            </button>
                        }

                    </div>

                    <button onClick={() => setOpenModal(true)} className="mt-4 w-full bg-blue-700 cursor-pointer text-white py-2 rounded-lg font-medium">
                        Refer a Friend
                    </button>
                </div>

                {/* RIGHT ILLUSTRATION */}
                <div className="absolute right-2 md:right-6 bottom-2 md:bottom-3">
                    <Image
                        src={refer}
                        alt="Referral"
                        className="w-40 md:w-60 drop-shadow-lg hidden lg:block md:block"
                    />
                </div>
            </div>

            <div className="h-32 "></div>

            {/* ===================== HOW REFERRAL WORKS ===================== */}
            <div className="bg-[#F2F8FF] rounded-xl p-6 md:p-8 border shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
                    How referral works
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                    <div>
                        <Image src={refer_1} alt="icon1" className="w-30 mx-auto mb-3" />
                        <p className="text-gray-700 px-4 md:px-0">
                            Invite your friends to join using your referral code
                        </p>
                    </div>

                    <div>
                        <Image src={refer_2} alt="icon2" className="w-35 mx-auto mb-3" />
                        <p className="text-gray-700 px-4 md:px-0">
                            They receive ₹200 on successful registration
                        </p>
                    </div>

                    <div>
                        <Image src={refer_3} alt="icon3" className="w-40 mx-auto mb-3" />
                        <p className="text-gray-700 px-4 md:px-0">
                            You earn ₹200 after their first order is delivered
                        </p>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default ReferSection