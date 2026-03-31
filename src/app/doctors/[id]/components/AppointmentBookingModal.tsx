"use client";

import { bookAppointment } from "@/features/doctors/doctorThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  FiX,
  FiCalendar,
  FiClock,
  FiUsers,
  FiFileText,
  FiMonitor,
  FiHome,
} from "react-icons/fi";
import AuthGuard from '@/app/(auth)/components/AuthGuard';
import PrescriptionUpload from "./PrescriptionUpload";

type AppointmentBookingFormValues = {
  doctorId: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms: string;
  patientType: "SELF" | "FAMILY_MEMBER";
  familyMemberId: string;
  consultationType: "ONLINE" | "OFFLINE";
};

type AppointmentBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
};

interface SubSlot {
  label: string;
  time: string;
}

function generateSubSlots(start: string, end: string, durationMins: number): SubSlot[] {
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toTime = (mins: number) => {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };
  const slots: SubSlot[] = [];
  let cursor = toMins(start);
  const endMins = toMins(end);
  while (cursor + durationMins <= endMins) {
    const slotEnd = cursor + durationMins;
    slots.push({ label: `${toTime(cursor)} – ${toTime(slotEnd)}`, time: toTime(cursor) });
    cursor = slotEnd;
  }
  return slots;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  doctorId,
}: AppointmentBookingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [bookedLoading, setBookedLoading] = useState(false);
  const [file_url, setFile_url] = useState('');

  const { familyMembers } = useAppSelector((state) => state.userProfile);
  const { doctorDetail } = useAppSelector((state) => state.doctor);
  const availability = doctorDetail?.availability || [];
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AppointmentBookingFormValues>({
    defaultValues: {
      doctorId,
      slotId: "",
      appointmentDate: "",
      appointmentTime: "",
      symptoms: "",
      patientType: "SELF",
      familyMemberId: "",
      consultationType: "ONLINE",
    },
  });

  const patientType = watch("patientType");

  // Derive matched slot and sub-slots from selected date
  const dayOfWeek = selectedDate ? new Date(selectedDate + "T00:00:00").getDay() : null;
  const matchedSlot = dayOfWeek !== null ? availability.find((s) => s.day_of_week === dayOfWeek) : null;
  const subSlots: SubSlot[] = matchedSlot
    ? generateSubSlots(matchedSlot.start_time, matchedSlot.end_time, matchedSlot.slot_duration_minutes)
    : [];

  const availableDayNumbers = availability.map((s) => s.day_of_week);

  // Reset when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedDate("");
    setSelectedTime("");
    setBookedTimes([]);
    reset({
      doctorId,
      slotId: "",
      appointmentDate: "",
      appointmentTime: "",
      symptoms: "",
      patientType: "SELF",
      familyMemberId: "",
      consultationType: "ONLINE",
    });
  }, [isOpen, doctorId, reset]);

  // Clear family member when switching to SELF
  useEffect(() => {
    if (patientType === "SELF") {
      setValue("familyMemberId", "");
    }
  }, [patientType, setValue]);

  // When matched slot changes, update slotId and reset time
  useEffect(() => {
    setValue("slotId", matchedSlot?.id || "");
    setSelectedTime("");
    setValue("appointmentTime", "");
  }, [matchedSlot?.id, setValue]);

  // Fetch booked times when date + doctorId are set
  useEffect(() => {
    if (!selectedDate || !doctorId) {
      setBookedTimes([]);
      return;
    }
    setBookedLoading(true);
    api
      .get(`/doctors/public/${doctorId}/booked-slots`, { params: { date: selectedDate } })
      .then((res) => setBookedTimes(res.data.data?.bookedTimes || []))
      .catch(() => setBookedTimes([]))
      .finally(() => setBookedLoading(false));
  }, [selectedDate, doctorId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setValue("appointmentDate", date);
    setSelectedTime("");
    setValue("appointmentTime", "");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue("appointmentTime", time);
  };

  const onSubmit = async (values: AppointmentBookingFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        doctorId: values.doctorId,
        slotId: values.slotId,
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        ...(values.symptoms?.trim() && { symptoms: values.symptoms.trim() }),
        patientType: values.patientType,
        consultationType: values.consultationType,
        ...(file_url && { file_url }),
        ...(values.patientType === "FAMILY_MEMBER" && {
          familyMemberId: values.familyMemberId,
        }),
      };
      const response = await dispatch(bookAppointment(payload)).unwrap();
      const appointmentID = response.data.appointment.id;

      const paymentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/doctor/initiate?appointmentId=${appointmentID}`;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
    } finally {
      setSubmitting(false);
      // onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AuthGuard>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6 sm:py-10">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Book Appointment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the details to confirm the appointment
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6">
            <div className="space-y-5">

              {/* Appointment Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appointment Date*
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                  <FiCalendar className="text-slate-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <input type="hidden" {...register("appointmentDate", { required: "Appointment date is required" })} />
                {errors.appointmentDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.appointmentDate.message}</p>
                )}
              </div>

              {/* Unavailable warning */}
              {selectedDate && !matchedSlot && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-sm font-medium text-amber-800">Doctor is not available on this day.</p>
                  {availableDayNumbers.length > 0 && (
                    <p className="mt-0.5 text-xs text-amber-600">
                      Available on:{" "}
                      {availableDayNumbers
                        .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Time Slot Dropdown */}
              {matchedSlot && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Time Slot*{" "}
                    <span className="font-normal text-slate-400">
                      · {matchedSlot.start_time} – {matchedSlot.end_time} · {matchedSlot.slot_duration_minutes} min each
                    </span>
                  </label>

                  {bookedLoading && (
                    <p className="mb-2 text-xs text-slate-400">Checking availability…</p>
                  )}

                  {subSlots.length === 0 ? (
                    <p className="text-sm text-red-500">No slots found. Check doctor availability configuration.</p>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                      <FiClock className="text-slate-500" size={16} />
                      <select
                        value={selectedTime}
                        onChange={(e) => handleTimeSelect(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-slate-700"
                      >
                        <option value="">-- Select a time slot --</option>
                        {subSlots.map((sub) => {
                          const isBooked = bookedTimes.includes(sub.time);
                          return (
                            <option
                              key={sub.time}
                              value={sub.time}
                              disabled={isBooked}
                              className={isBooked ? "text-red-400" : "text-slate-700"}
                            >
                              {sub.label} {isBooked ? "(Booked)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  <input type="hidden" {...register("appointmentTime", { required: "Please select a time slot" })} />
                  {errors.appointmentTime && (
                    <p className="mt-2 text-xs text-red-500">{errors.appointmentTime.message}</p>
                  )}
                  <input type="hidden" {...register("slotId", { required: "Slot is required" })} />
                  {errors.slotId && (
                    <p className="mt-1 text-xs text-red-500">{errors.slotId.message}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Patient Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Patient Type*
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                    <FiUsers className="text-slate-500" />
                    <select
                      {...register("patientType", { required: "Patient type is required" })}
                      className="w-full bg-transparent text-sm outline-none"
                    >
                      <option value="SELF">Self</option>
                      <option value="FAMILY_MEMBER">Family Member</option>
                    </select>
                  </div>
                  {errors.patientType && (
                    <p className="mt-1 text-xs text-red-500">{errors.patientType.message}</p>
                  )}
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Consultation Type*
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                    {watch("consultationType") === "ONLINE" ? (
                      <FiMonitor className="text-slate-500" />
                    ) : (
                      <FiHome className="text-slate-500" />
                    )}
                    <select
                      {...register("consultationType", { required: "Consultation type is required" })}
                      className="w-full bg-transparent text-sm outline-none"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                  {errors.consultationType && (
                    <p className="mt-1 text-xs text-red-500">{errors.consultationType.message}</p>
                  )}
                </div>

                {/* Family Member Select */}
                {patientType === "FAMILY_MEMBER" && (
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Family Member
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                      <FiUsers className="text-slate-500" />
                      <select
                        {...register("familyMemberId", {
                          validate: (value) =>
                            patientType === "FAMILY_MEMBER"
                              ? !!value || "Please select a family member"
                              : true,
                        })}
                        className="w-full bg-transparent text-sm outline-none"
                      >
                        <option value="">Select family member</option>
                        {familyMembers
                          .filter((member) => member.relationship !== "Self")
                          .map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                              {member.relationship ? ` - ${member.relationship}` : ""}
                            </option>
                          ))}
                      </select>
                    </div>
                    {errors.familyMemberId && (
                      <p className="mt-1 text-xs text-red-500">{errors.familyMemberId.message}</p>
                    )}
                  </div>
                )}

                {/* Symptoms */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Symptoms
                  </label>
                  <div className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-3">
                    <FiFileText className="mt-1 text-slate-500" />
                    <textarea
                      rows={4}
                      placeholder="Describe symptoms..."
                      {...register("symptoms")}
                      className="w-full resize-none bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>


                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Prescription
                  </label>
                  <PrescriptionUpload
                    onUploadSuccess={(url) => setFile_url(url || null)} setFile_url={setFile_url}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !selectedTime}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
