'use client';
import { useState, useEffect } from 'react';
import ProductCarouselClient from './ProductCarouselClient';
import { Product } from './ProductCard';

export default function ProductCarouselHydrator({ products }: { products: Product[] }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  return <ProductCarouselClient products={products} />;
}
