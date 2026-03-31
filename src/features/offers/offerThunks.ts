import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    Offer,
    fetchCustomerOffersApi
} from "./offerApi";

// Fetch all offers for this customer
export const fetchCustomerOffers = createAsyncThunk<
    Offer[],
    void,
    { rejectValue: string }
>("offers/fetchCustomerOffers", async (_, thunkAPI) => {
    try {
        return await fetchCustomerOffersApi();
    } catch (e) {
        return thunkAPI.rejectWithValue("Failed to load offers");
    }
});

// Apply Offer
// export const applyOffer = createAsyncThunk<
//     ApplyOfferResponse,
//     string,
//     { rejectValue: string }
// >("offers/applyOffer", async (code, thunkAPI) => {
//     try {
//         return await applyOfferApi(code);
//     } catch (e) {
//         return thunkAPI.rejectWithValue("Failed to apply offer");
//     }
// });

// Remove Offer
// export const removeAppliedOffer = createAsyncThunk<
//     string,
//     void,
//     { rejectValue: string }
// >("offers/removeAppliedOffer", async (_, thunkAPI) => {
//     try {
//         const res = await removeAppliedOfferApi();
//         return res.message;
//     } catch (e) {
//         return thunkAPI.rejectWithValue("Failed to remove offer");
//     }
// });
