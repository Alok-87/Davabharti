'use client'
import { fetchAppointments } from '@/features/doctors/doctorThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect, useRef, useState } from 'react'
import Pagination from "@mui/material/Pagination";
import Stack from '@mui/material/Stack';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { FiCalendar, FiClock, FiUser, FiMonitor, FiHome, FiChevronRight, FiDollarSign } from 'react-icons/fi';
import { FaUserInjured } from "react-icons/fa";


const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Payment Pending', value: 'PAYMENT_PENDING' },
    { label: 'Booked', value: 'BOOKED' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];


function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

const AppointmentsPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { appointments, loading, meta } = useAppSelector((state) => state.doctor);
    const totalPages = meta?.totalPages;
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('PAYMENT_PENDING');
    const searchParams = useSearchParams();

    useEffect(() => {
        dispatch(fetchAppointments({ status, page, limit: 5 }));
    }, [page, status]);

    const handleFilterChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const initialSearch = searchParams.get('search_term') || '';
    const initialStatus = searchParams.get('orderStatus') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const searchRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">



                <div className="mx-auto max-w-6xl space-y-3 bg-gray-50 pb-3 pt-2  sm:px-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
                        My Appointments
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3 rounded-lg shadow-sm border">

                        {/* Search */}
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 flex-1">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search Appointment number..."
                                className="bg-transparent outline-none flex-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setTimeout(() => searchRef.current?.focus(), 0);
                                }}
                            />
                        </div>

                        {/* Filter */}
                        <select
                            className="border rounded-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm w-full sm:w-48"
                            value={status}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="PAYMENT_PENDING">Payment Pending</option>
                            <option value="BOOKED">Booked</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : appointments?.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <FiCalendar className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-slate-500 font-medium">No appointments found</p>
                        <p className="text-slate-400 text-sm mt-1">Try changing the filter above</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {appointments?.map((appt: any) => (
                            <div
                                key={appt.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group p-5"
                            >
                                {/* Top Row */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FiUser className="text-primary" size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-primary">#{appt.id}</p>
                                            <h3 className="text-sm font-bold text-slate-800 leading-tight">
                                                {appt.doctor?.full_name ?? 'Doctor'}
                                            </h3>
                                        </div>
                                    </div>

                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border
          ${appt.status === 'PAYMENT_PENDING'
                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            : appt.status === 'BOOKED'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : appt.status === 'ACCEPTED'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : appt.status === 'COMPLETED'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-red-50 text-red-600 border-red-200'
                                        }`}>
                                        {appt.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Middle Meta Row */}
                                <div className="py-4 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {/* Date */}
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 text-slate-400">
                                            <FiCalendar size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Appointment Date</p>
                                            <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                                {formatDate(appt.appointment_date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 text-slate-400">
                                            <FiClock size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Time</p>
                                            <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                                {appt.appointment_time}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Consultation Type */}
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 text-slate-400">
                                            {appt.consultation_type === 'ONLINE'
                                                ? <FiMonitor size={15} />
                                                : <FiHome size={15} />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Consultation</p>
                                            <p className={`text-sm font-semibold mt-0.5 ${appt.consultation_type === 'ONLINE' ? 'text-primary' : 'text-primary'
                                                }`}>
                                                {appt.consultation_type}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Final Amount */}
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 text-slate-400">
                                            <FiDollarSign size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Final Amount</p>
                                            <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                                ₹{appt.final_amount}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="pt-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Patient */}
                                        <span className="flex items-center gap-2 text-md text-black">
                                            <FaUserInjured size={18} className="text-slate-400" />
                                            {appt.patient_name}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/user/appointments/${appt.id}`)}
                                        className="flex items-center gap-1 text-sm font-semibold text-primary  transition cursor-pointer"
                                    >
                                        View Details
                                        <FiChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && appointments?.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages ?? 1}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                shape="rounded"
                                variant="outlined"
                                color="primary"
                            />
                        </Stack>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;