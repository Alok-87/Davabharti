"use client";

import {
  MapPin,
  BriefcaseMedical,
  IndianRupee,
  Star,
  Video,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  image?: string | null;
  specializations: { id: string; name: string }[];   // ✅ matches API
  city: string;                                       // ✅ matches API
  clinicName: string;                                 // ✅ matches API
  experience: number;
  consultationFee: string | number;
  rating: number;
  reviewCount: number;                                // ✅ matches API
  services: { id: string; name: string }[];          // ✅ matches API
  symptoms: { id: string; name: string }[];          // ✅ matches API
  status: "ACTIVE" | "INACTIVE";
};

type DoctorCardProps = {
  doctor: Doctor;
};

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const initials = doctor.name
    .split(" ")
    .filter((w) => w !== "Dr.")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


    const router = useRouter();
    const clickHandler = (id: string) => {
        router.push(`doctors/${id}`)
    }

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image / Avatar Section */}
      <div className="relative">
        {!doctor.image ? (
          <img
            src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop'
            alt={doctor.name}
            className="h-56 w-full object-cover sm:h-64"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-sky-500 to-blue-700 sm:h-64">
            <span className="text-5xl font-bold text-white">{initials}</span>
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {doctor.status}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 rounded-xl bg-primary p-3 text-white shadow-lg">
          <BriefcaseMedical size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
            <p className="mt-1 text-sm font-medium text-primary">
              {doctor.specializations?.map((s) => s.name).join(", ") || "General Physician"}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-600">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {doctor.rating ?? "N/A"}
          </div>
        </div>

        <div className="space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span>{doctor.clinicName}{doctor.city ? `, ${doctor.city}` : ""}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-primary" />
            <span>{doctor.experience} Years Experience</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee size={16} className="text-primary" />
            <span>Consultation Fee: ₹{doctor.consultationFee}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.services?.slice(0, 2).map((s) => (
            <span
              key={s.id}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
            >
              {s.name}
            </span>
          ))}

          {doctor.symptoms?.slice(0, 2).map((sym) => (
            <span
              key={sym.id}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {sym.name}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>{doctor.reviewCount ? doctor.reviewCount : 124} reviews</span>
          <span className="font-medium text-slate-700">{doctor.city}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={() => clickHandler(doctor.id)} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition cursor-pointer">
            View Profile
          </button>

          <button onClick={() => clickHandler(doctor.id)}  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer">
            <Video size={16} />
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;