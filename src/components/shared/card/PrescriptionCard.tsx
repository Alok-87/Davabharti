'use client';

import React, { useState } from 'react';
import { FiTrash2, FiX, FiDownload } from 'react-icons/fi';
import { FileText } from 'lucide-react';

interface PrescriptionCardProps {
  id: number | string;
  image: string;
  onDelete: (id: number | string) => void;
  fileType?: 'image' | 'pdf';
  selectionMode?: boolean;
  onSelect?: (id: number | string, image: string) => void;
  isSelected?: boolean;
}

export default function PrescriptionCard({
  id,
  image,
  onDelete,
  fileType,
  selectionMode = false,
  onSelect,
  isSelected = false
}: PrescriptionCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Auto-detect file type if not provided
  const detectedFileType = fileType || (image.toLowerCase().includes('.pdf') ? 'pdf' : 'image');
  const isPdf = detectedFileType === 'pdf';

  // Handle download functionality
  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${id}.${isPdf ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Handle card click - selection mode or normal behavior
  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(id, image);
      return;
    }

    if (isPdf) {
      handleDownload();
      // Also open in new tab
      window.open(image, '_blank');
    } else {
      setIsPreviewOpen(true);
    }
  };

  return (
    <>
      {/* --- Thumbnail Card --- */}
      <div
        className={`relative group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer ${selectionMode
            ? isSelected
              ? 'border-blue-500 border-2 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-blue-300'
            : 'border-gray-200'
          }`}
        onClick={handleCardClick}
      >
        {isPdf ? (
          <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center bg-gray-50">
            <FileText className="w-16 h-16 text-red-600 mb-2" />
            <span className="text-sm text-gray-600 font-medium">PDF Document</span>
            <span className="text-xs text-gray-500">Click to download & open</span>
          </div>
        ) : (
          <img
            src={image}
            alt={`Prescription ${id}`}
            width={300}
            height={200}
            className="w-full h-40 sm:h-48 object-contain"
          />
        )}

        {/* Selection Indicator */}
        {selectionMode && isSelected && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Action Buttons Container */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Download Button for PDFs (Desktop) */}
          {isPdf && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="bg-white/80 hover:bg-blue-600 hover:text-white text-gray-800 rounded-full p-2 shadow transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button (Desktop) */}
          {!selectionMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="bg-white/80 hover:bg-red-600 hover:text-white text-gray-800 rounded-full p-2 shadow transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Always visible on mobile */}
        <div className="sm:hidden absolute top-2 right-2 flex gap-2">
          {/* Download Button for PDFs (Mobile) */}
          {isPdf && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white rounded-full p-2 shadow-sm"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button (Mobile) */}
          {!selectionMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white rounded-full p-2 shadow-sm"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- Preview Modal --- */}
      {isPreviewOpen && !isPdf && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative bg-white rounded-md p-5 overflow-hidden shadow-lg max-w-3xl w-full sm:w-4/5 md:w-2/3 lg:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-2 right-2 bg-gray-200 cursor-pointer text-gray-700  hover:bg-red-600 hover:text-white rounded-full p-2 shadow-md"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-2 left-2 flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-gray-200 cursor-pointer text-gray-700 hover:bg-blue-600 hover:text-white rounded-full p-2 shadow-md"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <img
              src={image}
              alt={`Prescription ${id}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
