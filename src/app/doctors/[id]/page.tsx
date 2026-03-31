"use client";

import DoctorProfileCard from "./components/DoctorProfileCard";
import OpeningTimeCard from "./components/OpeningTimeCard";
import BiographyCard from "./components/BiographyCard";
import ReviewCard from "./components/ReviewCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDoctorsDetail } from "@/features/doctors/doctorThunks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppointmentBookingModal from "./components/AppointmentBookingModal";
import { setShowAppointmentModal } from "@/features/user-profile/userProfileSlice";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorDetailsPage() {
  const params = useParams<{ id: string }>();
  const doctorId = params?.id;
  const dispatch = useAppDispatch();

  const { doctorDetail, loading } = useAppSelector((state) => state.doctor);
  const { showAppointmentModal } = useAppSelector((state) => state.userProfile);


  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorsDetail(doctorId));
    }
  }, [doctorId, dispatch]);

    useEffect(() => {
      dispatch(setShowAppointmentModal(false));
    }, [])

  const openingTimes =
    doctorDetail?.availability?.map((item) => ({
      day: WEEK_DAYS[item.day_of_week] || "Unknown",
      time: item.is_active
        ? `${item.start_time} - ${item.end_time}`
        : "Closed",
    })) || [];

  const biographyData = {
    name: doctorDetail?.fullName || doctorDetail?.name || "Doctor",
    educationalBackground: doctorDetail?.bio || "No biography available.",
    experience:
      doctorDetail?.experience != null
        ? `${doctorDetail.experience} years of experience.`
        : "Experience details not available.",
  };

  const reviews = doctorDetail?.reviews || [];

  if (loading && !doctorDetail) {
    return <div className="p-10">Loading...</div>;
  }

  if (!doctorDetail) {
    return <div className="p-10">Doctor details not found.</div>;
  }

  return (
    <section className="min-h-screen bg-[#f7f7f7] py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Top full-width profile card */}
          <DoctorProfileCard doctor={doctorDetail} />

          {/* Bottom section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Biography + Reviews */}
            <div className="space-y-8 lg:col-span-8">
              <BiographyCard
                name={biographyData.name}
                educationalBackground={biographyData.educationalBackground}
                experience={biographyData.experience}
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Total Review ({doctorDetail.reviewCount || 0})
                </h2>

                <div className="mt-6 space-y-5">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <ReviewCard
                        key={review.id || index}
                        review={{
                          id: review.id || String(index),
                          name: review.patientName || "Anonymous User",
                          date: review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Recently",
                          rating: review.rating || 0,
                          comment: review.comment || "No comment provided.",
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500">No reviews available yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Opening Time */}
            <div className="lg:col-span-4">
              <OpeningTimeCard openingTimes={openingTimes} />
            </div>
          </div>
        </div>
      </div>
      {showAppointmentModal && (
        <AppointmentBookingModal
          isOpen={showAppointmentModal}
          onClose={() => dispatch(setShowAppointmentModal(false))}
          doctorId={doctorDetail.id}
        />
      )}

    </section>
  );
}