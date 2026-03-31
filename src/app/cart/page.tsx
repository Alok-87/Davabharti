// 'use client';

// import { useEffect } from 'react';
// import CartCard from './components/CartCard';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchCart } from '@/features/cart/cartThunks';
// import { CartItem } from '@/features/cart/types';
// import Link from 'next/link';
// import Loader from '@/components/ui/loader';
// import emptyCart from '@/assets/emptyCart.png';
// import Image from 'next/image';
// import { fetchMe } from '@/features/auth/authThunks';

// export default function Cart() {
//   const dispatch = useAppDispatch();
//   const { carts, loading, error } = useAppSelector((state) => state.cart);

//   useEffect(() => {
//     dispatch(fetchCart());
//     dispatch(fetchMe());
//   }, [dispatch]);

//   if (!carts || carts.length === 0) {
//     return (
//       <div className="w-full flex flex-col items-center justify-center py-10">
//         <Image src={emptyCart} alt="Empty Cart" className="w-40 h-40 object-contain mb-4" />
//         <p className="text-black font-semibold text-md">Your Medicine/Healthcare cart is empty!</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center text-red-600 py-10">{error}</div>;
//   }

//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         {' '}
//         <Loader />{' '}
//       </div>
//     );
//   }

//   // Usually API returns one active cart, but handle multiple safely
//   const currentCart = carts[0];

//   return (
//     <div className="bg-white">
//       <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cart</h1>

//         <form className="mt-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
//           {/* 🧾 Cart Items */}
//           <section aria-labelledby="cart-heading" className="lg:col-span-7">
//             <h2 id="cart-heading" className="sr-only">
//               Items in your shopping cart
//             </h2>

//             <div className="divide-y divide-gray-200">
//               {currentCart.items.map((item: CartItem) => (
//                 <CartCard key={item.id} item={item} subTotal={currentCart.sub_total} />
//               ))}
//             </div>
//           </section>

//           {/* 💰 Order Summary */}
//           <section
//             aria-labelledby="summary-heading"
//             className="mt-16 rounded-lg border-gray-200 bg-white shadow-sm px-4 py-4 sm:p-6 lg:col-span-5 lg:mt-4 lg:p-8"
//           >
//             <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
//               Order summary
//             </h2>

//             <dl className="mt-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <dt className="text-sm text-gray-600">Subtotal</dt>
//                 <dd className="text-sm font-medium text-gray-900">
//                   ₹{Number(currentCart.sub_total).toFixed(2)}
//                 </dd>
//               </div>

//               <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//                 <dt className="text-sm text-gray-600">Shipping</dt>
//                 <dd className="text-sm font-medium text-gray-900">₹0.00</dd>
//               </div>

//               <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//                 <dt className="text-base font-medium text-gray-900">Total</dt>
//                 <dd className="text-base font-medium text-gray-900">
//                   ₹{Number(currentCart.sub_total).toFixed(2)}
//                 </dd>
//               </div>
//             </dl>

//             <div className="mt-6">
//               <Link href="/checkout">
//                 <button
//                   type="submit"
//                   className="w-full rounded-md bg-primary px-4 py-3 text-base font-medium text-white shadow-sm cursor-pointer"
//                 >
//                   Proceed to Checkout ({currentCart.total_items} items)
//                 </button>
//               </Link>
//             </div>
//           </section>
//         </form>
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import CartCard from './components/CartCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart } from '@/features/cart/cartThunks';
import { CartItem } from '@/features/cart/types';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import emptyCart from '@/assets/emptyCart.png';
import Image from 'next/image';
import { fetchMe } from '@/features/auth/authThunks';
import { fetchDeliveryCharge } from '@/features/order/orderThunks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { removeOffer } from '@/features/offers/offerSlice';

export default function Cart() {
  useEffect(() => {
    dispatch(fetchCart());
  }, [])
  const dispatch = useAppDispatch();
  const { carts, loading, error } = useAppSelector((state) => state.cart);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { appliedOffer } = useSelector((state: RootState) => state.offers)

  // Refresh cart when component mounts or when lastUpdate changes



  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchDeliveryCharge());
    if (appliedOffer) {
      dispatch(removeOffer())
    }
  }, [dispatch, lastUpdate]);



  const { deliveryCharges } = useAppSelector((state) => state.order);
  // Also refresh when user comes back to the page
  useEffect(() => {
    dispatch(fetchMe());

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchCart());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  // Force refresh function
  const handleRefreshCart = () => {
    window.location.reload();
    setLastUpdate(Date.now());
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loader />
      </div>
    );
  }

  if (!carts || carts.length === 0 || carts[0]?.items?.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <Image src={emptyCart} alt="Empty Cart" className="w-40 h-40 object-contain mb-4" />
        <p className="text-black font-semibold text-md">Your Medicine/Healthcare cart is empty!</p>
        <Link href="/" className="mt-4 bg-primary text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleRefreshCart}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentCart = carts[0];


  const subTotal = Number(currentCart?.sub_total || 0);
  const shipping = subTotal < (deliveryCharges?.min_purchase_amount) ? Number(deliveryCharges?.amount) : 0;
  const total = subTotal + shipping;

  const minAmount = Number(deliveryCharges?.min_purchase_amount || 0);

  // ✅ Progress % (0–100)
  const progressWidth = minAmount > 0 ? Math.min((subTotal / minAmount) * 100, 100) : 0;

  // ✅ Remaining amount for free delivery (only for display)
  const remainingAmount = Math.max(minAmount - subTotal, 0);


  return (
    <div className="bg-white">
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cart</h1>
          <button
            onClick={handleRefreshCart}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
          </button>
        </div>

        <form className="mt-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* 🧾 Cart Items */}
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <div className="divide-y divide-gray-200">
              {currentCart.items.map((item: CartItem) => (
                <CartCard
                  key={item.id}
                  item={item}
                  subTotal={currentCart.sub_total}
                  onCartUpdate={handleRefreshCart}

                />
              ))}
            </div>
          </section>

          {/* 💰 Order Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg border-gray-200 bg-white shadow-sm px-4 py-4 sm:p-6 lg:col-span-5 lg:mt-4 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ₹{subTotal.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">₹{shipping.toFixed(2)}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  ₹{total.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-gradient-to-r from-primary/5 to-green-50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                {deliveryCharges ? (
                  subTotal < minAmount ? (
                    <p className="text-sm font-medium text-gray-700">
                      Add
                      <span className="mx-1 font-bold text-primary">
                        ₹{remainingAmount.toFixed(0)}
                      </span>
                      more to get
                      <span className="ml-1 font-semibold text-green-600">
                        FREE Delivery
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-green-600 flex items-center gap-2">
                      🎉 You’ve unlocked FREE Delivery!
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">Loading subtotal...</p>
                )}
              </div>

              {/* ✅ Dynamic Progress Bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Limited time free delivery offer 🚀
              </p>
            </div>

            <div className="mt-6">
              <Link href="/checkout">
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-4 py-3 text-base font-medium text-white shadow-sm cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout ({currentCart.total_items} items)
                </button>
              </Link>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}