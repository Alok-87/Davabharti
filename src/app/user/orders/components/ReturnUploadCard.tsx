'use client';
import React, { useRef, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { uploadReturnProofApi } from '@/features/order/orderApi';
import { Toast } from '@/components/ui/toast';

interface ReturnUploadCardProps {
  onUploadComplete: (urls: string[]) => void;
}

export default function ReturnUploadCard({ onUploadComplete }: ReturnUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const { url } = await uploadReturnProofApi(file);
      setUploadedImages((prev) => {
        const updated = [...prev, url];
        onUploadComplete(updated);
        return updated;
      });
      Toast('Image uploaded successfully');
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err.message || 'Upload failed');
      Toast('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const handleRemove = (url: string) => {
    const updated = uploadedImages.filter((img) => img !== url);
    setUploadedImages(updated);
    onUploadComplete(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload button */}
      <div
        onClick={handleClick}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-primary transition"
      >
        {uploading ? (
          <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <ImFolderUpload className="text-4xl text-primary" />
            <p className="text-sm text-gray-600">Click or tap to upload return proof</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Uploaded preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {uploadedImages.map((img) => (
            <div key={img} className="relative group">
              <img
                src={img}
                alt="return-proof"
                className="w-full h-24 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => handleRemove(img)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
