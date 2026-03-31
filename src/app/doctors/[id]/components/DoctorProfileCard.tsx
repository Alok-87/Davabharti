import type { DoctorDetails } from "@/features/doctors/types";
import {
    MdLocalHospital,
    MdPhone,
    MdEmail,
    MdLocationOn,
    MdWorkHistory,
} from "react-icons/md";
import {
    FaStethoscope,
    FaRegIdCard,
    FaRupeeSign,
    FaGraduationCap,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdAccessTime, MdCalendarToday } from "react-icons/md";
import { setShowAppointmentModal } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AppointmentBookingModal from "./AppointmentBookingModal";

type DoctorProfileCardProps = {
    doctor: DoctorDetails;
};

export default function DoctorProfileCard({
    doctor
}: DoctorProfileCardProps) {
    const specializations =
        doctor.specializations?.map((item) => item.name) || [];
    const services = doctor.services?.map((item) => item.name) || [];
    const dispatch = useAppDispatch();
    


    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[430px_1fr]">
                {/* LEFT: Image */}
                <div className="relative h-[280px] sm:h-[360px] lg:h-full min-h-[280px] bg-slate-100">
                    {doctor.profileImageUrl ? (
                        <img
                            src={doctor.profileImageUrl}
                            alt={doctor.fullName || doctor.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop"
                            alt={doctor.fullName || doctor.name}
                            className="h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow">
                        {doctor.status || "ACTIVE"}
                    </div>
                </div>

                {/* RIGHT: Info */}
                <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                    <div>
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                                    {doctor.fullName || doctor.name}
                                </h1>

                                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-600 sm:text-base">
                                    <FaStethoscope className="shrink-0" size={14} />
                                    {specializations.length > 0
                                        ? specializations.join(", ")
                                        : "General Physician"}
                                </p>
                            </div>

                            {doctor.degree && (
                                <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
                                    <FaGraduationCap size={12} />
                                    {doctor.degree}
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            {specializations.map((s, i) => (
                                <span
                                    key={i}
                                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-primary sm:text-sm"
                                >
                                    {s}
                                </span>
                            ))}

                            {services.map((s, i) => (
                                <span
                                    key={i}
                                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:text-sm"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        <hr className="my-6 border-slate-100" />

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <InfoRow
                                icon={<MdLocalHospital className="text-primary" size={20} />}
                                label="Clinic"
                                value={doctor.clinicName || "N/A"}
                            />
                            <InfoRow
                                icon={<FaRegIdCard className="text-primary" size={18} />}
                                label="Reg. No"
                                value={doctor.registrationNumber || "N/A"}
                            />
                            <InfoRow
                                icon={<MdPhone className="text-primary" size={20} />}
                                label="Phone"
                                value={doctor.phone || "N/A"}
                            />
                            <InfoRow
                                icon={<MdEmail className="text-primary" size={20} />}
                                label="Email"
                                value={doctor.email || "N/A"}
                            />
                            <InfoRow
                                icon={<MdWorkHistory className="text-primary" size={20} />}
                                label="Experience"
                                value={doctor.experience ? `${doctor.experience} years` : "N/A"}
                            />
                            <InfoRow
                                icon={<FaRupeeSign className="text-primary" size={16} />}
                                label="Consult Fee"
                                value={doctor.consultationFee ? `₹${doctor.consultationFee}` : "N/A"}
                            />
                            <InfoRow
                                icon={<MdLocationOn className="text-primary" size={20} />}
                                label="City"
                                value={doctor.city || "N/A"}
                            />
                        </div>
                    </div>
                    <hr className="my-6 border-slate-100" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

                        {/* Book Appointment */}
                        <button onClick={() => dispatch(setShowAppointmentModal(true))} className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl cursor-pointer bg-primary text-white font-medium shadow-md hover:opacity-90 transition">
                            <MdAccessTime className="text-lg" />
                            Book Appointment
                        </button>

                        {/* Book */}
                        <button onClick={() => dispatch(setShowAppointmentModal(true))} className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl cursor-pointer bg-green-600 text-white font-medium shadow-md hover:opacity-90 transition">
                            <MdCalendarToday className="text-lg" />
                            Book
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3  px-4 py-3">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p className="break-words text-sm font-semibold text-slate-800 sm:text-base">
                    {value}
                </p>
            </div>
        </div>
    );
}