import ProductCarouselClient from './ProductCarouselClient';
import ProductCarouselHydrator from './ProductCarouselHydrator';

export interface Product {
  id: string;              // changed from number -> string
  name: string;
  price: number;           // changed from string -> number
  discount?: number;       // optional discount
  description: string;
  image: string;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Face cream', price: 100, discount: 20, description: 'Orange & Aloe Vera', image: 'https://pagedone.io/asset/uploads/1700726158.png' },
  { id: '2', name: 'Plastic bottle', price: 40, description: 'Black color', image: 'https://pagedone.io/asset/uploads/1700726174.png' },
  { id: '3', name: 'Men cream', price: 100, discount: 10, description: 'Aloe Vera and Neem', image: 'https://pagedone.io/asset/uploads/1700726191.png' },
  { id: '4', name: 'Cold Perfume', price: 100, description: 'White perfume', image: 'https://pagedone.io/asset/uploads/1700726207.png' },
  { id: '5', name: 'Face cream1', price: 100, discount: 15, description: 'Orange & Aloe Vera', image: 'https://pagedone.io/asset/uploads/1700726158.png' },
  { id: '6', name: 'Plastic bottle222', price: 40, description: 'Black color', image: 'https://pagedone.io/asset/uploads/1700726174.png' },
  { id: '7', name: 'Men cream222', price: 100, discount: 25, description: 'Aloe Vera and Neem', image: 'https://pagedone.io/asset/uploads/1700726191.png' },
  { id: '8', name: 'Cold Perfum222e', price: 100, description: 'White perfume', image: 'https://pagedone.io/asset/uploads/1700726207.png' },
];



export default function ProductCard() {
  return (
    <section aria-labelledby="product-list-heading" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="product-list-heading" className="text-3xl font-semibold mb-6">Product list</h2>

      {/* SSR Grid for SEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ssr-grid" role="list">
        {PRODUCTS.map(p => (
          <article key={p.id} role="listitem" className="bg-white p-4 rounded-md shadow-sm">
            <a href={`/product/${p.id}`} aria-label={p.name}>
              <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-md" />
              <h3 className="mt-3 text-lg font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.description}</p>
              <div className="mt-2 font-semibold text-indigo-600">{p.price}</div>
            </a>
          </article>
        ))}
      </div>

      {/* CSR Carousel */}
      <div className="mt-8">
        <ProductCarouselHydrator products={PRODUCTS}  />
      </div>
    </section>
  );
}
