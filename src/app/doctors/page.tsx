'use client'
import { useEffect, useMemo, useState } from "react";
import  DoctorCard from './components/DoctorCard'
import {Search,} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDoctorsList } from "@/features/doctors/doctorThunks";
import { setShowAppointmentModal } from "@/features/user-profile/userProfileSlice";




const  DoctorsListingSection = () => {
  const [location, setLocation] = useState("All Locations");
  const [department, setDepartment] = useState("All Departments");
  const [rating, setRating] = useState("All Ratings");
  const [search, setSearch] = useState("");

  const locations = ["All Locations", "Sitamarhi", "Indore", "Bhopal", "Patna", "Delhi", "Lucknow"];
  const departments = [
    "All Departments",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "General Physician",
  ];
  const ratings = ["All Ratings", "4+", "4.5+", "4.8+"];



  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDoctorsList());
    dispatch(setShowAppointmentModal(false));
  }, [])

  const {doctors} = useAppSelector((state) => state.doctor)

  return (
    <section className="w-full bg-slate-50 py-5 ">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Find the Right Doctor
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Choose doctors according to location, department, rating, and your use case.
          </p>
        </div>

        <div className="mb-8 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-sky-500"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-sky-500"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-sky-500"
            >
              {ratings.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search doctor, clinic, service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-5 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-white transition hover:bg-sky-600"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600 sm:text-base">
            Showing <span className="font-bold text-slate-900">{filteredDoctors.length}</span> doctors
          </p>
        </div> */}

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard  key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No doctors found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </div>
    </section>
    
  );
}

export default DoctorsListingSection;