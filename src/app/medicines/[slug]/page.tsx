'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AiOutlineShoppingCart } from 'react-icons/ai';

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react';
import { fetchMedicineById, fetchMedicineBySlug } from '@/features/medicines/medicinesThunks';
import FeatureCard from '../components/FeatureCard';
import MedicineInfoCard from '../components/MedicineInfoCard';
import Faq from '../components/Faq';
import ShimmerMedicineDetails from '@/components/shared/shimmer/ShimmerMedicineDetails';
import { addToCart } from '@/features/cart/cartThunks';
import { getToken } from '@/features/auth/utils/tokenManager';
import Loader from '@/components/ui/loader';
import rx from '@/assets/rx-tag.svg';
import Image from 'next/image';

import ImageZoom from '@/components/shared/zoom-image/ImageZoom';

import RequestMedicineModal from '@/components/shared/requestmedicinemodal/RequestMedicineModal';
import { setShowReqMedicineModal } from '@/features/user-profile/userProfileSlice';
import { useAuthModal } from '@/hooks/useAuthModal';
import ProfileAlertDialog from '@/components/shared/alert/ProfileAlert';
import { createMedicineRequest } from '@/features/inquiry/inquiryThunks';
import OfferStripTop from '@/components/shared/offer-strip/OfferStriptTop';
import OfferModal from '@/components/shared/offer-modal/OfferModal';

