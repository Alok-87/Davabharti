'use client'
import { Product } from '@/features/homepage/mapper';
import ProductCarouselHydrator from './ProductCarouselHydrator';

export default function Section({
  title,
  products = [],
  seeAllFilter,
}: {
  title: string;
  products?: Product[];
  seeAllFilter?: string | null;
}) {
  // SSR grid still rendered server-side for SEO. This component is client, but
  // in your app router you can also export a server component variant. For simplicity
  // we keep this client and rely on server to pass products as props.

  // Fallback static grid if products empty
  const fallbackProducts = [
    {
      id: 'placeholder-1',
      name: 'Product',
      price: 0,
      description: 'Description',
      images: '/placeholder.png',
    },
  ];


  const gridProducts = products.length ? products : fallbackProducts;


  const seeAllHref = seeAllFilter
    ? `/medicines?category=${encodeURIComponent(seeAllFilter)}`
    : '/medicines';

  return (
    <section
      aria-labelledby="product-list-heading"
      className="py-0.5 sm:py-2 mx-auto px-4 sm:px-6 "
    >
      <div className="flex justify-between py-1 sm:py-2 px-4 ">
        <h2
          id="product-list-heading"
          className="text-[14px] text-[24px] text-gray-600 font-semibold "
        >
          {title}
        </h2>
        {/* <div className='flex justify-end'>
<Link href={seeAllHref} className='bg-primary px-3 py-1 text-white text-lg rounded hover:opacity-[0.8]'>See All</Link>
</div> */}
      </div>

      {/* SSR Grid for SEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ssr-grid" role="list">
        {gridProducts.map((p) => (
          <article key={p.id} role="listitem" className="bg-white p-4 rounded-md shadow-sm">
            <a href={`/product/${p.id}`} aria-label={p.name}>
              <img
                src={p.images}
                alt={p.name}
                className="w-full aspect-square object-cover rounded-md"
              />
              <h3 className="mt-3 text-lg font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.description}</p>
              <div className="mt-2 font-semibold text-indigo-600">{p.price}</div>
            </a>
          </article>
        ))}
      </div>

      {/* CSR Carousel Hydrator */}
      <div className=" py-0.5 md:py-2">
        <ProductCarouselHydrator products={gridProducts} />
      </div>
    </section>
  );
}
