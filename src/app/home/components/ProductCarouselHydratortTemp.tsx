'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/features/sections/mapper';
import ProductCarouselClientTemp from './ProductCarouselClientTemp';

export default function ProductCarouselHydratorTemp({ products }: { products: Product[] }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  return <ProductCarouselClientTemp products={products} />;
}
