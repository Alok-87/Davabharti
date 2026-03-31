"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { useMemo, useState, useEffect } from "react"
import type { BasicDetailsPayload } from "@/features/onboarding/types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { IoMdCopy } from "react-icons/io";
import { BiSolidError } from "react-icons/bi";
import {
    sendMobileOtp,
    verifyMobileOtp,
    sendEmailOtp,
    verifyEmailOtp,
    submitStep1,
    submitStep2,
    submitStep3,
    verifyDocument,
    verifyBank,
    initiateAadhaarVerification,
    completeAadhaarVerification
} from "@/features/onboarding/onboardingThunks"
import {
    setVendorId,
    setCurrentStep,
    setMobileVerified,
    setEmailVerified,
    setMobileOtpSent,
    setEmailOtpSent
} from "@/features/onboarding/onboardingSlice"
import { IoPencil, IoCheckmarkCircle } from "react-icons/io5"
import { unwrapResult } from "@reduxjs/toolkit"
import InputOTP from "@/components/ui/input-otp"
import Stepper from "./Stepper"
import { Toast } from "@/components/ui/toast"

type DocumentType = "PAN" | "AADHAR" | "GST" | "DRUG_LICENSE";

interface VendorDocument {
    document_type: DocumentType;
    document_number: string;
    file_url: string;
    state_code?: string; // Added for Drug License
    valid_from?: string;
    valid_to?: string;
    verification_status?: string;
}

interface BankAccount {
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    is_primary?: boolean;
    verification_status?: string;
}

type TimetableDay = {
    day: string;
    open_time?: string;
    close_time?: string;
    isClosed?: boolean;
};

type FormValues = BasicDetailsPayload & {
    mobileOtp?: string;
    emailOtp?: string;
    alternateMobile?: string;
    alternateEmail?: string;
    referralSource?: string;
    otherInfo?: string;
    businessAddress?: string; // mapped to address
    country?: string;

    // Step 2 & 3
    documents: VendorDocument[];
    bank_accounts: BankAccount[];

    // Step 4 (Timetable)
    timetable?: TimetableDay[];
};


const STEPS = [
    "Basic Details",
    "Documents",
    "Bank Details",
    "Under Review",
    "Approved",
    "Agreement sent",
    "Agreement signed",
    "Active"
];

function VerifiedPill() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            <IoCheckmarkCircle className="text-sm" /> Verified
        </span>
    )
}

