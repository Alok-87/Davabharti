
export const dynamic = 'force-dynamic';

import nextdynamic from 'next/dynamic';
import React from 'react';

// ✅ Keep these two static imports
import ConsultationCards from '@/components/shared/page-components/ConsultationCards';

// ✅ Dynamic imports (lazy-loaded only when needed)
const DownloadAppSection = nextdynamic(() => import('@/components/shared/page-components/DownloadAppSection'));
const FeatureCards = nextdynamic(() => import('@/components/shared/card/FeatureCards'));
const FeatureSection = nextdynamic(() => import('@/components/shared/page-components/FeatureSection'));
const HeroSection = nextdynamic(() => import('@/app/home/components/Hero/HeroSection'));
const Section = nextdynamic(() => import('@/app/home/components/Section'));
const ReferSection = nextdynamic(() => import('@/components/shared/page-components/ReferSection'));
const WhyChooseUs = nextdynamic(() => import('@/components/shared/page-components/why-choose-us/WhyChooseus'));
const Membership = nextdynamic(() => import('@/components/shared/page-components/Membership'));
const BlogSection = nextdynamic(() => import('@/components/shared/page-components/BlogSection'));
const CategorySection = nextdynamic(() => import('@/components/shared/page-components/Category/CategorySection'));
const SectionTemp = nextdynamic(() => import('@/app/home/components/SectionTemp'));
const AboutDavaBharti = nextdynamic(() => import('@/components/shared/page-components/about-davabharti/AboutDavaBharti'));
const OfferStrip = nextdynamic(() => import('@/components/shared/offer-strip/OfferStrip'));
const OfferModal = nextdynamic(() => import('@/components/shared/offer-modal/OfferModal'));



import StoreHydrator from './home/components/StoreHydrator';
import { mapMedicinesToProducts } from '@/features/homepage/mapper';
import { getHomepageApi } from '@/features/homepage/homepageApi';
import { HomePageResponse } from '@/features/homepage/homepage';

export const metadata = {
  title: 'Dava Bharti',
  description:
    'Order medicines, healthcare products, and book consultations. Fast delivery and verified sellers.',
};

export default async function Home() {
  // Server-side fetch sections for SSR
  let sectionsData: HomePageResponse | null = null;
  try {
    // const res = await fetchSectionsApi({ limit: 15, offset: 0 });
    const res = await getHomepageApi();
    console.log('home', res);
    sectionsData = res;
  } catch (err) {
    // Swallow: continue rendering even if fetch fails
    sectionsData = null;
  }


  // ✅ Extract and process sections
  const sections = (sectionsData?.sections ?? [])
    .filter(
      (section) =>
        !section.is_hidden && Array.isArray(section.medicines) && section.medicines.length > 0
    )
    .sort((a, b) => {
      const seqA =
        typeof a.sequence === 'number'
          ? a.sequence
          : parseInt(a.sequence as any) || Number.MAX_SAFE_INTEGER;
      const seqB =
        typeof b.sequence === 'number'
          ? b.sequence
          : parseInt(b.sequence as any) || Number.MAX_SAFE_INTEGER;
      return seqA - seqB;
    });


  // Define the static sections in the order you want
  const staticSections = [
    <CategorySection key="category" categories={sectionsData?.categories ?? []} />,
    <FeatureSection key="feature" />,
    // <Membership key="membership" />,
    // <FeatureCards key="feature-cards" />,
    <ConsultationCards key="consultation" cards={sectionsData?.consultationCards ?? []} />
  ];

  return (
    <main>
      <StoreHydrator data={sectionsData} />
      {/* <OfferStrip  /> */}
      {/* <OfferModal /> */}
      <HeroSection />

      {/* Interleave dynamic sections with static sections */}
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          {/* Render dynamic section conditionally */}
          {section.imageUrl ? (
            <SectionTemp
              key={`temp-${section.id}`}
              title={section.name}
              products={mapMedicinesToProducts(section.medicines)}
              seeAllFilter={section.see_all_filter ?? section.id}
            />
          ) : (
            <Section
              title={section.name}
              products={mapMedicinesToProducts(section.medicines)}
              seeAllFilter={section.see_all_filter ?? section.id}
            />
          )}

          {/* Render corresponding static section if it exists */}
          {staticSections[index] && staticSections[index]}
        </React.Fragment>
      ))}
      {/* Render remaining static sections if we have more static sections than dynamic ones */}
      {staticSections.slice(sections.length).map((section, index) => (
        <React.Fragment key={`remaining-${index}`}>
          {section}
        </React.Fragment>
      ))}

      {/* Temp sections
      {sections.map((section) => (
        <SectionTemp
          key={`temp-${section.id}`}
          title={section.name}
          products={mapMedicinesToProducts(section.medicines)}
          seeAllFilter={section.see_all_filter ?? section.id}
        />
      ))} */}

      {/* <AboutUs /> */}
      <WhyChooseUs />
      <AboutDavaBharti />
      {/* <ReferSection /> */}
      <BlogSection />
      <DownloadAppSection />
    </main>
  );
}