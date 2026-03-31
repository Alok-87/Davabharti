"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ShareModal from './components/ShareModal';
import ReferSection from "./components/ReferSection";
import MyReferrals from "./components/MyReferrals";
import { useAppSelector } from "@/store/hooks";



export default function ReferralPage() {

  const [faqOpen, setFaqOpen] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("refer");
  const { user } = useAppSelector((state) => state.userProfile);
  const code = user?.referral_code;
  const BaseUrl = process.env.NEXT_PUBLIC_WEB_BASE_URL || 'https://www.davabharti.com';


  const faqs = [
    {
      q: "How can I refer and earn?",
      a: "You can refer your friends using your unique referral link. When your friend signs up and places a successful order, you earn referral rewards."
    },
    {
      q: "How much is the referral amount?",
      a: "The referral reward amount depends on the current referral offer running on the platform. It will be credited once the order is completed."
    },
    {
      q: "How do I use the referral amount?",
      a: "Referral rewards can be used during checkout as a discount on eligible orders."
    },
    {
      q: "When does referral amount expire?",
      a: "Referral rewards are valid for a limited period. Please use them before the expiry date shown in your referral section."
    },
    {
      q: "How do I check my referral balance?",
      a: "You can check your referral balance in the ‘My Referrals’ section under your account."
    },
    {
      q: "Where can I find my referral code?",
      a: "Your referral code is available in the Refer Now section. You can copy or share it directly."
    },
    {
      q: "What is the minimum order to earn referral?",
      a: "Your referred friend must place a minimum qualifying order for the referral reward to be credited."
    },
    {
      q: "How can I remind my referred friend?",
      a: "You can share your referral link again through WhatsApp, SMS, or any social platform."
    },
    {
      q: "How can I check referral status?",
      a: "Referral status such as Pending, Completed, or Rejected is shown in the My Referrals tab."
    }
  ];


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 ">
      <div className="flex items-center gap-10 mb-5 border-b pb-2 relative">

        {/* REFER NOW TAB */}
        <button
          onClick={() => setActiveTab("refer")}
          className={`
      pb-2 text-lg font-medium relative transition-all duration-300 
      ${activeTab === "refer" ? "text-blue-700" : "text-gray-600 cursor-pointer"}
    `}
        >
          Refer Now
          {activeTab === "refer" && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full transition-all duration-300"></span>
          )}
        </button>

        {/* MY REFERRALS TAB */}
        <button
          onClick={() => setActiveTab("myref")}
          className={`
      pb-2 text-lg font-medium relative transition-all duration-300
      ${activeTab === "myref" ? "text-blue-700" : "text-gray-600 cursor-pointer"}
    `}
        >
          My Referrals
          {activeTab === "myref" && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full transition-all duration-300"></span>
          )}
        </button>
      </div>
      {
        activeTab === "refer" ? (
          <ReferSection setOpenModal={setOpenModal} />
        ) : (
          <MyReferrals setOpenModal={setOpenModal} />
        )
      }



      {/* ===================== CLAIM REWARD ===================== */}
      {/* <div className="bg-white rounded-xl border shadow-sm p-6 mt-8">
        <h3 className="text-lg font-semibold mb-3">Have a referral code?</h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter Referral Code"
            className="border rounded-lg px-4 py-2 flex-1 outline-none"
          />

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Claim Reward
          </button>
        </div>
      </div> */}

      {/* ====================== FAQ SECTION ====================== */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Frequently asked questions</h3>

        <div className="space-y-3">
          {faqs.map((q, i) => (
            <div key={i} className="border rounded-xl p-3 bg-white shadow-sm">
              <button
                className="flex justify-between w-full text-left cursor-pointer"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <span className="font-medium text-gray-900">{q.q}</span>
                {faqOpen === i ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {faqOpen === i && (
                <p className="text-sm text-gray-600 mt-3">
                  {q.a}
                </p>

              )}
            </div>
          ))}
        </div>
      </div>
      <ShareModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        shareUrl={code ? `${BaseUrl}/referral?ref=${code}` : ""}
      />
    </div>
  );
}