function Field({
    label,
    id,
    required,
    error,
    children,
    hint,
}: {
    label: string
    id: string
    required?: boolean
    error?: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
                {required ? <span className="text-rose-500"> *</span> : null}
            </label>
            {children}
            {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
    )
}

const baseInput =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-100 disabled:text-slate-500"
const baseBtn =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
const outlineBtn = baseBtn + " border border-slate-300 hover:bg-slate-50 text-slate-700"
const solidBtn = baseBtn + " bg-primary text-white hover:bg-orange-600"

// ===============================
// Validators
// ===============================
const patterns = {
    email: /^\S+@\S+\.\S+$/i,
    phone10: /^\d{10}$/,
    pincode6: /^\d{6}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    aadhar: /^\d{12}$/,
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    accountNumber: /^[0-9]{9,18}$/,
}

const isFutureDate = (val?: string) => {
    if (!val) return true
    const d = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d.getTime() > today.getTime() || "Expiry date must be in the future"
}

const getDocNumberRules = (type: DocumentType) => {
    if (type === "PAN") {
        return {
            required: "PAN is required",
            pattern: { value: patterns.pan, message: "Invalid PAN (e.g. ABCDE1234F)" },
        }
    }
    if (type === "AADHAR") {
        return {
            required: "Aadhar is required",
            pattern: { value: patterns.aadhar, message: "Invalid Aadhar (12 digits)" },
        }
    }
    if (type === "GST") {
        return {
            required: "GSTIN is required",
            pattern: { value: patterns.gstin, message: "Invalid GSTIN" },
        }
    }
    // DRUG_LICENSE
    return {
        required: "Drug License number is required",
        minLength: { value: 5, message: "Minimum 5 characters" },
    }
}

export default function OnboardingForm() {
    const dispatch = useAppDispatch()
    const {
        mobileOtpSent,
        emailOtpSent,
        mobileVerified,
        emailVerified,
        vendorId,
        currentStep,
        vendorData,
        loading
    } = useAppSelector((state) => state.onboarding)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        setError,
        trigger,
        watch
    } = useForm<FormValues>({
        mode: "onBlur",
        defaultValues: {
            country: "India",
            documents: [
                { document_type: "PAN", document_number: "", file_url: "mock_url" },
                { document_type: "AADHAR", document_number: "", file_url: "mock_url" },
                { document_type: "GST", document_number: "", file_url: "mock_url" },
                { document_type: "DRUG_LICENSE", document_number: "", file_url: "mock_url", state_code: "" },
            ],
            bank_accounts: [
                { account_number: "", ifsc_code: "", bank_name: "", account_holder_name: "" }
            ]
        }
    })

    // Local state for doc/bank verification
    const [docVerified, setDocVerified] = useState<Record<string, boolean>>({
        PAN: false, AADHAR: false, GST: false, DRUG_LICENSE: false
    })
    const [bankVerified, setBankVerified] = useState(false)

    const watchedEmailOtp = watch("emailOtp")
    const watchedMobileOtp = watch("mobileOtp")

    // Sync Redux Data to Form
    useEffect(() => {
        if (vendorData) {
            const v = vendorData
            setValue("owner_name", v.owner_name || "")
            setValue("business_name", v.business_name || "")
            setValue("phone", v.phone || "")
            setValue("address", v.address || "")
            setValue("city", v.city || "")
            setValue("state", v.state || "")
            setValue("pincode", v.pincode || "")
            setValue("shop_open_time", v.shop_open_time || "")
            setValue("shop_close_time", v.shop_close_time || "")
            setValue("product_type", v.product_type || "BOTH")
            setValue("seller_type", v.seller_type || "RETAIL")

            // Map Docs
            if (v.documents) {
                const newDocs = getValues("documents").map(d => {
                    const found = v.documents.find((vd: any) => vd.document_type === d.document_type)
                    if (found) {
                        setDocVerified(prev => ({ ...prev, [d.document_type]: true }))
                        return {
                            ...d,
                            document_number: found.document_number,
                            valid_to: found.valid_to ? found.valid_to.split("T")[0] : undefined
                        }
                    }
                    return d
                })
                setValue("documents", newDocs)
            }

            // Map Bank
            if (v.bank_accounts && v.bank_accounts.length > 0) {
                const bank = v.bank_accounts[0]
                setValue("bank_accounts.0.account_number", bank.account_number)
                setValue("bank_accounts.0.ifsc_code", bank.ifsc_code)
                setValue("bank_accounts.0.bank_name", bank.bank_name)
                setValue("bank_accounts.0.account_holder_name", bank.account_holder_name)
                setBankVerified(true)
            }

            // Determine Step
            let step = 1
            switch (v.status) {
                case "BASICDETAILS_SUBMITTED": step = 2; break
                case "DOCUMENTS_SUBMITTED": step = 3; break
                case "BANKDETAILS_SUBMITTED":
                case "SUBMITTED":
                case "UNDER_REVIEW":
                    step = 4; break
                case "APPROVED": step = 5; break
                case "AGREEMENT_SENT": step = 6; break
                case "AGREEMENT_SIGNED": step = 7; break
                case "ACTIVE": step = 8; break
                default: step = 1
            }
            dispatch(setCurrentStep(step))
        }
    }, [vendorData, setValue, dispatch, getValues])

    // --- STEP 1 ---

    const sendMobileOtpHandler = async () => {
        const isValid = await trigger("phone")
        if (!isValid) return
        const mobile = getValues("phone")

        try {
            await dispatch(sendMobileOtp(mobile)).unwrap()
            Toast("OTP Sent to Mobile")
        } catch (e: any) {
            Toast(e || "Failed to send OTP")
        }
    }

    const verifyMobileOtpHandler = async () => {
        const mobile = getValues("phone")
        const otp = getValues("mobileOtp")
        if (!otp || otp.length !== 6) return setError("mobileOtp", { message: "Invalid OTP" })

        try {
            await dispatch(verifyMobileOtp({ mobile, otp })).unwrap()
            Toast("Mobile Verified")
            setValue("mobileOtp", "")
            dispatch(setMobileOtpSent(false));
        } catch (e: any) {
            setError("mobileOtp", { message: e || "Invalid OTP" })
        }
    }

    const sendEmailOtpHandler = async () => {
        const isValid = await trigger("email")
        if (!isValid) return
        const email = getValues("email")
        try {
            await dispatch(sendEmailOtp(email)).unwrap()
            Toast("OTP Sent to Email")
        } catch (e: any) {
            Toast(e || "Failed to send OTP")
        }
    }

    const verifyEmailOtpHandler = async () => {
        const email = getValues("email")
        const otp = getValues("emailOtp")
        if (!otp || otp.length !== 6) return setError("emailOtp", { message: "Invalid OTP" })

        try {
            const res = await dispatch(verifyEmailOtp({ email, otp })).unwrap()

            if (res.vendor) {
                Toast(`Welcome back! Current Status: ${res.vendor.status}`)
            } else {
                Toast("Email Verified")
            }
            // ✅ clear OTP field after successful verification
            setValue("emailOtp", "")
            dispatch(setEmailOtpSent(false));
        } catch (e: any) {
            setError("emailOtp", { message: e || "Invalid OTP" })
        }
    }

    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle")
    const [locationError, setLocationError] = useState<string | null>(null)

    const fetchLocation = async (): Promise<{ lat: number; lng: number } | null> => {
        setLocationStatus("requesting")
        setLocationError(null)

        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.error("Geolocation not supported by this browser.")
                setLocationStatus("error")
                setLocationError("Geolocation is not supported by your browser.")
                resolve(null)
                return
            }

            const success = (pos: GeolocationPosition) => {
                const newLat = pos.coords.latitude
                const newLng = pos.coords.longitude
                setLat(newLat)
                setLng(newLng)
                setLocationStatus("granted")
                resolve({ lat: newLat, lng: newLng })
            }

            const error = (err: GeolocationPositionError) => {
                console.error("Location error:", err)
                setLocationStatus("denied")
                if (err.code === err.PERMISSION_DENIED) {
                    setLocationError("Location access denied. Please enable location services in your browser settings to proceed.")
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setLocationError("Location information is unavailable. Please try again later.")
                } else if (err.code === err.TIMEOUT) {
                    setLocationError("The request to get user location timed out.")
                } else {
                    setLocationError("An unknown error occurred while fetching your location.")
                }
                resolve(null)
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }

            navigator.geolocation.getCurrentPosition(success, error, options)
        })
    }


    useEffect(() => {
        fetchLocation()
    }, [])

    const onSubmitStep1 = async (data: FormValues) => {
        if (!mobileVerified || !emailVerified) {
            return Toast("Please verify both Mobile and Email.")
        }

        let currentLat = lat
        let currentLng = lng

        if (locationStatus !== "granted" || currentLat === null || currentLng === null) {
            const locationResult = await fetchLocation()
            if (!locationResult) return
            currentLat = locationResult.lat
            currentLng = locationResult.lng
        }

        try {
            const payload = {
                ...data,
                address: data.businessAddress || data.address,
                lat: currentLat,
                lng: currentLng,
            }
            console.log("payload", payload);
            const res = await dispatch(submitStep1(payload)).unwrap();
            dispatch(setVendorId(res.id || res.data?.id));
            dispatch(setCurrentStep(2));
        } catch (e) {
            Toast("Something went wrong saving details.")
        }
    }

    // --- STEP 2 ---

    const verifyDoc = async (index: number) => {
        const doc = getValues("documents")[index]

        // --- AADHAAR FLOW (Digiboost SDK) ---
        if (doc.document_type === "AADHAR") {
            if (!vendorId) return Toast("Vendor ID missing. Complete previous steps.");

            // Validate Aadhaar number is filled
            if (!doc.document_number) return Toast("Enter Aadhaar Number");
            if (doc.document_number.length !== 12) return Toast("Aadhaar number must be 12 digits");

            try {
                // 1. Initiate Verification (Get Token)
                const res = await dispatch(initiateAadhaarVerification({ vendor_id: vendorId })).unwrap()
                const { token, client_id } = res.data;

                // 2. Initialize SDK
                // @ts-ignore
                if (window.DigiboostSdk) {
                    // @ts-ignore
                    window.DigiboostSdk({
                        gateway: "sandbox",
                        token: token,
                        selector: `#digilocker-button-${index}`,
                        style: {
                            backgroundColor: "#ea580c", // matches solidBtn (primary/orange-600)
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease"
                        },
                        onSuccess: async (data: any) => {
                            console.log("Digiboost Success:", data);
                            try {
                                // 3. Complete Verification
                                const completeRes = await dispatch(completeAadhaarVerification({
                                    vendor_id: vendorId,
                                    client_id: client_id
                                })).unwrap();

                                // Update form with verified number
                                const verifiedNum = completeRes.data?.document_number;
                                if (verifiedNum) {
                                    setValue(`documents.${index}.document_number`, verifiedNum);
                                }

                                setDocVerified(prev => ({ ...prev, AADHAR: true }));
                                Toast("Aadhaar Verified Successfully");
                            } catch (err: any) {
                                Toast(err || "Failed to complete Aadhaar verification");
                            }
                        },
                        onFailure: (error: any) => {
                            console.error("Digiboost Failure:", error);
                            Toast("Aadhaar Verification Failed or Cancelled");
                        }
                    });

                    // Hide the generic verify button by setting a local state trigger if needed,
                    // but the SDK injects into the selector. We should ensure the container exists.
                    // For now, we'll let the "Verify" button stay or replace it?
                    // Let's toggle a state to show the container and hide 'Verify'.
                    document.getElementById(`aadhaar-action-${index}`)?.classList.add("hidden");
                    document.getElementById(`digilocker-button-${index}`)?.classList.remove("hidden");
                } else {
                    Toast("SDK not loaded yet. Please wait.");
                }
            } catch (e: any) {
                Toast(e || "Failed to initiate Aadhaar verification");
            }
            return;
        }

        // --- STANDARD FLOW ---
        const ok = await trigger([
            `documents.${index}.document_number` as const,
            `documents.${index}.valid_to` as const,
            `documents.${index}.state_code` as const, // Validate state_code
        ])
        if (!ok) return

        if (!doc.document_number) return Toast("Enter Document Number")
        if (doc.document_type === "DRUG_LICENSE") {
            if (!doc.valid_to) return Toast("Enter Expiry Date")
            if (!doc.state_code) return Toast("Select State Code")
        }

        try {
            await dispatch(verifyDocument({
                vendor_id: vendorId,
                document_type: doc.document_type,
                document_number: doc.document_number,
                valid_to: doc.valid_to,
                state_code: doc.state_code, // Pass state code
                file_url: doc.file_url // Pass file_url if available
            })).unwrap()

            setDocVerified(prev => ({ ...prev, [doc.document_type]: true }))
        } catch (e) {
            Toast("Verification Failed")
        }
    }

    const onSubmitStep2 = async () => {
        const required = ["PAN", "AADHAR", "GST", "DRUG_LICENSE"]
        const missing = required.filter(type => !docVerified[type])

        if (missing.length > 0) {
            return Toast(`Please verify: ${missing.join(", ")}`)
        }

        try {
            const docs = getValues("documents")
            await dispatch(submitStep2({
                vendor_id: vendorId,
                documents: docs
            })).unwrap()
            dispatch(setCurrentStep(3))
        } catch (e) {
            Toast("Error submitting documents")
        }
    }

    // --- STEP 3 ---

    const verifyBankDetail = async () => {
        const ok = await trigger([
            "bank_accounts.0.account_number",
            "bank_accounts.0.ifsc_code",
            "bank_accounts.0.bank_name",
            "bank_accounts.0.account_holder_name",
        ])
        if (!ok) return

        const bank = getValues("bank_accounts.0")
        if (!bank.account_number || !bank.ifsc_code || !bank.bank_name) return Toast("Enter Account No, IFSC and Bank Name")

        try {
            await dispatch(verifyBank({
                vendor_id: vendorId,
                account_number: bank.account_number,
                ifsc_code: bank.ifsc_code,
                bank_name: bank.bank_name,
                account_holder_name: bank.account_holder_name
            })).unwrap()
            setBankVerified(true)
        } catch (e) {
            Toast("Bank Verification Failed")
        }
    }

    const onSubmitStep3 = async () => {
        if (!bankVerified) return Toast("Please verify Bank Details")

        try {
            const bank = getValues("bank_accounts")
            await dispatch(submitStep3({
                vendor_id: vendorId,
                bank_accounts: bank
            })).unwrap()
            dispatch(setCurrentStep(4))
            Toast("Application Submitted Successfully!")
        } catch (e) {
            Toast("Error submitting bank details")
        }
    }


    const defaultTimetable = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].map(day => ({ day }));

    const copyToAll = (timetable: any, setValue: any) => {
        const first = timetable[0]; // Monday

        setValue(
            "timetable",
            timetable.map((d: any, i: any) =>
                i === 0
                    ? d
                    : {
                        ...d,
                        open_time: first.open_time,
                        close_time: first.close_time,
                        // isClosed: first.isClosed,
                    }
            )
        );
    };

    const dayLabel: Record<string, string> = {
        MONDAY: "Monday",
        TUESDAY: "Tuesday",
        WEDNESDAY: "Wednesday",
        THURSDAY: "Thursday",
        FRIDAY: "Friday",
        SATURDAY: "Saturday",
        SUNDAY: "Sunday",
    };

    const formatDocumentValue = (value: string, type: string) => {
        if (!value) return value;

        switch (type) {
            case "AADHAR":
                // Only numbers, max 12 digits
                return value.replace(/\D/g, "").slice(0, 12);

            case "GST":
                // Capital letters + numbers, max 15 chars
                return value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 15);

            case "PAN":
                // Auto capital, max 10 chars
                return value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 10);

            default:
                return value;
        }
    };



    return (
        <div className="w-full flex flex-col gap-3">
            {/* Digiboost SDK */}
            <script src="https://cdn.jsdelivr.net/gh/surepassio/surepass-digiboost-web-sdk@latest/index.min.js" async></script>

            <div className="w-full overflow-x-scroll  px-2 sm:px-4 md:px-6">
                <div className="min-w-max">
                    <Stepper currentStep={currentStep} steps={STEPS} />
                </div>
            </div>
            {/* Optional: hint on mobile only */}
            <div className="mt-2 text-center text-[11px] text-slate-400 sm:hidden">
                Swipe to see all steps
            </div>

            <form onSubmit={handleSubmit(currentStep === 1 ? onSubmitStep1 : currentStep === 2 ? onSubmitStep2 : onSubmitStep3)}>

                {/* === STEP 1: BASIC DETAILS === */}
                {currentStep === 1 && (
                    <div className="grid gap-6">
                        <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 space-y-4">
                            <h3 className="font-semibold text-slate-900">Contact Information</h3>

                            {/* Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                                <Field label="Email" id="email" required error={errors.email?.message as string}>
                                    <div className="flex gap-2">
                                        <input
                                            {...register("email", {
                                                required: "email is required",
                                                pattern: { value: patterns.email, message: "Invalid email" },
                                            })}
                                            className={baseInput}
                                            placeholder="vendor@example.com"
                                            disabled={emailVerified}
                                        />
                                        {!emailVerified ? (
                                            emailOtpSent ? (
                                                <button
                                                    type="button"
                                                    onClick={() => dispatch(setEmailOtpSent(false))}
                                                    className={outlineBtn}
                                                >
                                                    Change
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={sendEmailOtpHandler}
                                                    disabled={loading}
                                                    className={solidBtn}
                                                >
                                                    {loading ? "..." : "Verify"}
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    dispatch(setEmailVerified(false))
                                                    dispatch(setVendorId(null))
                                                }}
                                                className="p-2 text-slate-500 hover:text-primary"
                                            >
                                                <IoPencil />
                                            </button>
                                        )}
                                    </div>
                                    {emailVerified && <VerifiedPill />}
                                </Field>

                                {emailOtpSent && !emailVerified && (
                                    <div className="flex flex-col gap-3 mt-3 md:mt-0 p-4 md:p-5 lg:p-6 rounded-lg bg-blue-50 border border-orange-100">
                                        <label className="text-sm font-medium text-orange-900">
                                            Enter OTP sent to your email
                                        </label>

                                        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 items-center">
                                            <InputOTP
                                                value={watchedEmailOtp || ""}
                                                onChange={(val) => setValue("emailOtp", val)}
                                                disabled={loading}
                                            />

                                            <button
                                                type="button"
                                                onClick={verifyEmailOtpHandler}
                                                disabled={loading || watchedEmailOtp?.length !== 6}
                                                className={solidBtn + " w-full md:w-auto h-10 md:h-12"}
                                            >
                                                Confirm OTP
                                            </button>
                                        </div>

                                        {errors.emailOtp?.message ? (
                                            <p className="text-sm text-rose-600">{String(errors.emailOtp.message)}</p>
                                        ) : null}
                                    </div>
                                )}
                            </div>


                            {/* Mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Mobile" id="phone" required error={errors.phone?.message as string}>
                                    <div className="flex gap-2">
                                        <input
                                            {...register("phone", {
                                                required: "phone is required",
                                                pattern: { value: patterns.phone10, message: "Enter 10 digit mobile number" },
                                            })}
                                            className={baseInput}
                                            placeholder="9876543210"
                                            disabled={mobileVerified}
                                        />
                                        {!mobileVerified ? (
                                            mobileOtpSent ? (
                                                <button type="button" onClick={() => dispatch(setMobileOtpSent(false))} className={outlineBtn}>Change</button>
                                            ) : (
                                                <button type="button" onClick={sendMobileOtpHandler} disabled={loading} className={solidBtn}>
                                                    {loading ? "..." : "Verify"}
                                                </button>
                                            )
                                        ) : (
                                            <button type="button" onClick={() => dispatch(setMobileVerified(false))} className="p-2 text-slate-500 hover:text-primary"><IoPencil /></button>
                                        )}
                                    </div>
                                    {mobileVerified && <VerifiedPill />}
                                </Field>

                                {mobileOtpSent && !mobileVerified && (
                                    <div className="flex  flex-col gap-3 w-full mt-4 p-4 rounded-lg bg-blue-50 border border-orange-100">
                                        <label className="text-sm font-medium text-orange-900">Enter OTP sent to your mobile</label>
                                        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 items-center ">
                                            <InputOTP
                                                value={watchedMobileOtp || ""}
                                                onChange={(val) => setValue("mobileOtp", val)}
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={verifyMobileOtpHandler}
                                                disabled={loading || (watchedMobileOtp?.length !== 6)}
                                                className={solidBtn + " w-full md:w-auto h-10 md:h-12"}
                                            >
                                                Confirm OTP
                                            </button>
                                        </div>
                                        {errors.mobileOtp?.message ? <p className="text-sm text-rose-600">{String(errors.mobileOtp.message)}</p> : null}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Owner Name" id="owner_name" required error={errors.owner_name?.message as string}>
                                <input
                                    {...register("owner_name", {
                                        required: "owner name in required",
                                        minLength: { value: 2, message: "Minimum 2 characters" },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                            <Field label="Business Name" id="business_name" required error={errors.business_name?.message as string}>
                                <input
                                    {...register("business_name", {
                                        required: "business name is required",
                                        minLength: { value: 2, message: "Minimum 2 characters" },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                        </div>

                        <Field label="Business Address" id="businessAddress" required error={errors.businessAddress?.message as string}>
                            <textarea
                                {...register("businessAddress", {
                                    required: "business address in required",
                                    minLength: { value: 10, message: "Enter full address (min 10 chars)" },
                                })}
                                className={baseInput}
                                rows={3}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City" id="city" required error={errors.city?.message as string}>
                                <input
                                    {...register("city", {
                                        required: "city is required",
                                        minLength: { value: 2, message: "Minimum 2 characters" },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                            <Field label="State" id="state" required error={errors.state?.message as string}>
                                <input
                                    {...register("state", {
                                        required: "state is required",
                                        minLength: { value: 2, message: "Minimum 2 characters" },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                            <Field label="Pincode" id="pincode" required error={errors.pincode?.message as string}>
                                <input
                                    {...register("pincode", {
                                        required: "pincode is required",
                                        pattern: { value: patterns.pincode6, message: "Enter 6 digit pincode" },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                            <Field label="Country" id="country" required error={errors.country?.message as string}>
                                <input {...register("country", { required: "country is required" })} className={baseInput} />
                            </Field>
                        </div>

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Shop Open Time" id="shop_open_time" required error={errors.shop_open_time?.message as string}>
                                <input
                                    type="time"
                                    {...register("shop_open_time", {
                                        required: "enter shop open time",
                                        validate: () => {
                                            const open = getValues("shop_open_time")
                                            const close = getValues("shop_close_time")
                                            if (!open || !close) return true
                                            return open < close || "Open time must be before close time"
                                        },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                            <Field label="Shop Close Time" id="shop_close_time" required error={errors.shop_close_time?.message as string}>
                                <input
                                    type="time"
                                    {...register("shop_close_time", {
                                        required: "enter shop close time",
                                        validate: () => {
                                            const open = getValues("shop_open_time")
                                            const close = getValues("shop_close_time")
                                            if (!open || !close) return true
                                            return open < close || "Close time must be after open time"
                                        },
                                    })}
                                    className={baseInput}
                                />
                            </Field>
                        </div> */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Seller Type" id="seller_type" required error={errors.seller_type?.message as string}>
                                <select {...register("seller_type", { required: "Required" })} className={baseInput}>
                                    <option value="RETAIL">Retail</option>
                                    <option value="WHOLESALE">Wholesale</option>
                                    <option value="MANUFACTURER">Manufacturer</option>
                                </select>
                            </Field>
                            <Field label="Product Type" id="product_type" required error={errors.product_type?.message as string}>
                                <select {...register("product_type", { required: "Required" })} className={baseInput}>
                                    <option value="BOTH">Both (Rx & OTC)</option>
                                    <option value="RX">Rx Only</option>
                                    <option value="OTC">OTC Only</option>
                                </select>
                            </Field>
                        </div>

                        {/* ✅ scroll must be HERE */}
                        <div className="overflow-x-auto overscroll-x-contain scrollbar-thin px-4">
                            <Field label="" id="timetable" >
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
                                                    <th className="px-4 py-3 font-semibold">Opening Time</th>
                                                    <th className="px-4 py-3 font-semibold">Closing Time</th>
                                                    <th className="px-4 py-3 font-semibold text-right">Closed</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-200">
                                                {defaultTimetable.map((d, i) => {
                                                    const closed = !!watch(`timetable.${i}.isClosed`)

                                                    return (
                                                        <tr key={d.day} className="text-sm">
                                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                                <input
                                                                    type="hidden"
                                                                    value={d.day}
                                                                    {...register(`timetable.${i}.day`)}
                                                                />
                                                                {dayLabel[d.day] ?? d.day}
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="time"
                                                                    className={baseInput + (closed ? " opacity-60" : "")}
                                                                    disabled={closed}
                                                                    {...register(`timetable.${i}.open_time`, {
                                                                        validate: (v) => (closed ? true : !!v || "Opening time is required"),
                                                                    })}
                                                                />
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="time"
                                                                    className={baseInput + (closed ? " opacity-60" : "")}
                                                                    disabled={closed}
                                                                    {...register(`timetable.${i}.close_time`, {
                                                                        validate: (v) => (closed ? true : !!v || "Closing time is required"),
                                                                    })}
                                                                />
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-end items-center gap-2">
                                                                    <span className="text-xs text-slate-600">{closed ? "Yes" : "No"}</span>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 accent-primary cursor-pointer"
                                                                        {...register(`timetable.${i}.isClosed`, {
                                                                            onChange: (e) => {
                                                                                if (e.target.checked) {
                                                                                    setValue(`timetable.${i}.open_time`, "")
                                                                                    setValue(`timetable.${i}.close_time`, "")
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



                            </Field>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 sm:hidden">
                            Swipe horizontally to see all columns
                        </p>

                        <div className="flex justify-end pt-4">

                            <button
                                type="submit"
                                disabled={loading || !mobileVerified || !emailVerified || lat == null}
                                className={solidBtn + " w-full md:w-auto px-8 cursor-pointer"}
                            >
                                {loading ? "Saving..." : "Next Step"}
                            </button>
                        </div>

                        {locationError && (
                            <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <span className="flex items-start sm:items-center gap-2 max-w-full">
                                    <BiSolidError className="text-red-600 text-base sm:text-lg md:text-xl shrink-0" />

                                    <span className="text-xs sm:text-sm md:text-base break-words">
                                        {locationError}
                                    </span>
                                </span>


                                <button
                                    onClick={fetchLocation}
                                    className="rounded-md bg-red-600 px-3 py-1 cursor-pointer text-white text-xs font-medium hover:bg-red-700 transition"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                    </div>
                )}

                {/* === STEP 2: DOCUMENTS === */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getValues("documents").map((doc, index) => {
                                const docNumberErr = (errors.documents?.[index]?.document_number?.message as string) || ""
                                const validToErr = (errors.documents?.[index]?.valid_to?.message as string) || ""
                                const rules = getDocNumberRules(doc.document_type)

                                return (
                                    <div key={doc.document_type} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-slate-800">{doc.document_type.replace("_", " ")}</h4>
                                            {docVerified[doc.document_type] && <IoCheckmarkCircle className="text-emerald-500 text-xl" />}
                                        </div>

                                        <div className="space-y-3">
                                            <Field
                                                label="Document Number"
                                                id={`doc_${index}`}
                                                required
                                                error={docNumberErr}
                                            >
                                                <input
                                                    {...register(`documents.${index}.document_number` as const, {
                                                        onChange: (e) => {
                                                            e.target.value = formatDocumentValue(
                                                                e.target.value,
                                                                doc.document_type
                                                            );
                                                        },
                                                    })}
                                                    className={`${baseInput} uppercase`}
                                                    disabled={docVerified[doc.document_type]}
                                                    placeholder={
                                                        doc.document_type === "PAN"
                                                            ? "ABCDE1234F"
                                                            : doc.document_type === "AADHAR"
                                                                ? "12 digit Aadhar"
                                                                : doc.document_type === "GST"
                                                                    ? "GSTIN (15 characters)"
                                                                    : "Drug License Number"
                                                    }
                                                />
                                            </Field>


                                            {/* Drug License State Code & Expiry */}
                                            {doc.document_type === "DRUG_LICENSE" && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field label="State Code" id={`state_${index}`} required error={(errors.documents?.[index] as any)?.state_code?.message}>
                                                        <select
                                                            {...register(`documents.${index}.state_code` as const, { required: "State code required" })}
                                                            className={baseInput}
                                                            disabled={docVerified[doc.document_type]}
                                                        >
                                                            <option value="">Select State</option>
                                                            {/* Common State Codes */}
                                                            {["AP", "AR", "AS", "BR", "CG", "GA", "GJ", "HR", "HP", "JH", "KA", "KL", "MP", "MH", "MN", "ML", "MZ", "NL", "OD", "PB", "RJ", "SK", "TN", "TS", "TR", "UP", "UK", "WB", "DL", "JK"].map(code => (
                                                                <option key={code} value={code}>{code}</option>
                                                            ))}
                                                        </select>
                                                    </Field>

                                                    <Field label="Expiry Date" id={`exp_${index}`} required error={validToErr}>
                                                        <input
                                                            type="date"
                                                            {...register(`documents.${index}.valid_to` as const, {
                                                                required: "Expiry date is required",
                                                                validate: isFutureDate,
                                                            })}
                                                            className={baseInput}
                                                            disabled={docVerified[doc.document_type]}
                                                            onKeyDown={(e) => e.preventDefault()}
                                                            onPaste={(e) => e.preventDefault()}
                                                        />
                                                    </Field>
                                                </div>
                                            )}

                                            {!docVerified[doc.document_type] && (
                                                <div className="mt-2">
                                                    {doc.document_type === 'AADHAR' ? (
                                                        <>
                                                            <div id={`aadhaar-action-${index}`}>
                                                                <button type="button" onClick={() => verifyDoc(index)} disabled={loading} className={outlineBtn + " w-full"}>
                                                                    Verify with Digilocker
                                                                </button>
                                                            </div>
                                                            <div id={`digilocker-button-${index}`} className="hidden"></div>
                                                        </>
                                                    ) : (
                                                        <button type="button" onClick={() => verifyDoc(index)} disabled={loading} className={outlineBtn + " w-full"}>
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-end pt-4 gap-3">
                            <button onClick={() => dispatch(setCurrentStep(1))} className={solidBtn + " w-full md:w-auto px-8 cursor-pointer"}>
                                prev
                            </button>
                            <button type="submit" disabled={loading} className={solidBtn + " w-full md:w-auto px-8 cursor-pointer"}>
                                {loading ? "Submitting..." : "Next Step"}
                            </button>
                        </div>
                    </div>
                )}

                {/* === STEP 3: BANK DETAILS === */}
                {currentStep === 3 && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Bank Account Details</h3>
                                {bankVerified && <VerifiedPill />}
                            </div>

                            <Field
                                label="Account Number"

                                id="acc_no"
                                required
                                error={errors.bank_accounts?.[0]?.account_number?.message as string}
                            >
                                <input
                                    {...register("bank_accounts.0.account_number", {
                                        required: "Account number is required",
                                        pattern: { value: patterns.accountNumber, message: "Account number should be 9-18 digits" },
                                    })}

                                    className={baseInput}
                                    disabled={bankVerified}
                                    type="number"
                                    maxLength={18}
                                />
                            </Field>

                            <Field
                                label="IFSC Code"
                                id="ifsc"
                                required
                                error={errors.bank_accounts?.[0]?.ifsc_code?.message as string}
                            >
                                <input
                                    {...register("bank_accounts.0.ifsc_code", {
                                        required: "IFSC is required",
                                        pattern: { value: patterns.ifsc, message: "Invalid IFSC (e.g. HDFC0001234)" },
                                    })}
                                    className={baseInput}
                                    disabled={bankVerified}
                                    style={{ textTransform: "uppercase" }}
                                    onChange={(e) => {
                                        const upper = e.target.value.toUpperCase()
                                        setValue("bank_accounts.0.ifsc_code", upper, { shouldValidate: true, shouldDirty: true })
                                    }}
                                />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Bank Name"
                                    id="bank_name"
                                    required
                                    error={errors.bank_accounts?.[0]?.bank_name?.message as string}
                                >
                                    <input
                                        {...register("bank_accounts.0.bank_name", {
                                            required: "Bank name is required",
                                            minLength: { value: 2, message: "Minimum 2 characters" },
                                        })}
                                        className={baseInput}
                                        disabled={bankVerified}
                                        placeholder="Bank Name"
                                    />
                                </Field>

                                <Field
                                    label="Holder Name"
                                    id="holder_name"
                                    error={errors.bank_accounts?.[0]?.account_holder_name?.message as string}
                                >
                                    <input
                                        {...register("bank_accounts.0.account_holder_name", {
                                            validate: (v) => {
                                                if (!v) return true
                                                return String(v).trim().length >= 2 || "Minimum 2 characters"
                                            }
                                        })}
                                        className={baseInput}
                                        disabled={bankVerified}
                                        placeholder="Optional for Verify"
                                    />
                                </Field>
                            </div>

                            {!bankVerified && (
                                <button type="button" onClick={verifyBankDetail} disabled={loading} className={outlineBtn + " w-full"}>
                                    Verify Bank Details
                                </button>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 gap-3">
                            <button onClick={() => dispatch(setCurrentStep(2))} className={solidBtn + " w-full md:w-auto px-8 cursor-pointer"}>
                                prev
                            </button>
                            <button type="submit" disabled={loading} className={solidBtn + " w-full md:w-auto px-8 cursor-pointer"}>
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                )}

                {/* === STEP > 3: STATUS VIEW === */}
                {currentStep > 3 && (
                    <div className="text-center py-10 space-y-6 max-w-2xl mx-auto">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 text-4xl mb-4">
                            <IoCheckmarkCircle />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {currentStep === 4 && "Application Under Review"}
                            {currentStep === 5 && "Application Approved"}
                            {currentStep === 6 && "Agreement Pending"}
                            {currentStep === 7 && "Agreement Signed Pending"}
                            {currentStep === 8 && "You are Active!"}
                        </h2>
                        <p className="text-lg text-slate-600">
                            Your application is currently at the <strong>{STEPS[currentStep - 1]}</strong> stage.
                            {currentStep === 4 && " We are verifying your details. You will be notified once approved."}
                            {currentStep === 5 && " Congratulations! Your application has been approved. Please check your email for next steps."}
                            {currentStep === 6 && " Please sign the agreement sent to your email to proceed."}
                            {currentStep === 7 && " Your signed agreement is under verification. This will only take a short while."}
                            {currentStep === 8 && " Welcome aboard! You can now access your vendor dashboard."}
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}
