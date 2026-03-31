'use client';

import { HandCoins, PiggyBank } from 'lucide-react';

export default function QuotationCard({
  show,
  isQuotationExpired,
  paymentMessage,
  amountAfterQuotation,
  onAccept,
  onReject,
}: {
  show: boolean;
  isQuotationExpired: boolean;
  paymentMessage: string;
  amountAfterQuotation: number;
  onAccept: () => void;
  onReject: () => void;
}) {
  if (!show) return null;

  return (
    <section className="bg-white border shadow-sm hover:shadow transition">
      <div className="p-6">
        {paymentMessage && (
          <div
            className={`mb-4 p-4 rounded-lg border flex items-center gap-3 ${
              amountAfterQuotation > 0
                ? 'bg-red-50 border-red-200 text-red-700'
                : amountAfterQuotation < 0
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {amountAfterQuotation > 0 ? <HandCoins className="w-5 h-5" /> : null}
            {amountAfterQuotation < 0 ? <PiggyBank className="w-5 h-5" /> : null}
            <p className="text-sm font-medium">{paymentMessage}</p>
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quotation Requires Your Approval</h2>

        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-900 p-4 rounded-lg">
          <p className="text-sm leading-relaxed">
            A custom quotation has been prepared for your order. Please accept or reject.
            <br />
            <span className="font-semibold">Note:</span> Auto expires in 1 day.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            disabled={isQuotationExpired}
            onClick={onAccept}
            className="py-2.5 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept Quotation
          </button>

          <button
            disabled={isQuotationExpired}
            onClick={onReject}
            className="py-2.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Quotation
          </button>
        </div>
      </div>
    </section>
  );
}