'use client';

import Image from 'next/image';

export default function SearchResultCard({ medicine }: { medicine: any }) {
  const { id, product_name, packaging_size, mrp, sale_price, images, in_stock, categories } =
    medicine;

  const img = images?.[0] || '/medicines/placeholder.jpg';
  const discount = mrp && sale_price ? Math.round(((mrp - sale_price) / mrp) * 100) : null;
console.log("is it in stock : " + product_name,in_stock);

  return (
    <article className="border border-gray-200 rounded-xl p-3 flex flex-col hover:shadow-md transition">
      <div className="relative w-full h-40 bg-white rounded-md overflow-hidden flex items-center justify-center">
        <Image
          src={img?.startsWith('http') ? img : '/no-image.png'}
          alt={product_name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, 200px"
        />
      </div>

      <div className="mt-3">
        <h2 className="text-gray-800 text-sm font-medium line-clamp-2">{product_name}</h2>
        <p className="text-xs text-gray-500">{packaging_size}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-gray-900 text-sm">
            ₹{parseFloat(sale_price).toFixed(2)}
          </span>
          <span className="text-gray-400 line-through text-xs">₹{parseFloat(mrp).toFixed(2)}</span>
          {discount && (
            <span className="text-green-600 text-xs font-semibold">{discount}% OFF</span>
          )}
        </div>

        <button
          disabled={!in_stock}
          className={`mt-3 w-full py-1.5 rounded-md text-sm font-medium ${
            in_stock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
}
