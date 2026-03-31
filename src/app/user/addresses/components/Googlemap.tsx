import React, { useEffect, useState } from 'react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLat, setLng, setAddress } from '@/features/user-profile/userProfileSlice'

const containerStyle = {
    width: '100%',
    height: '400px',
}


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const Googlemap = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
    })

    const dispatch = useAppDispatch();
    const { lat, lng } = useAppSelector((state) => state.userProfile);

    useEffect(() => {
        setConter({
            lat: lat,
            lng: lng
        })
    }, [lat, lng])

    const [center, setConter] = useState({
        lat: 28.70,
        lng: 77.10,
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center)
        // map.fitBounds(bounds)
        map.setZoom(15);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const mapClickHandler = (e: any) => {
        const location = e.latLng;
        dispatch(setLat(location.lat()))
        dispatch(setLng(location.lng()))


        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]?.formatted_address) {
                dispatch(setAddress(results[0].formatted_address)); // ✅ this is what will update input text
                console.log(results);
            }
        });

    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[400px] rounded-md border border-gray-200 flex items-center justify-center text-sm text-gray-500">
                Loading map...
            </div>
        );
    }

    return (
        <div className='w-full rounded-md overflow-hidden border border-gray-200'>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={(e) => mapClickHandler(e)}
            >
                <MarkerF position={{ lat: lat, lng: lng }} />
                {/* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </div>
    )
}

export default Googlemap