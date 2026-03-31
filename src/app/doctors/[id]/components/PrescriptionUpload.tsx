"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Trash2, FileText } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { uploadDocument } from "@/features/onboarding(doctor)/onboarding(doctor)Thunks";

type PrescriptionUploadProps = {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
  accept?: string;
  setFile_url?: string;
};

const PrescriptionUpload = ({
  onUploadSuccess,
  folder = "prescriptions",
  accept = "image/jpeg,image/jpg,image/png,application/pdf",
  setFile_url,
}: PrescriptionUploadProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);

    try {
      const result = await dispatch(uploadDocument({ folder, file })).unwrap();
      const url = result?.url ?? result?.file_url ?? result;
      setFileUrl(url);
      onUploadSuccess?.(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    setFileUrl(null);
    setFileName("");
    setFile_url('');
  };

  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Prescription
          </h2>
        </div>

        {fileUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      {/* Upload Area */}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-full rounded-2xl border-2 border-dashed transition cursor-pointer overflow-hidden
          ${fileUrl
            ? "border-primary/30 bg-primary/5"
            : "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-slate-100"
          }`}
      >
        {/* Preview */}
        {fileUrl ? (
          isPdf ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <ShieldCheck className="w-10 h-10 text-primary" />
              <p className="text-sm font-semibold text-primary">PDF Uploaded</p>
              <p className="text-xs text-slate-400 max-w-[200px] truncate">{fileName}</p>
            </div>
          ) : (
            <img
              src={fileUrl}
              alt="Prescription preview"
              className="w-full max-h-64 object-contain p-3"
            />
          )
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-9 h-9 text-slate-300" />
            )}
            <p className="text-sm font-medium text-slate-500">
              {uploading ? "Uploading..." : "Click to upload prescription"}
            </p>
            <p className="text-xs text-slate-400">JPG, PNG or PDF</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PrescriptionUpload;