"use client";
import React, { useEffect, useState } from "react";
import { FiGift, FiClock, FiUserPlus } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyReferral } from "@/features/user-profile/userProfileThunks";
import { CiCalendarDate } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";

// ---------------- Dummy Data ------------------//

// -------- Status Helpers ----------
const getStatus = (ref) => {
  if (ref.rewardAmount) return "Reward Earned";
  if (!ref.order) return "Pending";
  if (ref.order.orderStatus === "COMPLETED") return "Completed";
  if (ref.order.orderStatus === "PLACED") return "Order Placed";
  if (ref.order.orderStatus === "REJECTED") return "Rejected";
  return "Pending";
};

const getDisplayStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "text-green-700 bg-green-100";
    case "Rejected":
      return "text-red-700 bg-red-100";
    default:
      return "text-yellow-700 bg-yellow-100";
  }
};



// -------------------------------------------------

const MyReferrals = ({ setOpenModal }: any) => {
  const dispatch = useAppDispatch();

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const limit = 4; // items per page
  // DISPATCH on page change (simulate API call)
  useEffect(() => {
    dispatch(fetchMyReferral({ page, limit }));
  }, [page]);

  const myReferral = useAppSelector((state) => state.userProfile.myReferral);
  console.log('refreeal', myReferral);

  // SLICE DATA FOR CURRENT PAGE
  const start = (page - 1) * limit;
  const paginatedReferrals = myReferral.slice(start, start + limit);

  const totalPages = Math.ceil(myReferral.length / limit);

  const totalEarned = myReferral
    .filter(r => r.rewardAmount)
    .reduce((sum, r) => sum + Number(r.rewardAmount), 0);

  const pendingRewards = myReferral.filter( r => r.order && !["COMPLETED", "REJECTED"].includes(r.order.orderStatus) &&!r.rewardAmount).length;


  const getDisplayStatus = (ref) => {
    const orderStatus = ref?.order?.orderStatus;

    if (orderStatus === "COMPLETED") return "Completed";
    if (orderStatus === "REJECTED") return "Rejected";

    return "Pending";
  };

  if (myReferral.length === 0) {
    return (
      <div className="mt-4 pb-10">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Earned */}
          <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiGift size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Earned</p>
              <p className="text-xl font-semibold">₹0</p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Rewards</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>

          {/* Total Referrals */}
          <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FiUserPlus size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Referrals</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
            <FiUserPlus className="text-blue-600" size={36} />
          </div>

          <h3 className="text-xl font-semibold text-gray-800">
            No Referrals Yet
          </h3>

          <p className="text-gray-500 mt-2 max-w-sm">
            You haven’t referred anyone yet. Invite friends and start earning rewards.
          </p>

          <button onClick={() => setOpenModal(true)} className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Invite Friends
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="mt-4 pb-10">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <FiGift size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Earned</p>
            <p className="text-xl font-semibold">
              ₹{totalEarned}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <FiClock size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Pending Rewards</p>
            <p className="text-xl font-semibold">{pendingRewards}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <FiUserPlus size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Referrals</p>
            <p className="text-xl font-semibold">{myReferral.length}</p>
          </div>
        </div>
      </div>

      {/* REFERRAL LIST */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-5">Your Referrals</h2>

        <div className="space-y-4">
          {paginatedReferrals.map((ref) => {
            const status = getStatus(ref);

            return (
              <div
                key={ref.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-xl p-4 hover:shadow-md transition"
              >
                {/* LEFT SECTION */}
                <div className="space-y-1">
                  <p className="text-base font-semibold text-gray-900">
                    {ref.referee.name}
                  </p>

                  <p className="text-sm text-gray-500 flex items-center">
                    <CiCalendarDate className="text-xl" />:{" "}
                    {new Date(ref.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaPhoneAlt className="text-md" />: {ref.referee.phone_number}
                  </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col items-start sm:items-end gap-2">
                  {(() => {
                    const displayStatus = getDisplayStatus(ref);

                    return (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDisplayStatusColor(
                          displayStatus
                        )}`}
                      >
                        {displayStatus}
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>


        {/* PAGINATION BUTTONS */}
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-40 cursor-pointer"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg border ${page === i + 1 ? "bg-blue-600 text-white " : "cursor-pointer"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReferrals;
