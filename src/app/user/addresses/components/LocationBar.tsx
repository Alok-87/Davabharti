"use client";

import React, { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";
import { setAddress, setLat, setLng } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MdMyLocation } from "react-icons/md";

export default function LocationBar() {
    const [value, setValue] = useState(null);
    const { address } = useAppSelector((state) => state.userProfile)
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";


    const dispatch = useAppDispatch();
    const getLatAndLng = async (selected: any) => {
        if (!selected?.value?.place_id) return; // ✅ prevents null crash
        const placeId = selected.value.place_id;
        const service = new google.maps.places.Place({ id: placeId });
        await service.fetchFields({ fields: ["location"] });
        const loc = service.location;
        dispatch(setLat(loc?.lat()));
        dispatch(setLng(loc?.lng()));
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                dispatch(setLat(lat));
                dispatch(setLng(lng));

                // Reverse geocode -> address text
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results?.[0]?.formatted_address) {
                        dispatch(setAddress(results[0].formatted_address));
                    }
                });
            },
            (err) => {
                console.log("Geolocation error:", err);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };



    return (
        <div>
            <div className="text-md font-semibold">Search your Location</div>

            <div className="bg-slate-200 p-1  rounded-md flex items-center gap-4">
                <div className="p-2">
                    <FaSearchLocation />
                </div>

                <div className="flex-1">
                    <GooglePlacesAutocomplete
                        apiKey={API_KEY} 
                        selectProps={{
                            value,
                            onChange: async (place) => {
                                setValue(place);
                                getLatAndLng(place);
                            },
                            placeholder: "Search your address",
                            isClearable: true,
                            className: "w-full",
                            components: {
                                DropdownIndicator: false,
                            },
                            styles: {
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }),
                            }
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="p-2 rounded-md hover:bg-slate-300 active:scale-[0.98] cursor-pointer"
                    title="Use current location"
                >
                    <MdMyLocation />
                </button>
            </div>
        </div>
    );
}
