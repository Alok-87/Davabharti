'use client';
import Image from 'next/image';


interface Item {
  id: string;
  quantity: number;
  priceAtTime: number;
  medicine: {
    id: string;
    productName: string;
    productCode: string;
    prescriptionRequired: boolean;
    packagingSize: string;
    images: string[];
  };
}

interface MedicineCardProps {
  item: Item;
}

export default function PreviewCard({ item }: MedicineCardProps) {
  const total = item.priceAtTime * item.quantity;
  const placeholderImage = "/no-image.png";
  const imageSrc =
    item.medicine.images && item.medicine.images.length > 0
      ? item.medicine.images[0]
      : placeholderImage; // ✅ fallback to local image if no URL

  return (
    <div className="flex items-start justify-between border border-gray-200 rounded-md p-4 shadow-sm bg-white hover:shadow-md transition">
      {/* 🩺 Medicine Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative">
        <img
          src={imageSrc}
          alt={item.medicine.productName}
          //fill
          className="rounded-md object-contain"
          sizes="80px"
          onError={(e) => {
    e.currentTarget.src = placeholderImage;
  }}
        />
      </div>

      {/* 💊 Medicine Details */}
      <div className="flex-1 ml-4 sm:ml-6">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base">
            {item.medicine.productName}
          </h3>
          <span className="text-xs text-gray-600">
            Qty: <strong>{item.quantity}</strong>
          </span>
        </div>

        <p className="text-gray-500 text-xs mt-1">{item.medicine.packagingSize}</p>

        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600 text-sm">Price: ₹{item.priceAtTime.toFixed(2)}</p>
          <p className="font-semibold text-primary text-sm">₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
