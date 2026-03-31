'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FaUserLarge } from 'react-icons/fa6';
import { fetchUserProfile, updateUserProfile, fetchCustomerWallet } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getToken } from '@/features/auth/utils/tokenManager';
import { FaCheck, FaRegCopy } from 'react-icons/fa';

interface ProfileFormData {
  name: string;
  dob: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function UserAccountSettings() {
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      dob: '',
      email: '',
      phone_number: '',
      gender: '',
    },
  });

  // 🔥 Fetch profile + wallet on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchUserProfile());
      dispatch(fetchCustomerWallet());
    }
  }, [dispatch]);

  const { user, wallet } = useAppSelector((state) => state.userProfile);

  // 🧠 Repopulate when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        gender: user.gender || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    dispatch(updateUserProfile(data));
  };

  // ---------------------------------------
  // ⭐ REFERRAL CODE COMPONENT
  // ---------------------------------------
  type ReferralCodeProps = {
    code?: string | null;
  };

  const ReferralCode: React.FC<ReferralCodeProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error("COPY ERROR:", err);
      }
    };

    return (
      <div className="mt-6 w-full max-w-xs">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Referral Code
            </span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {code || "N/A"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!code}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            {copied ? (
              <>
                <FaCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <FaRegCopy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {copied && (
          <p className="mt-1 text-xs text-emerald-600">
            Referral code copied to clipboard
          </p>
        )}
      </div>
    );
  };

  // ---------------------------------------
  // ⭐ WALLET COMPONENT (Half-hidden + Check button)
  // ---------------------------------------
  const WalletCard = () => {
    if (!wallet) return null;

    const [showFull, setShowFull] = useState(false);

    // Create blurred version e.g. "345•••"
    const blurNumber = (value: number) => {
      const str = String(value);
      const half = Math.ceil(str.length / 2);
      return showFull ? str : str.slice(0, half) + "•".repeat(str.length - half);
    };

    return (
      <div className="mt-6 w-full max-w-xs space-y-3">
        <h4 className="text-sm font-semibold text-gray-800">My Wallet</h4>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 shadow-sm">
          {/* Cash Wallet */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                ₹
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-500 font-medium">Cash Balance</span>
                <span className="text-lg font-semibold text-gray-900 tracking-wide">
                  ₹ {blurNumber(wallet.cashBalance)}
                </span>
              </div>
            </div>

            {!showFull && (
              <button
                type="button"
                onClick={() => setShowFull(true)}
                className="text-xs text-primary font-medium underline"
              >
                Check
              </button>
            )}
          </div>

          {/* Coin Wallet */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-500 font-medium">Coins</span>
                <span className="text-lg font-semibold text-gray-900 tracking-wide">
                  {blurNumber(wallet.coinBalance)} Coins
                </span>
              </div>
            </div>

            {!showFull && (
              <button
                type="button"
                onClick={() => setShowFull(true)}
                className="text-xs text-primary font-medium underline"
              >
                Check
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------
  // RENDER UI
  // ---------------------------------------
  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white rounded-md border border-gray-200 p-6 md:p-10 flex flex-col md:flex-row gap-8"
      >
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <FaUserLarge className="w-32 h-32 text-gray-400 border-4 border-white rounded-full shadow-md" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Account Settings</h3>
          <p className="text-sm text-gray-500">Manage your personal details</p>

          {/* Referral Code */}
          <ReferralCode code={user?.referral_code} />

          {/* Wallet */}
          {/* <WalletCard /> */}
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-2/3 w-full space-y-4">
          {/* Name + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input
                {...register('name')}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
                type="date"
                {...register('dob')}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Email + Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                {...register('phone_number')}
                type="tel"
                className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm ${user?.phone_number ? 'cursor-not-allowed bg-gray-50' : ''
                  }`}
                placeholder="Enter your phone number"
                disabled={!!user?.phone_number}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Gender *</label>
              <select
                {...register('gender')}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
