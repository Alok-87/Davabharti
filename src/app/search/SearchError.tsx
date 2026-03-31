'use client';

import { AlertCircle } from 'lucide-react';

interface SearchErrorProps {
  message?: string;
}

export default function SearchError({ message }: SearchErrorProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <p className="text-lg font-medium text-gray-800">
        {message || 'Something went wrong while fetching search results.'}
      </p>
      <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
    </div>
  );
}
