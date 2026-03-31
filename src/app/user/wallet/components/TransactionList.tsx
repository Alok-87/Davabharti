'use client';

import React, { useMemo } from 'react';
import { GiTwoCoins } from 'react-icons/gi';

type Transaction = {
  id: string;
  asset: 'CASH' | 'COIN';
  direction: 'CREDIT' | 'DEBIT' | 'EXPIRY';
  amount: string;
  source: string;
  note?: string;
  createdAt: string;
};

type Props = {
  title?: string;
  transactions: Transaction[];
};

export default function TransactionList({
  title = 'Transaction History',
  transactions,
}: Props) {

  const normalized = useMemo(() => {
    return transactions.map((tx) => {
      const isCredit = tx.direction === 'CREDIT';
      const isExpiry = tx.direction === 'EXPIRY';

      return {
        ...tx,
        isCredit,
        isDebit: tx.direction === 'DEBIT',
        isExpiry,
        amountNumber: Number(tx.amount),
        label:
          isExpiry
            ? 'Coins Expired'
            : isCredit
            ? tx.source === 'REFUND'
              ? 'Refund Received'
              : tx.source === 'CASHBACK'
              ? 'Cashback Earned'
              : 'Money Received'
            : 'Payment Made',
      };
    });
  }, [transactions]);

  console.log('data',normalized)

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      <div className="space-y-3">
        {normalized.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center
                  ${
                    tx.isCredit
                      ? 'bg-green-100 text-green-600'
                      : tx.isExpiry
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-red-100 text-red-600'
                  }
                `}
              >
                {tx.asset === 'COIN' ? <GiTwoCoins /> : '₹'}
              </div>

              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {tx.label}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleString('en-IN')}
                </p>
                {tx.note && (
                  <p className="text-xs text-gray-500">note : {tx.note}</p>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={`font-semibold text-sm
                ${
                  tx.isCredit
                    ? 'text-green-600'
                    : tx.isExpiry
                    ? 'text-orange-600'
                    : 'text-red-500'
                }
              `}
            >
              {!tx.isExpiry && (tx.isCredit ? '+' : '-')}
              {tx.asset === 'CASH' && '₹'}
              {tx.amountNumber.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