const faqData = [
  {
    question: 'How can I reset my password?',
    answer:
      "Go to your account settings, click on 'Forgot Password', and follow the instructions sent to your registered email.",
  },
  {
    question: 'How do I update my billing information?',
    answer:
      "Navigate to the Billing section under your account, click 'Edit', and update your payment details securely.",
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach us via our support form or email us at support@example.com for assistance.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Go to your Account Settings > Privacy > Delete Account. Follow the confirmation steps to complete the process.',
  },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const medicine = () => {
  const { slug } = useParams();
// Extract ID from URL
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const { user } = useAppSelector((state) => state.userProfile);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  //   useEffect(() => {
  //     if (id) {
  //         dispatch(fetchMedicineById(id as string)); // Fetch medicine by ID
  //     }
  //   }, [id, dispatch]);

  //   const {current,loading,error} = useAppSelector((state) => state.medicines);
  //   const medicine = current
  // if (loading || !medicine) {
  //   return <ShimmerMedicineDetails/>;
  // }

  // if (error) {
  //   return <div className="text-center text-red-600 py-20">{error}</div>;
  // }

  // if (!medicine) {
  //   return <div className="text-center py-20">No medicine found.</div>;



  const [quantity, setQuantity] = useState(1);

  const [startedFetch, setStartedFetch] = useState<boolean>(false);


  const placeholderImage = "/no-image.png";

  useEffect(() => {
    console.log('tst-0')
    if (slug) {
      setStartedFetch(true); // mark that fetch has started
      dispatch(fetchMedicineBySlug(slug as string));
    }
  }, [slug, dispatch]);

  const { current: medicine, loading, error } = useAppSelector((state) => state.medicines);

  const cartHandler = () => {

    if (!medicine?.id) return;

    const token = getToken(); // check if user is logged in

    if (!token) {
      openLogin(window.location.pathname);
      return;
    }

    // ✅ Profile completeness check
    if (!user?.is_profile_complete) {
      setShowProfileDialog(true);
      return;
    }

    // User is logged in → add to cart
    dispatch(
      addToCart({
        medicineId: medicine.id,
        quantity,
      })
    );
  };

  const showReqMedicineModal = useAppSelector((state) => state.userProfile.showReqMedicineModal);

  const handleSubmitMedicineRequest = (data: any) => {
    dispatch(createMedicineRequest(data))
    setShowReqMedicineModal(false);
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        {' '}
        <Loader />{' '}
      </div>
    );
  }

  // Show shimmer if fetching started or loading is true
  if (!medicine && (loading || !startedFetch)) {
    return <ShimmerMedicineDetails />;
  }

  if (error) {
    return <div className="text-center text-red-600 py-20">{error}</div>;
  }

  if (startedFetch && !medicine) {
    return <div className="text-center py-20">No medicine found.</div>;
  }

  return (
    <>
    {/* <OfferStripTop /> */}
    {/* <OfferModal/> */}
      {/* Alert */}
      <ProfileAlertDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
      <div className="bg-white">
        <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            {/* Product */}
            <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <TabGroup className="flex flex-col-reverse ">
                {/* Image selector */}
                <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                  <TabList className="grid grid-cols-4 gap-6">
                    {medicine &&
                      medicine.images.map((image) => (
                        <Tab
                          key={medicine.id}
                          className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-blue-600/50 focus:ring-offset-4 focus:outline-hidden"
                        >
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              alt={image.name || "Medicine image"}
                              src={image.url || placeholderImage}
                              className="size-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = placeholderImage;
                              }}
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-blue-600"
                          />
                        </Tab>
                      ))}
                  </TabList>
                </div>

                <TabPanels className="border border-gray-200">
                  {medicine && (
                    medicine.images && medicine.images.length > 0 ? (
                      medicine.images.map((image) => (
                        <TabPanel key={image.id}>
                          <ImageZoom
                            src={image.url}
                            alt={image.alt || medicine.productName}
                            width={300}
                            height={400}
                            zoomScale={2.2}
                            previewSize={250}
                            previewPosition="right"
                          />
                        </TabPanel>
                      ))
                    ) : (
                      // ✅ fallback if no images
                      <TabPanel>
                        <ImageZoom
                          src={placeholderImage}
                          alt={medicine.productName || "No image available"}
                          width={300}
                          height={400}
                          zoomScale={2.2}
                          previewSize={250}
                          previewPosition="right"
                        />
                      </TabPanel>
                    )
                  )}
                </TabPanels>
              </TabGroup>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <p className="my-2 text-primary text-md font-bold ">{medicine?.productCompany}</p>
                <h1 className="text-2xl  tracking-tight text-gray-700 font-bold">
                  {medicine?.productName}
                </h1>
                {medicine?.prescriptionRequired && (
                  <div className="inline-flex items-center gap-2 my-1">
                    <div className="flex items-center justify-center ">
                      <Image src={rx} alt="Rx" className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm bg-gray-100 px-2 rounded-lg">
                      Prescription Required
                    </span>
                  </div>
                )}

                <div className="mt-1">
                  <h2 className="sr-only">Product information</h2>
                  <div className="flex items-baseline space-x-3">
                    {/* Sale Price */}
                    <p className="text-2xl font-bold text-gray-600">
                      Rs {Number(medicine?.salePrice).toFixed(2)}
                    </p>

                    {/* Original MRP */}
                    <p className="text-xl text-gray-500 line-through">
                      Rs {Number(medicine?.mrp).toFixed(2)}
                    </p>

                    {/* Discount */}
                    {medicine?.mrp && medicine?.salePrice && (
                      <p className="text-lg font-medium text-green-600">
                        {Math.round(
                          ((Number(medicine.mrp) - Number(medicine.salePrice)) /
                            Number(medicine.mrp)) *
                          100
                        )}
                        % OFF
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Includes all taxes</p>
                  <p className="mt-1 text-sm text-gray-500">{medicine?.productComposition}</p>
                </div>

                {/* Reviews */}
                {/* <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                      // className={classNames(
                      //   product.rating > rating ? 'text-primary' : 'text-gray-300',
                      //   'size-5 shrink-0'
                      // )}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div> */}

                <div className="mt-3 line-clamp-3 flex items-center justify-start gap-2">
                  <h3 className="font-semibold">packaging</h3>
                  <div className="space-y-6 text-base text-gray-700" />
                  {medicine?.packagingSize}
                </div>

                <div className="mt-3 line-clamp-3">
                  <h3 className="sr-only">uses</h3>
                  <div className="space-y-6 text-base text-gray-700" />
                  {medicine?.usesIndications}
                </div>

                {medicine?.inStock ? (
                  <div
                    className="mt-6 flex items-center w-full gap-3 flex-wrap sm:flex-nowrap"
                  >
                    <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden w-32 h-10 bg-white">
                      <button
                        className="w-14 h-full flex items-center justify-center text-gray-500 text-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                      >
                        −
                      </button>
                      <div className="w-full h-full flex items-center justify-center text-black text-base font-medium border-x border-gray-300">
                        {quantity}
                      </div>
                      <button
                        className="w-14 h-full flex items-center justify-center text-gray-500 text-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => setQuantity(prev => (prev) + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex-1">
                      <button
                        type="submit"
                        className="flex items-center gap-3 cursor-pointer justify-evenly rounded-md bg-primary px-4 py-2 text-base font-medium text-white"
                        onClick={cartHandler}
                      >
                        <AiOutlineShoppingCart />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Out of stock</p>
                        <p className="mt-1 text-sm text-amber-800">
                          {authUser == null ? "Please login to request medicine" : "This item is currently unavailable. You can request it and we’ll notify youwhen it’s available."}
                        </p>
                      </div>

                      <button
                        type="button"

                        // disabled={authUser == null}
                        onClick={() => authUser == null ? openLogin() : dispatch(setShowReqMedicineModal(true))}
                        className="disabled:opacity-55 shrink-0 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white  focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
                      >
                        Request medicine
                      </button>
                    </div>
                  </div>
                )}

                <MedicineInfoCard
                  returnable={medicine?.isReturnable}
                  prescriptionRequired={medicine?.prescriptionRequired}
                  typeOfMedicine={medicine?.typeOfMedicine}
                />
                {medicine?.description && (
                  <FeatureCard heading="Description" content={medicine.description} defaultOpen />
                )}

                {medicine?.expertAdvice && (
                  <FeatureCard heading="Expert Advice" content={medicine.expertAdvice} />
                )}

                {medicine?.howItWorks && (
                  <FeatureCard heading="How it Works" content={medicine.howItWorks} />
                )}

                {medicine?.howToUse && (
                  <FeatureCard heading="How to Use" content={medicine.howToUse} />
                )}
              </div>
            </div>
          </div>
        </main>
        {/* faq */}
        <Faq faqs={faqData} />
        {showReqMedicineModal && <RequestMedicineModal name={medicine?.productName} onSubmit={handleSubmitMedicineRequest} />}
      </div>
    </>
  );
};

export default medicine;
