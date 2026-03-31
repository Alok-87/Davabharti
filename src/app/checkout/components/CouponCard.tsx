'use client';

import { FaTag } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShowTermsAndConditions } from '@/features/user-profile/userProfileSlice';

interface CouponCardProps {
  code: string;
  disabled: boolean;
  description: string;
  terms: string | null;
  category: string;

  minimumOrderValue?: string | number | null;
  appliesTo?: string | null;
  discountType?: string | null;
  discountValue?: string | number | null;

  onApply: () => void;
  handleRemove: () => void;
}

export default function CouponCard({
  code,
  disabled,
  description,
  terms,
  category,
  minimumOrderValue,
  appliesTo,
  discountType,
  discountValue,
  onApply,
  handleRemove,
}: CouponCardProps) {
  const { appliedOffer } = useAppSelector((state) => state.offers);
  const showTermsAndConditions = useAppSelector((state) => state.userProfile.showTermsAndConditions);

  const isApplied = appliedOffer?.code === code;
  const dispatch = useAppDispatch();

  const clickHandler = (t: string | null) => {
    dispatch(setShowTermsAndConditions(t));
    console.log('log');
    setTimeout(() => {
      console.log('showTermsAndConditions', showTermsAndConditions);
    }, 2000);
  };

  const renderDiscountText = () => {
    // If cashback, don't show discount chip/text
    if (String(category).toUpperCase() === 'CASHBACK') return null;

    if (!discountType || discountValue === undefined || discountValue === null) return null;

    const val = String(discountValue);

    // FLAT => ₹value, otherwise assume percent
    if (String(discountType).toUpperCase() === 'FLAT') return `Discount: ₹${val}`;
    return `Discount: ${val}%`;
  };


  return (
    <div
      className="
        group relative border border-gray-200 rounded-lg
        p-4 sm:p-5 mb-4 bg-white
        hover:shadow-md transition-all duration-300
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* LEFT SECTION */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-md bg-blue-50">
            <FaTag className="text-primary text-lg sm:text-xl" />
          </div>

          <div className="flex flex-col">
            <h3 className="flex justify-start items-start text-primary font-semibold text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <h3 className="text-primary font-semibold text-base sm:text-lg">
                  {code}
                </h3>

                <span className="bg-primary text-white rounded-full text-[8px] px-2 py-0.5">
                  {category}
                </span>
              </div>
            </h3>

            {description && (
              <p className="text-sm text-gray-700 mt-1 leading-snug max-w-md">{description}</p>
            )}

            {/* EXTRA INFO */}
            {(minimumOrderValue || appliesTo || (discountType && discountValue !== null && discountValue !== undefined)) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {minimumOrderValue !== null && minimumOrderValue !== undefined && minimumOrderValue !== '' && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    Min order: ₹{String(minimumOrderValue)}
                  </span>
                )}

                {appliesTo && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    Applies to: {appliesTo}
                  </span>
                )}

                {renderDiscountText() && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {renderDiscountText()}
                  </span>
                )}
              </div>
            )}

            {terms && (
              <p
                onClick={() => clickHandler(terms)}
                className="text-xs text-primary underline mt-2 inline-block hover:text-primary/80 cursor-pointer"
              >
                Terms &amp; conditions
              </p>
            )}
          </div>
        </div>

        {/* APPLY BUTTON */}
        {isApplied ? (
          <button
            onClick={handleRemove}
            className="
              self-start sm:self-auto
              border border-red-500 text-red-500
              text-xs sm:text-sm font-medium
              px-2 py-2 rounded-md transition
              hover:bg-red-500 hover:text-white cursor-pointer
            "
          >
            Remove
          </button>
        ) : (
          <button
            onClick={onApply}
            disabled={disabled}
            className="
              self-start sm:self-auto
              border border-primary text-[#1f539f]
              text-xs sm:text-sm font-medium
              px-4 py-2 rounded-md transition
              hover:bg-[#1f539f] hover:text-[#fff]
              disabled:opacity-40 disabled:cursor-not-allowed
              disabled:hover:bg-transparent disabled:hover:text-primary cursor-pointer
            "
          >
            Apply
          </button>
        )}
      </div>

      {/* Border Glow on Hover */}
      <div
        className="
          absolute inset-0 rounded-lg border border-transparent
          group-hover:border-primary/40 transition-all duration-300
          pointer-events-none
        "
      />
    </div>
  );
}
