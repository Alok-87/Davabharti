

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  console.log(product);
  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : null;

  return (
    <article
      className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer relative"
      onClick={() => onClick?.(product)}
      aria-label={`Product card for ${product.name}`}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span
          className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md"
          aria-label={`${product.discount}% off`}
          role="status"
        >
          {product.discount}% OFF
        </span>
      )}

      <img
        src={product.image}
        alt={`Image of ${product.name}`}
        className="w-full aspect-square rounded-xl object-cover"
        loading="lazy"
      />

      <div className="mt-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">{product.name}</h2>
        <div className="flex flex-col items-end">
          {discountedPrice ? (
            <>
              <span
                className="text-gray-400 text-sm line-through"
                aria-label={`Original price ₹${product.price}`}
              >
                ₹{product.price}
              </span>
              <span
                className="text-indigo-600 font-bold"
                aria-label={`Discounted price ₹${discountedPrice}`}
              >
                ₹{discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-indigo-600 font-bold" aria-label={`Price ₹${product.price}`}>
              ₹{product.price}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">{product.description}</p>
    </article>
  );
};

export default ProductCard;
