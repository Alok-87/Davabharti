'use client'
import { setAadhaarVerified, setCurrentStep, setEmailVerified, setMedicalRegistrationVerified, setMobileVerified, setPanVerified, setProfilePhotoVerified, setQualificationVerified, setSignatureVerified, setSpecializationVerified } from "@/features/onboarding(doctor)/onboarding(doctor)Slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaRegClock, FaCheckCircle } from "react-icons/fa";

const UnderReviewPage = () => {

    const {currentStep} = useAppSelector((state) => state.doctoronboarding)
    const dispatch = useAppDispatch()
    const handleReset = () => {
        dispatch(setCurrentStep(1));
        dispatch(setAadhaarVerified(false));
        dispatch(setQualificationVerified(false));
        dispatch(setSpecializationVerified(false));
        dispatch(setMedicalRegistrationVerified(false));
        dispatch(setPanVerified(false));
        dispatch(setMobileVerified(false));
        dispatch(setEmailVerified(false));
        dispatch(setProfilePhotoVerified(false));
        dispatch(setSignatureVerified(false));
    }

    return (

        <div className="w-full bg-white rounded-3xl border border-[#eef2f7]  p-8 text-center shadow-sm">

            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                    <FaRegClock className="text-yellow-500 text-3xl" />
                </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Application Under Review
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-6">
                Your application has been successfully submitted and is currently under review.
                Our team will verify your details and get back to you shortly.
            </p>

            {/* Status Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-medium">
                    <FaCheckCircle />
                    Submitted Successfully
                </div>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-400">
                This process usually takes 24–48 hours.
            </p>
            <div className="flex gap-2">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => dispatch(setCurrentStep(currentStep - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition"
                >
                    Back
                </button>

                {/* Reset Button */}
                <div
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition"
                >
                    Reset
                </div>

            </div>

        </div>

    );
};

export default UnderReviewPage;