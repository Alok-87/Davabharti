"use client";

import React, { useEffect } from "react";
import DocumentUploadCard from "./DocumentUploadCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stepDocumentDeatil } from "@/features/onboarding(doctor)/onboarding(doctor)Thunks";
import { setAadhaarVerified, setCurrentStep, setMedicalRegistrationVerified, setPanVerified, setProfilePhotoVerified, setQualificationVerified, setSignatureVerified, setSpecializationVerified } from "@/features/onboarding(doctor)/onboarding(doctor)Slice";

const documentConfigs = [
  {
    title: "Verify Aadhaar",
    inputLabel: "Aadhaar Number",
    inputPlaceholder: "XXXX XXXX XXXX",
    uploadLabel: "Upload Aadhaar",
    documentType: "AADHAAR",
    apiKey: "aadhaar_number",
    hasInput: true,
  },
  {
    title: "Verify Medical Registration",
    inputLabel: "Medical Registration Number",
    inputPlaceholder: "Enter medical registration number",
    uploadLabel: "Upload Medical Registration Certificate",
    documentType: "REGISTRATION_CERT",
    apiKey: "registration_number",
    hasInput: true,
  },
  {
    title: "Verify Qualification (MBBS/Degree)",
    inputLabel: "Qualification",
    inputPlaceholder: "Enter qualification",
    uploadLabel: "Upload Qualification Certificate",
    documentType: "QUALIFICATION",
    apiKey: "degree_name",
    hasInput: true,
  },
  {
    title: "Verify Specialization Proof (Optional)",
    inputLabel: "Specialization",
    inputPlaceholder: "Enter specialization",
    uploadLabel: "Upload Specialization Proof",
    documentType: "SPECIALIZATION",
    apiKey: "specialization_name",
    hasInput: true,
    optional: true,
  },
  {
    title: "Verify PAN Card",
    inputLabel: "PAN Number",
    inputPlaceholder: "ABCDE1234F",
    uploadLabel: "Upload PAN Card",
    documentType: "PAN",
    apiKey: "pan_number",
    hasInput: true,
  },
  {
    title: "Verify Profile Photo",
    inputLabel: "",
    inputPlaceholder: "",
    uploadLabel: "Upload Profile Photo",
    documentType: "PROFILE_PHOTO",
    apiKey: "",
    hasInput: false,
  },
  {
    title: "Verify Signature",
    inputLabel: "",
    inputPlaceholder: "",
    uploadLabel: "Upload Signature",
    documentType: "SIGNATURE",
    apiKey: "",
    hasInput: false,
  },
];
 
const DocumentsUploadSection = () => {
  const { doctorId, doctorData, currentStep } = useAppSelector((state) => state.doctoronboarding);

  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    const payload = {
      doctor_id: doctorId,
    };
    dispatch(stepDocumentDeatil(payload));
  };


  const updateVerificationStatus = (documents, dispatch) => {
    // Reset all first

    documents.forEach((doc) => {
      const isVerified = doc.verificationStatus === "VERIFIED";

      switch (doc.documentType) {
        case "AADHAAR":
          dispatch(setAadhaarVerified(isVerified));
          break;

        case "PAN":
          dispatch(setPanVerified(isVerified));
          break;

        case "REGISTRATION_CERT":
          dispatch(setMedicalRegistrationVerified(isVerified));
          break;

        case "QUALIFICATION":
          dispatch(setQualificationVerified(isVerified));
          break;

        case "SPECIALIZATION":
          dispatch(setSpecializationVerified(isVerified));
          break;

        case "PROFILE_PHOTO":
          dispatch(setProfilePhotoVerified(isVerified));
          break;

        case "SIGNATURE":
          dispatch(setSignatureVerified(isVerified));
          break;

        default:
          break;
      }
    });
  };

  useEffect(() => {
    if (doctorData?.documents) {
      updateVerificationStatus(doctorData.documents, dispatch);
    }
  }, [doctorData]);

  return (
    <div className="w-full space-y-6 bg-white p-4 rounded-xl  sm:p-5 ">
      
      <div className="grid grid-cols-1 gap-5  md:grid-cols-2 xl:grid-cols-2">
        {documentConfigs.map((item) => (
          <DocumentUploadCard
            key={item.documentType}
            title={item.title}
            inputLabel={item.inputLabel}
            inputPlaceholder={item.inputPlaceholder}
            uploadLabel={item.uploadLabel}
            documentType={item.documentType}
            buttonText="Verify Document"
            statusText="Pending"
            folder="doctor-documents"
            apiKey={item.apiKey}
            hasInput={item.hasInput}
            optional={item.optional}
          />
        ))}
      </div>

      <div className="flex justify-stretch sm:justify-end gap-3">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(currentStep - 1))}
          className="w-full sm:w-auto rounded-xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          Back
        </button>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
        >
          Continue
        </button>

      </div>
    </div>

  );
};



export default DocumentsUploadSection;