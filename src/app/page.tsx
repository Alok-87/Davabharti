import AboutUs from '@/components/shared/page-components/about-us/AboutUs';
import BlogSection from '@/components/shared/page-components/BlogSection';
import ConsultationCards from '@/components/shared/page-components/ConsultationCards';
import DownloadAppSection from '@/components/shared/page-components/DownloadAppSection';
import FeatureCards from '@/components/shared/card/FeatureCards';
import FeatureSection from '@/components/shared/page-components/FeatureSection';
import HeroSection from '@/app/home/components/Hero/HeroSection';
import ProductCard from '@/app/home/components/ProductCard';
import ReferSection from '@/components/shared/page-components/ReferSection';
import WhyChooseUs from '@/components/shared/page-components/why-choose-us/WhyChooseus';
import { Metadata } from 'next';

// Static product list (used server-side for SEO fallback)
// In real app replace with server fetch (fetch(url, { next: { revalidate: 60 } }))
const PRODUCTS = [
  {
    id: 1,
    name: 'Face cream',
    price: 100,
    description: 'Orange & Aloe Vera',
    image: 'https://pagedone.io/asset/uploads/1700726158.png',
  },
  {
    id: 2,
    name: 'Plastic bottle',
    price: 40,
    description: 'Black color',
    image: 'https://pagedone.io/asset/uploads/1700726174.png',
  },
  {
    id: 3,
    name: 'Men cream',
    price: 100,
    description: 'Aloe Vera and Neem',
    image: 'https://pagedone.io/asset/uploads/1700726191.png',
  },
  {
    id: 4,
    name: 'Cold Perfume',
    price: 100,
    description: 'White perfume',
    image: 'https://pagedone.io/asset/uploads/1700726207.png',
  },
  {
    id: 5,
    name: 'Luxury Soap',
    price: 20,
    description: 'Lavender fragrance',
    image: 'https://pagedone.io/asset/uploads/1700726210.png',
  },
  {
    id: 6,
    name: 'Hair Oil',
    price: 15,
    description: 'Coconut & Almond',
    image: 'https://pagedone.io/asset/uploads/1700726222.png',
  },
  {
    id: 7,
    name: 'Shampoo',
    price: 25,
    description: 'Herbal extracts',
    image: 'https://pagedone.io/asset/uploads/1700726234.png',
  },
  {
    id: 8,
    name: 'Body Lotion',
    price: 30,
    description: 'Moisturizing Aloe',
    image: 'https://pagedone.io/asset/uploads/1700726248.png',
  },
];

export const metadata: Metadata = {
  title: 'MedShop — Buy Medicines & Health Products Online',
  description:
    'Order medicines, healthcare products, and book consultations. Fast delivery and verified sellers.',
};

export default function Home() {
  // Page is server-rendered -> good for SEO.
  // Interactive carousels are mounted client-side below.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MedShop',
    url: 'https://yourdomain.example',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yourdomain.example/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const productsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://yourdomain.example/product/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <FeatureCards />
      <ConsultationCards />
      <ProductCard />
      <AboutUs />
      <WhyChooseUs />
      <ReferSection />
      <BlogSection />
      <DownloadAppSection />
    </main>
  );
}
