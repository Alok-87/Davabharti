"use client";

import TransactionList from "../components/TransactionList";
import { useEffect, useState } from "react";
import { fetchCustomerWalletLedger } from "@/features/user-profile/userProfileThunks";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Wallet } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


const PAGE_SIZE = 4;

const WalletTransaction = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const { walletLedgerListResult, loading } = useAppSelector((state) => state.userProfile);
  const totalPages = Math.ceil((walletLedgerListResult?.total_count || 0) / PAGE_SIZE);
  const walletLedgerData = walletLedgerListResult?.records;

  // ✅ Fetch when page changes
  useEffect(() => {
    const offset = (page - 1) * PAGE_SIZE;

    dispatch(
      fetchCustomerWalletLedger({
        asset: 'COIN',
        offset,
        limit: PAGE_SIZE,
      })
    );
  }, [dispatch, page]);

  if (loading) {
    return <div className="p-4 text-center">Loading wallet history...</div>;
  }

  const hasTransactions = walletLedgerData?.length > 0;

  return (
    <div className="p-2 sm:pl-4">
      {!hasTransactions ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <Wallet className="w-12 h-12 mb-3 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-700">
            No transactions yet
          </h3>
          <p className="text-sm mt-1">
            Your wallet activity will appear here once you start using it.
          </p>
        </div>
      ) : (
        <>
          <TransactionList transactions={walletLedgerData} />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  variant="outlined"
                  color="primary"
                />
              </Stack>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default WalletTransaction;
