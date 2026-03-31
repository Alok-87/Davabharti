'use client'
import { fetchAppointmentDetail, PaymentDone } from '@/features/doctors/doctorThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import {
  FiArrowLeft, FiUser, FiCalendar, FiClock, FiMonitor,
  FiHome, FiPhone, FiMail, FiMapPin, FiFileText, FiActivity,
  FiUsers, FiCreditCard, FiDollarSign, FiCheckCircle,   // ✅ add these
  FiClipboard
} from 'react-icons/fi';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_STYLES: Record<string, string> = {
  PAYMENT_PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  BOOKED: 'bg-blue-50 text-blue-700 border-blue-200',
  ACCEPTED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};

const AppointmentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const appointmentId = params?.id;
  const dispatch = useAppDispatch();
  const { appointment, loading } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchAppointmentDetail(appointmentId));
    }
  }, [appointmentId, dispatch]);

  const joinHandler = () => {
    router.push(`/user/appointments/${appointmentId}/video-call`);
  };

  const handlePayment = () => {
    dispatch(PaymentDone(appointmentId))
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-white rounded-2xl border border-slate-100" />
        <div className="h-40 bg-white rounded-2xl border border-slate-100" />
        <div className="h-40 bg-white rounded-2xl border border-slate-100" />
      </div>
    </div>
  );

  if (!appointment) return null;

  const doc = appointment.doctor;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Back + Header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary cursor-pointer hover:border-primary/30 transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="flex items-center justify-between gap-3">
            {
              appointment.consultation_type === 'ONLINE' &&
              <div onClick={joinHandler} className="px-5 py-2 rounded-xl bg-primary text-white  cursor-pointer  transition ">
                Join
              </div>
            }
            <div onClick={handlePayment} className="flex items-center gap-1 px-5 py-3.5 rounded-xl bg-primary text-white  cursor-pointer  transition ">done</div>
          </div>

        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FiActivity className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xl font-semibold text-black flex items-center gap-3">
                Appointment <span className="text-primary">#{appointment.id}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[appointment.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {appointment.status.replace(/_/g, ' ')}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className={`inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full ${appointment.payment_status === 'PAID'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-500'
                }`}>
                {appointment.payment_status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-800 mt-0.5">₹{appointment.final_amount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Doctor Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FiUser className="text-primary" size={15} />
              Doctor Information
            </h2>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {doc?.profile_image_url ? (
                  <img src={doc.profile_image_url} className="w-14 h-14 rounded-xl object-cover" alt={doc.full_name} />
                ) : (
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop" className="w-14 h-14 rounded-xl object-cover" alt={doc.full_name} />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900">{doc?.full_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{doc?.clinic_name}</p>
                <p className="text-xs text-primary font-medium mt-1">{doc?.experience} yrs experience</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <FiMail size={15} className="text-primary shrink-0" />
                <span className="text-md text-slate-600 truncate">{doc?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone size={15} className="text-primary shrink-0" />
                <span className="text-md text-slate-600">{doc?.phone_number}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMapPin size={15} className="text-primary shrink-0" />
                <span className="text-md text-slate-600">{doc?.city || '—'}</span>
              </div>
              {/* ✅ Added */}
              <div className="flex items-center gap-2.5">
                <FiUser size={15} className="text-primary shrink-0" />
                <span className="text-md text-slate-600">Gender: {doc?.gender || '—'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiHome size={15} className="text-primary shrink-0" />
                <span className="text-md text-slate-600">
                  {doc?.clinic_name}{doc?.clinic_city ? `, ${doc.clinic_city}` : doc?.city ? `, ${doc.city}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FiUser className="text-primary" size={15} />
              Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Patient Name', value: appointment.patient_name, icon: <FiUser size={13} className="text-primary" /> },
                { label: 'Age', value: `${appointment.patient_age} years`, icon: <FiCalendar size={13} className="text-primary" /> },
                { label: 'Gender', value: appointment.patient_gender, icon: <FiUsers size={13} className="text-primary" /> },
                { label: 'Consultation Fee', value: `₹${doc?.consultation_fee}`, icon: <FiCreditCard size={13} className="text-primary" /> },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.icon}
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary" size={15} />
              Appointment Schedule
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-primary flex items-center gap-1">
                  <FiCalendar size={11} /> Date
                </p>
                <p className="text-sm font-semibold text-black mt-1">
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-primary flex items-center gap-1">
                  <FiClock size={11} /> Time
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {appointment.appointment_time}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-primary flex items-center gap-1">
                  {appointment.consultation_type === 'ONLINE'
                    ? <FiMonitor size={11} /> : <FiHome size={11} />}
                  Consultation
                </p>
                <p className={`text-sm font-semibold mt-1 ${appointment.consultation_type === 'ONLINE' ? 'text-black' : 'text-slate-800'
                  }`}>
                  {appointment.consultation_type}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-primary flex items-center gap-1">
                  <FiClock size={11} /> Slot Hours
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {appointment.slot?.start_time} – {appointment.slot?.end_time}
                </p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FiFileText className="text-primary" size={15} />
              Symptoms & Notes
            </h2>

            {/* Symptoms */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <FiActivity size={13} className="text-primary" />
                <p className="text-xs text-slate-400">Symptoms</p>
              </div>
              <p className="text-sm text-black leading-relaxed">
                {appointment.symptoms || 'No symptoms recorded.'}
              </p>
            </div>

            {/* Prescription */}
            <div className="mt-3 bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <FiClipboard size={13} className="text-primary" />
                <p className="text-xs text-slate-400">Prescription</p>
              </div>

              {appointment?.history_meds?.length > 0 ? (
                <img
                  src={appointment.history_meds[0].file_url}
                  alt="Prescription"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
              ) : (
                <p className="text-sm text-black">Not available yet</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppointmentDetailPage;