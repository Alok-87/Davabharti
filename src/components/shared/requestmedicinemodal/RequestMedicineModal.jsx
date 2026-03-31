import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { setShowReqMedicineModal } from '@/features/user-profile/userProfileSlice';

export default function RequestMedicineModal({ name, onSubmit }) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      medicineName: name, // ✅ Auto fill from props
      quantity: 1,
    },
  });

  const submitForm = (data) => {
    onSubmit({
      medicineName: name, // ✅ Use prop directly
      quantity: Number(data.quantity),
    });
    reset();
    dispatch(setShowReqMedicineModal(false));
  };

  const cancelHandler = () => {
    reset();
    dispatch(setShowReqMedicineModal(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Request Medicine</h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* ✅ Auto-filled Medicine Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Medicine Name*</label>
            <input
              {...register('medicineName')}
              value={name} // ✅ Always use prop
              readOnly
              className="w-full rounded-md border px-3 py-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* ✅ Only ask quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium">Quantity*</label>
            <input
              type="number"
              min="1"
              {...register('quantity', { required: 'Quantity is required' })}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelHandler}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
