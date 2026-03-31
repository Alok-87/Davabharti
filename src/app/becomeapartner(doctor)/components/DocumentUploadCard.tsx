"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, Trash2, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  uploadDocument,
  verifyAadhaar,
  verifyMedicalRegistration,
  verifyPanCard,
  verifyProfilePhoto,
  verifyQualification,
  verifySpecialization,
  verifySignature,
} from "@/features/onboarding(doctor)/onboarding(doctor)Thunks";

type ReusableDocumentUploadCardProps = {
  title: string;
  subtitle?: string;
  inputLabel: string;
  inputPlaceholder?: string;
  uploadLabel: string;
  documentType: string;
  buttonText?: string;
  statusText?: string;
  folder?: string;
  accept?: string;
  onSuccess?: () => void;
  apiKey?: string;
  hasInput?: boolean;
  optional?: boolean;
};

const DocumentUploadCard = ({
  title,
  inputLabel,
  inputPlaceholder = "Enter document number",
  uploadLabel,
  documentType,
  buttonText = "Verify Document",
  statusText = "Pending",
  folder = "doctor-profile",
  accept = "image/jpeg,image/jpg,image/png,application/pdf",
  onSuccess,
  apiKey,
  hasInput = true,
}: ReusableDocumentUploadCardProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const { doctorData } = useAppSelector((state) => state.doctoronboarding)

  const {
    loading,
    doctorId,
    aadhaarVerified,
    medicalRegistrationVerified,
    qualificationVerified,
    specializationVerified,
    panVerified,
    profilePhotoVerified,
    signatureVerified,
  } = useAppSelector((state) => state.doctoronboarding);



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerified) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const data = {
      folder,
      file,
    };

    const result = await dispatch(uploadDocument(data)).unwrap();
    setLocalFileUrl(result?.url ?? result?.file_url ?? result);
    e.target.value = "";
  };

  const handleClickUpload = () => {
    if (isVerified) return;
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (isVerified) return;
    setLocalFileUrl(null);
    setFileName("");
  };

  const handleSubmit = async () => {
    if (!doctorId) return;
    if (!localFileUrl) return;
    if (hasInput && !documentNumber.trim()) return;

    const payload = {
      doctor_id: doctorId,
      ...(hasInput && apiKey ? { [apiKey]: documentNumber.trim() } : {}),
      file_url: localFileUrl,
    };

    try {
      if (documentType === "AADHAAR") {
        await dispatch(verifyAadhaar(payload)).unwrap();
      } else if (documentType === "REGISTRATION_CERT") {
        await dispatch(verifyMedicalRegistration(payload)).unwrap();
      } else if (documentType === "QUALIFICATION") {
        await dispatch(verifyQualification(payload)).unwrap();
      } else if (documentType === "SPECIALIZATION") {
        await dispatch(verifySpecialization(payload)).unwrap();
      } else if (documentType === "PAN") {
        await dispatch(verifyPanCard(payload)).unwrap();
      } else if (documentType === "PROFILE_PHOTO") {
        await dispatch(verifyProfilePhoto(payload)).unwrap();
      } else if (documentType === "SIGNATURE") {
        await dispatch(verifySignature(payload)).unwrap();
      }

      onSuccess?.();
    } catch (error) {
      console.error("Document submit failed:", error);
    }
  };


  const existingDoc = doctorData?.documents?.find(
    (doc) => doc.documentType === documentType
  );



  const isVerified =
    (documentType === "AADHAAR" && aadhaarVerified) ||
    (documentType === "REGISTRATION_CERT" && medicalRegistrationVerified) ||
    (documentType === "QUALIFICATION" && qualificationVerified) ||
    (documentType === "SPECIALIZATION" && specializationVerified) ||
    (documentType === "PAN" && panVerified) ||
    (documentType === "PROFILE_PHOTO" && profilePhotoVerified) ||
    (documentType === "SIGNATURE" && signatureVerified) ||
    existingDoc?.verificationStatus === "VERIFIED";

  const isButtonDisabled =
    loading || isVerified || !localFileUrl || (hasInput && !documentNumber.trim());


  useEffect(() => {
    if (!doctorData) return;
    if (existingDoc) {
      setLocalFileUrl(existingDoc.fileUrl || "");
      setFileName(existingDoc.fileUrl?.split("/").pop() || "");

      if (hasInput) {
        setDocumentNumber(existingDoc.documentNumber || "");
      }
    }
  }, [existingDoc, doctorData]);

  return (
    <div className="w-full rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#16214a]">
              {title}
            </h2>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${isVerified
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-600"
            }`}
        >
          <span>{isVerified ? "Verified" : statusText}</span>
        </div>
      </div>

      <div className="space-y-6 px-5 py-5 md:px-6 md:py-6">
        {hasInput && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#16214a]">
              {inputLabel}
            </label>

            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder={inputPlaceholder}
              disabled={isVerified}
              className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-semibold text-[#16214a]">
              {uploadLabel}
            </label>

            {localFileUrl && !isVerified ? (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>

          <input
            type="file"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isVerified}
          />

          <div
            onClick={handleClickUpload}
            className={`flex min-h-[200px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-4 text-center transition ${isVerified
              ? "cursor-not-allowed border-green-300 bg-green-50"
              : "cursor-pointer border-slate-300 bg-slate-50/40 hover:border-primary hover:bg-slate-50"
              }`}
          >
            {localFileUrl ? (
              localFileUrl.toLowerCase().endsWith(".pdf") ? (
                <div className="flex flex-col items-center justify-center">
                  <ShieldCheck className="mb-2 h-8 w-8 text-primary" />
                  <p className="text-sm font-semibold text-primary">
                    PDF uploaded successfully
                  </p>
                  {fileName ? (
                    <p className="mt-1 text-xs text-slate-500">{fileName}</p>
                  ) : null}
                </div>
              ) : (
                <img
                  src={localFileUrl}
                  alt="uploaded document preview"
                  className="max-h-[180px] w-full rounded-2xl object-contain p-2"
                />
              )
            ) : (
              <>
                <Upload className="mb-3 h-7 w-7 text-slate-400" />
                <p className="text-base font-medium text-[#16214a]">
                  {isVerified ? "Already verified" : "Click to upload"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {fileName || "JPG, PNG or PDF"}
                </p>
              </>
            )}
          </div>
        </div>

        {!isVerified && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck className="h-4 w-4" />
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadCard;