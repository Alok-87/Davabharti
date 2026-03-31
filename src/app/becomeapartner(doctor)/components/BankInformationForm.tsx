"use client";

import React, { useEffect } from "react";
import { FaUser, FaUniversity } from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { BsCreditCard2Front } from "react-icons/bs";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stepBankDetail } from "@/features/onboarding(doctor)/onboarding(doctor)Thunks";
import { setCurrentStep } from "@/features/onboarding(doctor)/onboarding(doctor)Slice";

const BankInformationForm = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const { doctorId, loading, doctorData ,currentStep} = useAppSelector((state) => state.doctoronboarding);
  const onSubmit = (data: any) => {
    const payload = {
      doctor_id: doctorId,
      bank_account: {
        account_holder_name: data.accountHolderName.trim(),
        bank_name: data.bankName.trim(),
        account_number: data.accountNumber.trim(),
        ifsc_code: data.ifscCode.trim().toUpperCase(),
      },
    };

    dispatch(stepBankDetail(payload)).unwrap();
    reset();
  }

  useEffect(() => {
    if (!doctorData) return;
    if (doctorData?.bank_accounts?.length > 0) {
      const bank = doctorData.bank_accounts[0]; // assuming primary account

      reset({
        accountHolderName: bank.accountHolderName || "",
        bankName: bank.bankName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
      });
    }
  }, [doctorData, reset]);

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#16214a]">
          Bank Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add your bank details to receive consultation payments
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Account Holder Name */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FaUser className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-[#16214a]">
              Account Holder Name
            </h3>
          </div>

          <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
            <FaUser className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter account holder name"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              {...register("accountHolderName", { required: "Name is required" })}
            />
          </div>

          {errors.accountHolderName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountHolderName.message as string}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FaUniversity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-[#16214a]">
              Bank Name
            </h3>
          </div>

          <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
            <FaUniversity className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter bank name"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              {...register("bankName", { required: "Bank name is required" })}
            />
          </div>

          {errors.bankName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.bankName.message as string}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BsCreditCard2Front className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-[#16214a]">
              Account Number
            </h3>
          </div>

          <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
            <BsCreditCard2Front className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="number"
              placeholder="Enter account number"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              {...register("accountNumber", { required: "Account number required" })}
            />
          </div>

          {errors.accountNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountNumber.message as string}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MdNumbers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-[#16214a]">
              IFSC Code
            </h3>
          </div>

          <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
            <MdNumbers className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. SBIN0001234"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              {...register("ifscCode", { required: "IFSC required" })}
            />
          </div>

          {errors.ifscCode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ifscCode.message as string}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-4">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => dispatch(setCurrentStep(currentStep - 1))}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Back
          </button>

          {/* Save Button */}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white cursor-pointer"
          >
            Save Bank Details
          </button>

        </div>

      </form>
    </div>
  );
};

export default BankInformationForm;