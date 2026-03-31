'use client';

import { useForm } from 'react-hook-form';
import { createAddress, updateAddress } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Address } from '@/features/user-profile/types';
import Googlemap from './Googlemap';
import { useEffect, useState } from 'react';
import LocationBar from './LocationBar';
import Test from './Test';
import { setLat, setLng } from '@/features/user-profile/userProfileSlice';

export interface AddressFormValues {
  name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city_district: string;
  pincode: string;
  state: string;
  is_default: boolean;
  tag?: string;
  lat: number;
  lng: number;
}

interface AddressFormProps {
  onSubmit?: (data: AddressFormValues) => void;
  initialData?: Address;
  isEditing?: boolean;
}
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export default function AddressForm({ onSubmit, initialData, isEditing = false }: AddressFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    defaultValues: initialData
      ? {
        name: initialData.name,
        phone_number: initialData.phone_number,
        address_line_1: initialData.address_line_1,
        address_line_2: initialData.address_line_2 || '',
        city_district: initialData.city_district,
        pincode: initialData.pincode,
        state: initialData.state,
        is_default: initialData.is_default,
        tag: initialData.tag,
        // If Address has these, map them:
        lat: initialData.lat,
        lng: initialData.lng,
      }
      : {
        is_default: false,
        lat: 0,
        lng: 0,
      },
  });

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (initialData?.lat && initialData?.lng) {
      dispatch(setLat(initialData.lat));
      dispatch(setLng(initialData.lng));
    }
  }, [initialData, dispatch]);

  const { lat, lng } = useAppSelector((state) => state.userProfile);

  const handleFormSubmit = async (data: AddressFormValues) => {
    try {
      const submitData: AddressFormValues = {
        ...data,
        lat,
        lng,
        address_line_2: data.address_line_2?.trim() || undefined,
      };


      if (isEditing && initialData?.id) {
        await dispatch(updateAddress({ id: initialData.id, payload: submitData })).unwrap();
      } else {
        await dispatch(createAddress(submitData)).unwrap();
      }
      console.log('payload', submitData)

      if (onSubmit) onSubmit(submitData);
      reset({ is_default: false, lat: 0, lng: 0 } as any);
    } catch (error) { }
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-start">
      {/* hidden inputs (no UI change) */}
      <input type="hidden" {...register('lat', { valueAsNumber: true })} />
      <input type="hidden" {...register('lng', { valueAsNumber: true })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700">Full Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Phone Number *</label>
          <input
            {...register('phone_number', {
              required: 'Phone number is required',
              pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
            })}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter phone number"
          />
          {errors.phone_number && (
            <p className="text-xs text-red-500 mt-1">{errors.phone_number.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-700">Address Line 1 *</label>
        <input
          {...register('address_line_1', { required: 'Address line 1 is required' })}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
          placeholder="Flat / House No. / Street"
        />
        {errors.address_line_1 && (
          <p className="text-xs text-red-500 mt-1">{errors.address_line_1.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-700">Address Line 2</label>
        <input
          {...register('address_line_2')}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
          placeholder="Landmark / Apartment / Area"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-700">City / District *</label>
          <input
            {...register('city_district', { required: 'City / District is required' })}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter city or district"
          />
          {errors.city_district && (
            <p className="text-xs text-red-500 mt-1">{errors.city_district.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700">State *</label>
          <input
            {...register('state', { required: 'State is required' })}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter state"
          />
          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Pincode *</label>
          <input
            {...register('pincode', {
              required: 'Pincode is required',
              pattern: { value: /^[1-9][0-9]{5}$/, message: 'Enter a valid 6-digit pincode' },
            })}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter pincode"
          />
          {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
        </div>
      </div>


      {/* <div className="w-full "> */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> */}
      {/* <div className="lg:col-span-1"> */}
      {/* <LocationBar /> */}
      {/* </div> */}

      {/* <div className="lg:col-span-2 h-[60vh] lg:h-[80vh] rounded-xl overflow-hidden"> */}
      {/* <Googlemap /> */}
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}


      <Test />

      {/* If you want to see selected coords for debugging (optional):
      <pre className="text-xs text-gray-500">{JSON.stringify(selectedCord, null, 2)}</pre>
      */}

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          {...register('is_default')}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label className="text-sm text-gray-700">Make this my default address</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || lat == null}
        className="w-full mt-4 bg-primary text-white font-medium text-sm py-2.5 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}
      </button>
    </form>
  );
}
