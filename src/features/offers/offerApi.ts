import api from "@/lib/axios";

// Offer Category (updated to new enum)
export type OfferCategory =
    | 'COUPON'
    | 'CASHBACK'
    | 'REFERRAL'
    | 'FIRST_ORDER';

// Discount Type
export type DiscountType =
    | 'PERCENTAGE'
    | 'FLAT';

// Applies To
export type AppliesTo =
    | 'ANY'
    | 'OTC'
    | 'PRESCRIPTION'
    | 'SPECIFIC_CATEGORY';
// OFFER MODEL
export interface Offer {
    id: string;
    offerNo: string;

    // BASIC
    title: string;
    description: string | null;
    code: string | null;

    // TYPE
    category: OfferCategory;
    discountType: DiscountType;
    discountValue: number;

    // DISCOUNTS / LIMITS
    minimumOrderValue: number | null;

    perUserLimit: number | null;
    showOnHome: boolean;

    // DATE RANGE
    startDate: string;
    endDate: string | null;       // backend now allows NULL

    // STATUS FLAGS
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;


    // APPLICABILITY
    appliesTo: AppliesTo;
    medicineCategoryId?: string | null;
    medicineCategoryName?: string | null;
    termsAndConditions?: string | null;
    // METADATA
    createdAt?: string;
    updatedAt?: string;
}

// API Response for apply/remove
export interface ApplyOfferResponse {
    valid: boolean;
    offer?: Offer;
    discount?: number;
    message: string;
}
export const fetchCustomerOffersApi = async (): Promise<Offer[]> => {
    const { data } = await api.get("offer/customer");
    return data.data || [];
};

/**
 * APPLY OFFER — dummy logic only — replace when backend ready
 */
// export const applyOfferApi = async (code: string): Promise<ApplyOfferResponse> => {
//     await new Promise((r) => setTimeout(r, 300));

//     if (code.toUpperCase() === "FIRST50") {
//         return {
//             valid: true,
//             message: "Offer applied successfully",
//             discount: 50,
//             offer: {
//                 id: "1",
//                 code: "FIRST50",
//                 title: "50% on first order",
//                 description: "Valid only for first order",
//                 discountType: "PERCENT",
//                 discountValue: 50,
//             },
//         };
//     }

//     return {
//         valid: false,
//         message: "Invalid or expired offer",
//     };
// };

/**
 * REMOVE APPLIED OFFER — dummy logic
 */
// export const removeAppliedOfferApi = async (): Promise<{ message: string }> => {
//     await new Promise((r) => setTimeout(r, 200));

//     return { message: "Offer removed successfully" };
// };
