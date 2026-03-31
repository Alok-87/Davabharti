'use client'
import { useState } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";

export default function OtpInputPreview({ verifyOtp ,onChangeClick }) {
  const [OTP, setOTP] = useState("");

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className=" overflow-x-auto">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            OTPLength={6}
            otpType="number"
            disabled={false}
            className="flex  min-w-max"
            inputClassName="!w-10 !h-10 sm:!w-11 sm:!h-11 border border-slate-300 rounded-md text-center font-semibold outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={() => verifyOtp(OTP)}
          className="h-[48px] sm:h-[52px] px-5 sm:px-6 rounded-xl bg-primary text-white text-sm font-medium cursor-pointer whitespace-nowrap flex items-center justify-center w-full sm:w-auto"
        >
          Verify
        </button>
        <button
          type="button"
          onClick={onChangeClick }
          className="h-[48px] sm:h-[52px] px-5 sm:px-6 rounded-xl border-2 text-black text-sm font-medium cursor-pointer whitespace-nowrap flex items-center justify-center w-full sm:w-auto "
        >
          Change 
        </button>
      </div>
    </div>
  );
}