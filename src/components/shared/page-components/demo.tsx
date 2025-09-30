// import Image from "next/image";
// import Link from "next/link";
// import type { ReactNode } from "react";
// import type { Product } from "./types"; // your existing Product type

// // --- ProductCard with SEO-ready markup ---
// export default function ProductCard_2({
//   product,
//   className = "",
//   asLink = true,
//   children,
// }: {
//   product: Product;
//   className?: string;
//   asLink?: boolean;
//   children?: ReactNode;
// }) {
//   const image = product.images?.[0] ?? "/placeholder-product.png";
//   const productHref = product.slug
//     ? `/product/${product.slug}`
//     : `/product/${product.id}`;

//   return (
//     <article
//       itemScope
//       itemType="https://schema.org/Product"
//       aria-labelledby={`product-${product.id}-title`}
//       className={`shadow-sm rounded-2xl overflow-hidden bg-white border border-slate-100 ${className}`}
//     >
//       {/* Product Image */}
//       <div className="relative w-full aspect-[4/3] bg-slate-50">
//         {asLink ? (
//           <Link href={productHref} aria-label={product.title} className="block w-full h-full">
//             <Image
//               src={image}
//               alt={product.title}
//               fill
//               sizes="(max-width: 640px) 100vw, 33vw"
//               style={{ objectFit: "cover" }}
//               priority
//             />
//           </Link>
//         ) : (
//           <Image
//             src={image}
//             alt={product.title}
//             fill
//             sizes="(max-width: 640px) 100vw, 33vw"
//             style={{ objectFit: "cover" }}
//           />
//         )}
//       </div>

//       {/* Text Content */}
//       <div className="p-4">
//         <h2
//           id={`product-${product.id}-title`}
//           itemProp="name"
//           className="text-base font-semibold truncate"
//         >
//           {asLink ? (
//             <Link href={productHref}>{product.title}</Link>
//           ) : (
//             product.title
//           )}
//         </h2>

//         {/* Rating */}
//         {product.rating && (
//           <p
//             className="text-sm text-slate-500 mt-1"
//             itemProp="aggregateRating"
//             itemScope
//             itemType="https://schema.org/AggregateRating"
//           >
//             <span itemProp="ratingValue">{product.rating.toFixed(1)}</span> ★
//             (<span itemProp="reviewCount">{product.reviewCount ?? 0}</span> reviews)
//           </p>
//         )}

//         {/* Price */}
//         <p
//           className="mt-2 text-sm font-medium text-slate-900"
//           itemProp="offers"
//           itemScope
//           itemType="https://schema.org/Offer"
//         >
//           <span itemProp="priceCurrency">{product.currency ?? "INR"}</span>{" "}
//           <span itemProp="price">{product.price}</span>
//         </p>

//         {/* Description */}
//         {product.description && (
//           <p className="mt-3 text-xs text-slate-600 line-clamp-3" itemProp="description">
//             {product.description}
//           </p>
//         )}

//         <div className="mt-4 flex items-center gap-2">
//           {/* Hydrates with CSR controls */}
//           <AddToCartButtonSkeleton available={!!product.available} productId={product.id} />
//           {children}
//         </div>
//       </div>
//     </article>
//   );
// }