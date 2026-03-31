import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    StandaloneSearchBox,
    MarkerF,
} from "@react-google-maps/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLat, setLng } from '@/features/user-profile/userProfileSlice';
import { MdMyLocation } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";

const containerStyle = {
    width: "100%",
    height: "400px",
};


const defaultCenter = { lat: 28.7, lng: 77.1 };
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const places = ['places'];



export default function Test() {
    const { lat, lng } = useAppSelector((state) => state.userProfile)
    

    useEffect(() => {
        const pos = { lat, lng };
        setCenter(pos);
        setMarkerPos(pos);

        if (map) {
            map.panTo(pos);
            map.setZoom(16);
        }
    }, [lat, lng]);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: API_KEY,
        libraries: places,
    });
    const dispatch = useAppDispatch();

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [center, setCenter] = useState(defaultCenter);
    const [markerPos, setMarkerPos] = useState(defaultCenter);

    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

    const onLoad = useCallback((m: google.maps.Map) => {
        setMap(m);
        m.setZoom(15);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
        searchBoxRef.current = ref;
    };

    const onPlacesChanged = () => {
        const sb = searchBoxRef.current;
        if (!sb) return;

        const places = sb.getPlaces();
        const place = places?.[0];
        const loc = place?.geometry?.location;

        if (!loc) return;

        const newPos = {
            lat: loc.lat(),
            lng: loc.lng(),
        };

        // Update redux
        dispatch(setLat(newPos.lat));
        dispatch(setLng(newPos.lng));

        // Update local map state
        setCenter(newPos);
        setMarkerPos(newPos);

        // Optional: nicely focus the map on selection
        if (map) {
            map.panTo(newPos);
            map.setZoom(16);
        }
    };

    const mapClickHandler = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        dispatch(setLat(pos.lat));
        dispatch(setLng(pos.lng));

        setCenter(pos);
        setMarkerPos(pos);
        map?.panTo(pos);
    };


    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };

                // Redux
                dispatch(setLat(newPos.lat));
                dispatch(setLng(newPos.lng));

                // Local map state
                setCenter(newPos);
                setMarkerPos(newPos);

                // Move map
                if (map) {
                    map.panTo(newPos);
                    map.setZoom(16);
                }
            },
            () => {
                alert("Location permission denied");
            },
            { enableHighAccuracy: true }
        );
    };


    if (!isLoaded) {
        return (
            <div className="w-full h-[400px] border rounded flex items-center justify-center text-sm text-gray-500">
                Loading map...
            </div>
        );
    }



    return (
        <div className="flex flex-col gap-3">
            <div>
                <div onClick={() => useCurrentLocation()} className="w-full flex justify-between items-center rounded-md border border-gray-300 p-2 cursor-pointer">
                    <div className="flex gap-3 items-center">
                        <div><FaSearchLocation className="text-md text-red-500" /></div>
                        <div className="text-sm  text-gray-900">Get Current location</div>
                    </div>

                    <div><MdMyLocation className="text-xl text-primary" /></div>
                </div>
            </div>
            <div className="w-full rounded-md overflow-hidden border border-gray-200">

                {/* Search input overlay */}
                <div className="p-3 bg-white border-b border-gray-200">
                    <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                        <input
                            type="text"
                            placeholder="Search location..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                    </StandaloneSearchBox>
                </div>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        zoomControl: true,
                        clickableIcons: false,
                    }}
                    onClick={(e) => mapClickHandler(e)}

                >
                    <MarkerF position={{ lat: lat === 0 ? defaultCenter.lat : lat , lng: lng === 0 ? defaultCenter.lng : lng  }} />
                </GoogleMap>
            </div>
        </div>
    );
}
