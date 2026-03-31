"use client"

import React, { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface InputOTPProps {
    value: string
    onChange: (value: string) => void
    maxLength?: number
    className?: string
    disabled?: boolean
}

export default function InputOTP({
    value,
    onChange,
    maxLength = 6,
    className,
    disabled
}: InputOTPProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [otp, setOtp] = useState<string[]>(new Array(maxLength).fill(""))

    useEffect(() => {
        const otpArray = value.split("").slice(0, maxLength)
        const newOtp = [...new Array(maxLength).fill("")].map((_, i) => otpArray[i] || "")
        setOtp(newOtp)
    }, [value, maxLength])

    const handleChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return

        const newOtp = [...otp]
        newOtp[index] = val.slice(-1)
        setOtp(newOtp)

        const combinedOtp = newOtp.join("")
        onChange(combinedOtp)

        if (val && index < maxLength - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData("text").replace(/[^\d]/g, "").slice(0, maxLength)
        const newOtp = [...otp]

        pasteData.split("").forEach((char, i) => {
            if (i < maxLength) newOtp[i] = char
        })

        setOtp(newOtp)
        onChange(newOtp.join(""))

        const nextIndex = Math.min(pasteData.length, maxLength - 1)
        inputRefs.current[nextIndex]?.focus()
    }

    return (
        <div className={cn("flex gap-1 justify-center", className)} onPaste={handlePaste}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={cn(
                        "w-10 h-10 md:w-12 md:h-12 text-center text-lg font-semibold border rounded-lg outline-none transition-all",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "disabled:bg-slate-100 disabled:text-slate-400",
                        digit ? "border-primary bg-primary/5" : "border-slate-300 bg-white"
                    )}
                />
            ))}
        </div>
    )
}
