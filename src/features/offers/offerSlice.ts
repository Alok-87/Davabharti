import { createSlice } from "@reduxjs/toolkit";
import { Offer } from "./offerApi";
import { fetchCustomerOffers } from "./offerThunks";
import { Toast } from "@/components/ui/toast";

export interface referral {
  isValid: boolean;
  discount: number;
  isReferral?: boolean;
  minimumOrderValue: number;
}


interface OfferState {
    offers: Offer[];
    appliedOffer: Offer | null;
    loading: boolean;
    error?: string;
    successMessage?: string;
    showOfferModal: boolean;
    referral: referral | null;
}

const initialState: OfferState = {
    offers: [],
    appliedOffer: null,
    loading: false,
    showOfferModal: false,
    referral: null,
};

const offerSlice = createSlice({
    name: "offers",
    initialState,
    reducers: {
        setShowOfferModal: (state, action) => {
            state.showOfferModal = action.payload;
        },

        clearAppliedOfferState: (state) => {
            state.appliedOffer = null;
            state.error = undefined;
            state.successMessage = undefined;
        },

        // ------------------------------
        // APPLY OFFER (client-side reducer)
        // ------------------------------
        applyOffer: (state, action) => {
            const code = action.payload?.trim();
            const offer = state.offers.find(o => o.code === code);

            if (offer) {
                state.appliedOffer = offer;
            }
            else if (!offer && state.referral !== null) {
                state.appliedOffer = {
                    code:code,
                    discountValue: state.referral.discount,
                    title: 'referral',
                    description: 'Referral offer',
                    discountType: 'FLAT',
                    minimumOrderValue: state.referral.minimumOrderValue,
                    category: 'COUPON',
                    appliesTo: 'ANY'
                }
            }
            else {
                state.appliedOffer = null;
                Toast("Invalid offer code");
            }
        },
        setReferral: (state, action) => {
            state.referral = action.payload;
        },

        // ------------------------------
        // REMOVE APPLIED OFFER
        // ------------------------------
        removeOffer: (state) => {
            state.appliedOffer = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchCustomerOffers.fulfilled, (state, action) => {
            state.offers = action.payload;
        });
    },
});

export const {
    setShowOfferModal,
    clearAppliedOfferState,
    applyOffer,
    removeOffer,
    setReferral,
} = offerSlice.actions;

export default offerSlice.reducer;
