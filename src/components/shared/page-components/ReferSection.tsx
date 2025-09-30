import Image from "next/image";
import referImage from "@/assets/refer.png";

const ReferSection = () => {
    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-1 md:px-20 mt-6 sm:mt-3 md:mt-5">
            {/* Responsive flex direction: column on mobile, row on desktop */}
            <div className="bg-[#a4c2ee] flex flex-col-reverse md:flex-row items-center justify-between rounded-xl shadow-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-5 md:gap-6 text-center">
                {/* Text and button section */}
                <div className="flex flex-col  mt-3 md:mt-0 md:text-left">
                    <div className="text-2xl font-bold mb-4 ">
                        Invite your friends and family on the platform and earn the cashback in your wallet.
                    </div>
                    <button className="bg-blue-600 text-white py-3 px-7 rounded-lg font-semibold w-fit mx-auto md:mx-0 md:mt-2">
                        Refer Now
                    </button>
                </div>
                {/* Image section */}
                <div className="mb-6 md:mb-0">
                    <Image
                        src={referImage}
                        alt="Refer your friends"
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default ReferSection;
