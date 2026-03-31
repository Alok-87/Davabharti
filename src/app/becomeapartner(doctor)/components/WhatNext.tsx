import React from "react";
import { FaUserMd, FaFileUpload, FaShieldAlt } from "react-icons/fa";
import { TiContacts } from "react-icons/ti";

const steps = [
  {
    id: 1,
    title: "Contact Details",
    subtitle: "Degrees, Experience & Languages",
    icon: <TiContacts size={20} className="text-primary" />,
  },
  {
    id: 2,
    title: "Professional Info",
    subtitle: "Degrees, Experience & Languages",
    icon: <FaUserMd size={20} className="text-primary" />,
  },
  {
    id: 3,
    title: "Upload Documents",
    subtitle: "License & Certificates",
    icon: <FaFileUpload size={20} className="text-[#17c964]" />,
  },
  {
    id: 4,
    title: "KYC Verification",
    subtitle: "Complete Verification",
    icon: <FaShieldAlt size={20} className="text-primary" />,
  },
];

export default function WhatsNext() {
  return (
    <div className="w-full  rounded-3xl border border-[#eef2f7] bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <h3 className="mb-3 text-[18px] font-bold text-gray-900">
        What&apos;s Next?
      </h3>

      <div className="flex flex-col ">
        {steps.map((step, index) => (
          <div key={step.id} className="w-full">
            <div className="flex items-start gap-3.5">
              <div className="w-6 shrink-0 flex flex-col items-center">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center">
                  {step.icon}
                </div>

                {index !== steps.length - 1 && (
                  <div className="mt-2.5 h-[52px] w-[1.5px] bg-gray-200" />
                )}
              </div>

              <div className="flex-1 pb-5">
                <div className="text-[16px] font-bold text-gray-900">
                  {step.title}
                </div>
                <div className="mt-1 text-[14px] leading-6 text-gray-500">
                  {step.subtitle}
                </div>

                {index !== steps.length - 1 && (
                  <div className="mt-4 h-px w-full bg-gray-100" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}