'use client'
import { GraduationCap } from "lucide-react";
import BasicInformationForm from "./components/BasicInformationForm";
import WhatsNext from "./components/WhatNext";
import NeedHelpCard from "./components/NeedHelpCard";
import Stepper from "../becomeapartner/components/Stepper";
import { useEffect, useState } from "react";
import BankInformationForm from "./components/BankInformationForm";
import DocumentsUploadForm from "./components/DocumentsUploadForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAadhaarVerified, setCurrentStep, setEmailVerified, setMedicalRegistrationVerified, setMobileVerified, setPanVerified, setQualificationVerified, setSpecializationVerified, setProfilePhotoVerified, setSignatureVerified, setDoctorData } from "@/features/onboarding(doctor)/onboarding(doctor)Slice";
import UnderReviewPage from "./components/UnderReviewPage";

const Page = () => {

  const { currentStep } = useAppSelector((state) => state.doctoronboarding)
  // const [currentStep,setCurrentStep ] = useState(1);

  const dispatch = useAppDispatch();
  const STEPS = [
    "Basic Details",
    "Documents ",
    "Bank Details",
    "Verification",
  ];

  // useEffect(() => {
  //   dispatch(setCurrentStep(1));
  //   dispatch(setAadhaarVerified(false));
  //   dispatch(setQualificationVerified(false));
  //   dispatch(setSpecializationVerified(false));
  //   dispatch(setMedicalRegistrationVerified(false));
  // dispatch(setPanVerified(false));
  // },[])

  useEffect(() => {
    dispatch(setCurrentStep(1));
    dispatch(setMobileVerified(false));
    dispatch(setEmailVerified(false));
    dispatch(setAadhaarVerified(false));
    dispatch(setQualificationVerified(false));
    dispatch(setSpecializationVerified(false));
    dispatch(setMedicalRegistrationVerified(false));
    dispatch(setPanVerified(false));
    dispatch(setProfilePhotoVerified(false));
    dispatch(setSignatureVerified(false));
    dispatch(setDoctorData(null));
  }, [])



  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationForm />;

      case 2:
        return <DocumentsUploadForm />;


      case 3:
        return <BankInformationForm />;

      case 4:
        return <UnderReviewPage />;

      default:
        return null;
    }
  };
  return (
    <div className="bg-gray-50 w-full py-5 flex flex-col items-center gap-8 px-4">

      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#16214a]">
          Become a Partner
        </h2>

        <p className="mt-2 text-sm md:text-base text-slate-500">
          Join hands with us to grow together. Partner with our platform and reach more customers while delivering trusted healthcare solutions.
        </p>
      </div>

      {/* Stepper */}
      <div className="w-full  ">
        <Stepper currentStep={currentStep} steps={STEPS} />
      </div>

      {/* Main Section */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-center gap-6">

        {/* Form */}
        <div className="w-full lg:w-[65%]">
          {renderStepForm()}
        </div>

        {/* Right Side Cards */}
        <div className="w-full lg:w-[35%] flex flex-col gap-3">
          <WhatsNext />
          <NeedHelpCard />
        </div>

      </div>

    </div>
  );
};

export default Page;