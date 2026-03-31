// 'use client';
// import { setIsRemarkOpen } from "@/features/user-profile/userProfileSlice";
// import { useAppDispatch } from "@/store/hooks";
// import { useForm } from "react-hook-form";
// import { IoClose } from "react-icons/io5";
// import { cancelOrder, fetchOrderDetail } from "@/features/order/orderThunks";
// import { useParams } from "next/navigation";



// export default function RemarkDrawer() {
//     const { register, handleSubmit, reset } = useForm<{ reasonOfCancel: string }>({
//         defaultValues: { reasonOfCancel: "" }
//     });

//     const parmas = useParams();
//     const orderId = parmas.id;

//     const submitHandler = async (data: { reasonOfCancel: string }) => {
//         const reasonOfCancel = data.reasonOfCancel;
//         try {
//             await dispatch(cancelOrder({ orderId, reasonOfCancel })).unwrap(); 
//             dispatch(setIsRemarkOpen(false)); 
//             dispatch(fetchOrderDetail(orderId));
//             reset(); // ✅ clear form
//         } catch (err) {
//             console.error("Cancel order failed:", err);
//         }
//     };


//     const dispatch = useAppDispatch();
//     const closeHandler = () => {
//         dispatch(setIsRemarkOpen(false));
//     }

//     return (
//         <div className="bg-white w-full sm:w-[380px] md:w-[420px] h-full shadow-2xl flex flex-col">
//             {/* HEADER */}
//             <div className="flex items-center justify-between p-4 border-b">
//                 <h2 className="text-lg font-semibold">Cancel Remark</h2>
//                 <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" onClick={() => closeHandler()}>
//                     <IoClose size={22} />
//                 </button>
//             </div>

//             {/* FORM */}
//             <form onSubmit={handleSubmit(submitHandler)} className="p-4 flex flex-col h-full">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                     Add a note for cancel the order
//                 </label>
//                 <textarea
//                     {...register("reasonOfCancel")}
//                     className="w-full h-40 border rounded-lg px-3 py-2 text-sm resize-none focus:ring-primary focus:border-primary outline-none"
//                     placeholder="Example: price is to high"
//                 />

//                 {/* BUTTONS */}
//                 <div className="mt-auto flex justify-end gap-3 pt-4 border-t">
//                     <button
//                         type="button"
//                         className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
//                         onClick={() => closeHandler()}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
//                     >
//                         Cancel Order
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

'use client';
import { setIsRemarkOpen } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch } from "@/store/hooks";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { cancelOrder, fetchOrderDetail } from "@/features/order/orderThunks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function RemarkDrawer() {
  const { register, handleSubmit, reset } = useForm<{ reasonOfCancel: string }>({
    defaultValues: { reasonOfCancel: "" },
  });
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false);
  const params = useParams();
  const orderId = params.id as string;
  const dispatch = useAppDispatch();

  const closeHandler = () => {
    dispatch(setIsRemarkOpen(false));
    reset();
  };

  const submitHandler = async (data: { reasonOfCancel: string }) => {
    const { reasonOfCancel } = data;

    try {
      setSubmitting(true);

      // ✅ FIXED: reasonOfCancel is part of body, not the root object
      await dispatch(
        cancelOrder({
          orderId,
          body: { reasonOfCancel },
        })
      ).unwrap();

      await dispatch(fetchOrderDetail(orderId));
      dispatch(setIsRemarkOpen(false));
      reset();
      router.replace(`/user/orders/${orderId}`)
    } catch (err) {
      console.error("Cancel order failed:", err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="bg-white w-full sm:w-[380px] md:w-[420px] h-full shadow-2xl flex flex-col animate-slide-left">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Cancel Order</h2>
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          onClick={closeHandler}
        >
          <IoClose size={22} />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(submitHandler)} className="p-4 flex flex-col h-full">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Reason for cancellation
        </label>
        <textarea
          {...register("reasonOfCancel")}
          className="w-full h-40 border rounded-lg px-3 py-2 text-sm resize-none focus:ring-primary focus:border-primary outline-none"
          placeholder="Example: I found a better price elsewhere"
        />

        {/* BUTTONS */}
        <div className="mt-auto flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={closeHandler}
          >
            Close
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white font-medium transition cursor-pointer ${submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {submitting ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
