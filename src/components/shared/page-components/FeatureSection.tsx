import { TbTruckDelivery, TbShoppingCart } from "react-icons/tb";
import { ImCreditCard } from "react-icons/im";
import { BiSupport } from "react-icons/bi";
import { LuClipboardPenLine } from "react-icons/lu";

const features = [
  {
    id: 1,
    icon: TbTruckDelivery,
    title: "Free Delivery",
    description: "For all orders over $120",
  },
  {
    id: 2,
    icon: ImCreditCard,
    title: "Safe Payment",
    description: "100% secure payment",
  },
  {
    id: 3,
    icon: TbShoppingCart,
    title: "Shop With Confidence",
    description: "If goods have problems",
  },
  {
    id: 4,
    icon: BiSupport,
    title: "24/7 Help Center",
    description: "Dedicated 24/7 support",
  },
  {
    id: 5,
    icon: LuClipboardPenLine,
    title: "Friendly Services",
    description: "30 day satisfaction guarantee",
  },
];

const FeatureSection = () => {
  return (
    <div className="w-full">
      {/* Features Section */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6 px-4 sm:px-6 md:px-20 py-6 sm:py-8 max-w-8xl mx-auto">
        {features.map(({ id, icon: Icon, title, description }) => (
          <div
            key={id}
            className="flex items-center gap-4 bg-white rounded-lg    p-4 cursor-pointer group h-full"
          >
            <div className="rounded-full bg-blue-100 flex items-center justify-center p-3">
              <Icon className="text-3xl text-gray-700 " />
            </div>
            <div>
              <h4 className="font-semibold text-base ">{title}</h4>
              <p className="text-sm text-gray-500 ">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-20 mt-6 sm:mt-3 md:mt-5">
        <div className="bg-[#a4c2ee] rounded-xl shadow-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-5 text-center">
          <h2 className="text-primary font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug sm:leading-relaxed mb-3 ">
            Dava Bharti – India's Most Trusted Online Pharmacy for Quality Medicine Delivery
          </h2>
          <p className="text-primary text-sm sm:text-base md:text-lg lg:text-lg font-normal leading-relaxed mx-auto opacity-90">
            Experience Trusted and Reliable Medicine Delivery with India's Leading Online Pharmacy – Order Now from Dava Bharti.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
