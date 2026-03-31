import { useRef, useEffect, useState } from 'react';
import Carousel from '@/components/shared/carousel/Carousel';
import ShimmerProductCard from '@/components/shared/shimmer/ShimmerProductCard';
import ProductCard, { Product } from '@/components/shared/card/ProductCard';
import Link from 'next/link';
import MedicineCardTemp from '@/components/shared/card/MedicineCardTemp';

interface ProductCarouselClientProps {
  products: Product[];
}

export default function ProductCarouselClientTemp({ products }: ProductCarouselClientProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  const updateHeights = () => {
    const heights = cardRefs.current.map((el) => el?.offsetHeight || 0);
    const tallest = Math.max(...heights);
    setMaxHeight(tallest);
  };

  // Measure heights after first render & when products change
  useEffect(() => {
    updateHeights();
  }, [products]);

  // Update heights on window resize
  useEffect(() => {
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, []);
 
  return (
    <>
      <Carousel<Product>
        items={products}
        loading={false}
        slidesPerViewDesktop={6}
        slidesPerViewTablet={2}
        slidesPerViewMobile={1.4}
        spaceBetween={6}
        renderItem={(product, idx) => (
          <div
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            // Only set height after measurement
            style={maxHeight ? { minHeight: maxHeight } : undefined}
          >
            <MedicineCardTemp product={product}  />
          </div>
        )}
        renderLoader={() => <ShimmerProductCard />}
      />
    </>
  );
}
