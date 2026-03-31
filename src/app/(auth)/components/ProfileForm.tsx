
'use client';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { updateUserProfile } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch } from '@/store/hooks';
import { X } from 'lucide-react';

interface ProfileFormData {
  name: string;
  dob: string;
  email: string;
  phone_number: string;
  gender: string;
}

interface ProfileFormProps {
  userData: any;
  onComplete: () => void;
  onClose: () => void;
}

export default function ProfileForm({ userData, onComplete, onClose }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>();

  // Pre-fill form with user data from OTP verification
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        dob: userData.dob ? userData.dob.split('T')[0] : '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        gender: userData.gender || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      onComplete();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Complete Your Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date of Birth *
              </label>
              <input
                {...register('dob', { required: 'Date of birth is required' })}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email *
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mobile Number *
              </label>
              <input
                {...register('phone_number')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Gender *
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}