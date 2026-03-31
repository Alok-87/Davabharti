"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Mail,
  Phone,
  ArrowRight,
  PhoneCall,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import girl from "@/assets/girl.png";
import Image from "next/image";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserGraduate, FaRegIdCard } from "react-icons/fa";
import OtpInputPreview from "./OtpInputs";
import { GiTakeMyMoney } from "react-icons/gi";
import {
  MdOutlineDriveFileRenameOutline,
  MdOutlineLocationOn,
} from "react-icons/md";
import { LuMapPinned } from "react-icons/lu";
import { PiCity } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stepBasicDetail, getDoctorServices, getDoctorSpecializations, getDoctorSymptoms, sendEmailOtp, sendMobileOtp, verifyEmailOtp, verifyMobileOtp } from "@/features/onboarding(doctor)/onboarding(doctor)Thunks";
import { MdOutlineVerified } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { setCurrentStep } from "@/features/onboarding/onboardingSlice";
import { setEmailOtpSent, setEmailVerified, setMobileOtpSent, setMobileVerified } from "@/features/onboarding(doctor)/onboarding(doctor)Slice";

export default function BasicInformationForm() {
  const { doctorId, doctorData, specializations, services, symptoms } = useAppSelector((state) => state.doctoronboarding)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      email: "",
      mobilePhone: "",
      registrationNumber: "",
      gender: "",
      dateOfBirth: "",
      biography: "",
      experience: "",
      consultationFee: "",
      clinicName: "",
      clinicAddress: "",
      clinicCity: "",
      clinicPincode: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      specializations: [],
      services: [],
      symptoms: [],
      timetable: [
        { day_of_week: 0, start_time: "", end_time: "", is_active: true },
        { day_of_week: 1, start_time: "", end_time: "", is_active: true },
        { day_of_week: 2, start_time: "", end_time: "", is_active: true },
        { day_of_week: 3, start_time: "", end_time: "", is_active: true },
        { day_of_week: 4, start_time: "", end_time: "", is_active: true },
        { day_of_week: 5, start_time: "", end_time: "", is_active: true },
        { day_of_week: 6, start_time: "", end_time: "", is_active: true },
      ],
    },
  });

  useEffect(() => {
    if (doctorData) {
      reset({
        fullName: doctorData.fullName || "",
        email: doctorData.email || "",
        mobilePhone: doctorData.phone || "",
        registrationNumber: doctorData.registrationNumber || "",
        gender: doctorData.gender || "",
        dateOfBirth: doctorData.dob
          ? doctorData.dob.split("T")[0]
          : "",
        biography: doctorData.bio || "",
        experience: doctorData.experience || "",
        consultationFee: doctorData.consultationFee || "",

        clinicName: doctorData.clinicName || "",
        clinicAddress: doctorData.clinicAddress || "",
        clinicCity: doctorData.clinicCity || "",
        clinicPincode: doctorData.clinicPincode || "",

        addressLine1: doctorData.address_line_1 || "",
        city: doctorData.city || "",
        postalCode: doctorData.postal_code || "",

        // ✅ ARRAY MAPPING
        specializations: doctorData.specializations?.map((item) => item.id) || [],
        services: doctorData.services?.map((item) => item.id) || [],
        symptoms: doctorData.symptoms?.map((item) => item.id) || [],

        // ✅ TIMETABLE MAPPING
        timetable:
          doctorData.availability?.map((slot) => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time || "",
            end_time: slot.end_time || "",
            is_active: slot.is_active ?? true,
          })) || [
            { day_of_week: 0, start_time: "", end_time: "", is_active: true },
            { day_of_week: 1, start_time: "", end_time: "", is_active: true },
            { day_of_week: 2, start_time: "", end_time: "", is_active: true },
            { day_of_week: 3, start_time: "", end_time: "", is_active: true },
            { day_of_week: 4, start_time: "", end_time: "", is_active: true },
            { day_of_week: 5, start_time: "", end_time: "", is_active: true },
            { day_of_week: 6, start_time: "", end_time: "", is_active: true },
          ],
      });
    }
  }, [doctorData]);



  const onSubmit = (data) => {
    const finalPayload = {
      ...data,
      experience: Number(data.experience),
      consultationFee: Number(data.consultationFee),
      specializations: data.specializations || [],
      services: data.services || [],
      symptoms: data.symptoms || [],
    };

    dispatch(stepBasicDetail(finalPayload));
    // console.log(finalPayload);
  };

  const { emailOtpSent, emailVerified, mobileOtpSent, mobileVerified } = useAppSelector((state) => state.doctoronboarding)

  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isSympOpen, setIsSympOpen] = useState(false);


  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDoctorSpecializations());
    dispatch(getDoctorServices());
    dispatch(getDoctorSymptoms());
  }, [])

  const sendOtp = async (type: string) => {
    try {
      if (type === "email") {
        const email = getValues("email");

        if (!email) {
          alert("Please enter email first");
          return;
        }


        setValue("email", email, { shouldDirty: true, shouldValidate: true });

        const payload = {
          email,
          doctor_id: doctorId,
        };

        await dispatch(sendEmailOtp(payload));
      }

      if (type === "phone") {
        const mobilePhone = getValues("mobilePhone");

        if (!mobilePhone) {
          alert("Please enter phone number first");
          return;
        }

        setValue("mobilePhone", mobilePhone, {
          shouldDirty: true,
          shouldValidate: true,
        });

        await dispatch(sendMobileOtp(mobilePhone)).unwrap();
      }
    } catch (error) {
      console.error("OTP send failed:", error);
    }
  };

  const verifyOtp = ({ otp, type }) => {
    if (!otp || otp.length !== 6) {
      alert("Please enter valid OTP");
      return;
    }

    if (type === "email") {
      const email = getValues("email");

      const payload = {
        email,
        otp,
      };

      dispatch(verifyEmailOtp(payload)).unwrap();
    }

    if (type === 'phone') {
      const mobile = getValues('mobilePhone');

      const payload = {
        mobile,
        otp,
      };

      dispatch(verifyMobileOtp(payload)).unwrap();
    }
  };

  const defaultTimetable = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ].map((day, i) => ({ day, index: i }));

  const dayOptions = [
    { label: "Monday", day_of_week: 0 },
    { label: "Tuesday", day_of_week: 1 },
    { label: "Wednesday", day_of_week: 2 },
    { label: "Thursday", day_of_week: 3 },
    { label: "Friday", day_of_week: 4 },
    { label: "Saturday", day_of_week: 5 },
    { label: "Sunday", day_of_week: 6 },
  ];

  const copyToAll = (timetable: any, setValue: any) => {
    const first = timetable[0]; // Monday

    setValue(
      "timetable",
      timetable.map((d: any, i: any) =>
        i === 0
          ? d
          : {
            ...d,
            start_time: first.start_time,
            end_time: first.end_time,
            // isClosed: first.isClosed,
          }
      )
    );
  };

  const baseInput = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-100 disabled:text-slate-500"
  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#16214a]">
            Complete your Doctor Profile
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Let’s get started with your basic information
          </p>
        </div>

        <Image
          src={girl}
          alt="Doctor illustration"
          className="w-[120px] md:w-[150px]"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* EMAIL + PHONE */}
        <div className="flex flex-col items-start gap-6">


          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-[#16214a]">
                  Phone Number
                </h3>
              </div>
              {mobileVerified && (
                <div className="flex items-center gap-1 px-2 py-1 mb-2 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                  <MdOutlineVerified className="text-sm" />
                  Verified
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full">
              {mobileOtpSent ? (
                <OtpInputPreview verifyOtp={(otp) => verifyOtp({ otp, type: 'phone' })} onChangeClick={() => dispatch(setMobileOtpSent(false))} />
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex h-[45px] w-full items-center rounded-xl border border-slate-200 bg-white px-3">
                    <PhoneCall className="mr-2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      {...register("mobilePhone", {
                        required: "Phone is required",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                      })}
                      disabled={mobileVerified}
                    />
                  </div>
                  {
                    mobileVerified ?
                      <div onClick={() => dispatch(setMobileVerified(false))} className="flex items-center justify-center h-[45px] px-4 rounded-xl  bg-blue-50 text-primary cursor-pointer">
                        <CiEdit className="text-xl" />
                      </div>
                      :
                      <button
                        type="button"
                        onClick={() => sendOtp("phone")}
                        className="px-5 h-[45px] rounded-xl bg-primary text-white text-sm font-medium cursor-pointer whitespace-nowrap"
                      >
                        Verify
                      </button>
                  }

                </div>
              )}
            </div>
            {errors.mobilePhone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.mobilePhone.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-[#16214a]">
                  Email Address
                </h3>
              </div>
              {emailVerified && (
                <div className="flex items-center gap-1 px-2 py-1 mb-2 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                  <MdOutlineVerified className="text-sm" />
                  Verified
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full">
              {emailOtpSent ? (
                <OtpInputPreview verifyOtp={(otp) => verifyOtp({ otp, type: 'email' })} onChangeClick={() => dispatch(setEmailOtpSent(false))} />
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex h-[45px] w-full items-center rounded-xl border border-slate-200 bg-white px-3">
                    <Mail className="mr-2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter your professional email"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      {...register("email", { required: "Email is required" })}
                      disabled={emailVerified}
                    />
                  </div>

                  {
                    emailVerified ? (
                      <div onClick={() => dispatch(setEmailVerified(false))} className="flex items-center justify-center h-[45px] px-4 rounded-xl bg-blue-50 text-primary cursor-pointer">
                        <CiEdit className="text-xl" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => sendOtp("email")}
                        className="px-5 h-[45px] rounded-xl bg-primary text-white text-sm font-medium cursor-pointer whitespace-nowrap flex items-center justify-center"
                      >
                        Verify
                      </button>
                    )
                  }
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>


        </div>

        {/* Full Name */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FaUserDoctor className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-[#16214a]">
              Full Name
              <span className="ml-1 text-xs text-slate-500">
                (As per Medical License)
              </span>
            </h3>
          </div>

          <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
            <FaUserDoctor className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              {...register("fullName", { required: "Full Name is required" })}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Gender + DOB */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FaUserDoctor className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">Gender</h3>
            </div>

            <select
              className="flex h-[45px] w-full items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Date of Birth
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <Calendar className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
        </div>

        {/* Specialization + Registration */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <FaUserGraduate className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Specializations
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsSpecOpen((prev) => !prev)}
              className="w-full min-h-[45px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-left"
            >
              <div className="flex flex-wrap gap-2">
                {(watch("specializations") || []).length > 0 ? (
                  specializations
                    ?.filter((item) => (watch("specializations") || []).includes(item.id))
                    .map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {item.name}
                      </span>
                    ))
                ) : (
                  <span className="text-sm text-slate-400">Select specializations</span>
                )}
              </div>
            </button>

            {isSpecOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {specializations?.map((item) => {
                  const selectedValues = watch("specializations") || [];
                  const isSelected = selectedValues.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const current = watch("specializations") || [];

                          if (e.target.checked) {
                            setValue("specializations", [...current, item.id], {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            setValue(
                              "specializations",
                              current.filter((id) => id !== item.id),
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          }
                        }}
                      />

                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          {errors.specializations && (
            <p className="mt-1 text-xs text-red-500">{errors.specializations.message}</p>
          )}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <FaRegIdCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Registration Number
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <FaRegIdCard className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="MCI-12345"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("registrationNumber", {
                  required: "Registration Number is required",
                })}
              />
            </div>
            {errors.registrationNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.registrationNumber.message}</p>
            )}
          </div>
        </div>

        {/* Experience + Fee */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FaUserDoctor className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Experience (Years)
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <FaUserDoctor className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                placeholder="15"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("experience", {
                  required: "Experience is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
              />
            </div>
            {errors.experience && (
              <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <GiTakeMyMoney className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Consultation Fee
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <GiTakeMyMoney className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                placeholder="500"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("consultationFee", {
                  required: "Consultation Fee is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                })}
              />
            </div>
            {errors.consultationFee && (
              <p className="mt-1 text-xs text-red-500">{errors.consultationFee.message}</p>
            )}
          </div>

        </div>

        {/* Clinic Name + Biography */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MdOutlineDriveFileRenameOutline className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Clinic Name
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <MdOutlineDriveFileRenameOutline className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Heart Care Clinic"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("clinicName", { required: "Clinic Name is required" })}
              />
            </div>
            {errors.clinicName && (
              <p className="mt-1 text-xs text-red-500">{errors.clinicName.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Biography
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <FileText className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Experienced cardiologist with 15 years of practice."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("biography", { required: "Biography Name is required" })}
              />
            </div>
            {errors.biography && (
              <p className="mt-1 text-xs text-red-500">{errors.biography.message}</p>
            )}
          </div>
        </div>

        {/* Clinic Address */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LuMapPinned className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Clinic Address
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <LuMapPinned className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="123 Main St"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("clinicAddress", { required: "Clinic Address is required" })}
              />
            </div>
            {errors.clinicAddress && (
              <p className="mt-1 text-xs text-red-500">{errors.clinicAddress.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <PiCity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Clinic City
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <PiCity className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mumbai"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("clinicCity", { required: "Clinic City is required" })}
              />
            </div>
            {errors.clinicCity && (
              <p className="mt-1 text-xs text-red-500">{errors.clinicCity.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MdOutlineLocationOn className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Clinic Pincode
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <MdOutlineLocationOn className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="400001"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("clinicPincode", { required: "Clinic Pincode is required" })}
              />
            </div>
            {errors.clinicPincode && (
              <p className="mt-1 text-xs text-red-500">{errors.clinicPincode.message}</p>
            )}
          </div>
        </div>

        {/* Personal Address */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Address Line 1
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <MapPin className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="789 Doctors Colony"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("addressLine1", { required: "AddressLine1 is required" })}
              />
            </div>
            {errors.addressLine1 && (
              <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <PiCity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">City</h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <PiCity className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mumbai"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("city", { required: "City is required" })}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MdOutlineLocationOn className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Postal Code
              </h3>
            </div>

            <div className="flex h-[45px] items-center rounded-xl border border-slate-200 bg-white px-3">
              <MdOutlineLocationOn className="mr-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="400002"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                {...register("postalCode", { required: "Postal code is required" })}
              />
            </div>
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-500">{errors.postalCode.message}</p>
            )}
          </div>

        </div>

        {/* Services + Symptoms */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <FaUserGraduate className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Services
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsServiceOpen((prev) => !prev)}
              className="w-full min-h-[45px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-left"
            >
              <div className="flex flex-wrap gap-2">
                {(watch("services") || []).length > 0 ? (
                  services
                    ?.filter((item) => (watch("services") || []).includes(item.id))
                    .map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {item.name}
                      </span>
                    ))
                ) : (
                  <span className="text-sm text-slate-400">Select Services</span>
                )}
              </div>
            </button>

            {isServiceOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {services?.map((item) => {
                  const selectedValues = watch("services") || [];
                  const isSelected = selectedValues.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const current = watch("services") || [];

                          if (e.target.checked) {
                            setValue("services", [...current, item.id], {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            setValue(
                              "services",
                              current.filter((id) => id !== item.id),
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          }
                        }}
                      />

                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <FaUserGraduate className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-[#16214a]">
                Symptoms
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsSympOpen((prev) => !prev)}
              className="w-full min-h-[45px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-left"
            >
              <div className="flex flex-wrap gap-2">
                {(watch("symptoms") || []).length > 0 ? (
                  symptoms
                    ?.filter((item) => (watch("symptoms") || []).includes(item.id))
                    .map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {item.name}
                      </span>
                    ))
                ) : (
                  <span className="text-sm text-slate-400">Select Symptoms</span>
                )}
              </div>
            </button>

            {isSympOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {symptoms?.map((item) => {
                  const selectedValues = watch("symptoms") || [];
                  const isSelected = selectedValues.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const current = watch("symptoms") || [];

                          if (e.target.checked) {
                            setValue("symptoms", [...current, item.id], {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            setValue(
                              "symptoms",
                              current.filter((id) => id !== item.id),
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          }
                        }}
                      />

                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto overscroll-x-contain scrollbar-thin px-4">
          <div label="" id="timetable" >
            {/* Header actions */}
            <div className="flex justify-between items-center">
              <div className="">Business Timings <span className="text-red-500">*</span></div>
              <div className="flex items-center justify-between mb-3 hidden sm:inline">
                <button
                  type="button"
                  onClick={() => copyToAll(watch("timetable"), setValue)}
                  className="text-sm flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-700 font-medium  "
                >
                  <IoMdCopy /> <span >copy Monday's timings to all</span>
                </button>
              </div>
            </div>


            {/* Table wrapper */}
            <div className="relative -mx-4 sm:mx-0">
              <div className=" rounded-xl sm:border border-slate-200 bg-white">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-700">
                      <th className="px-4 py-3 font-semibold">Day</th>
                      <th className="px-4 py-3 font-semibold">Starting Time</th>
                      <th className="px-4 py-3 font-semibold">End Time</th>
                      <th className="px-4 py-3 font-semibold text-right">open</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {defaultTimetable.map((d, i) => {
                      const is_active = !watch(`timetable.${i}.is_active`)

                      return (
                        <tr key={d.day} className="text-sm">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <input
                              type="hidden"
                              value={i}
                              {...register(`timetable.${i}.day_of_week`, { valueAsNumber: true })}
                            />
                            {dayOptions[d.day] ?? d.day}
                          </td>

                          <td className="px-4 py-3">
                            <input
                              type="time"
                              className={baseInput + (is_active ? " opacity-60" : "")}
                              disabled={is_active}
                              {...register(`timetable.${i}.start_time`, {
                                validate: (v) => (is_active ? true : !!v || "Opening time is required"),
                              })}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              type="time"
                              className={baseInput + (is_active ? " opacity-60" : "")}
                              disabled={is_active}
                              {...register(`timetable.${i}.end_time`, {
                                validate: (v) => (is_active ? true : !!v || "Closing time is required"),
                              })}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end items-center gap-2">
                              <span className="text-xs text-slate-600">{is_active ? "no" : "yes"}</span>
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary cursor-pointer"
                                {...register(`timetable.${i}.is_active`, {
                                  onChange: (e) => {
                                    if (e.target.checked) {
                                      setValue(`timetable.${i}.start_time`, "")
                                      setValue(`timetable.${i}.end_time`, "")
                                    }
                                  },
                                })}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 sm:hidden">
          Swipe horizontally to see all columns
        </p>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white cursor-pointer"
        // disabled={!emailVerified || !mobileVerified}
        >
          Continue
        </button>
      </form>
    </div>
  );
}