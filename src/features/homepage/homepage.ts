export interface HomePageResponse {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date

  aboutUs: AboutUs;

  heroSection: HeroSection;

  consultationCards: ConsultationCard[];

  categories: Category[];

  sections: Section[];
}

export interface AboutUs {
  content: string; // HTML string
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  desktopImages: string[];
  mobileImages: string[];
  homePageId: string;
}

export interface ConsultationCard {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: string; // e.g., "Pill" | "Stethoscope" etc (you can narrow later)
  bg: string;   // e.g., "bg-blue-50"
  homePageId: string;
}

export interface Category {
  id: string; // uuid
  name: string;
  is_active: boolean;
  imageUrl: string;
  sub_category_count: number;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string; // uuid
  name: string;
}

export interface Section {
  id: string; // uuid
  name: string;
  imageUrl: string | null;
  see_all_filter: string | null;
  isHidden: boolean;
  sequence: number;
  medicines: SectionMedicine[];
  is_hidden:string;
}

export interface SectionMedicine {
  id: string; // uuid
  sequence: number;
  product_name: string;
  type_of_medicine: string;
  status: string; // "Enable" etc (can be union if you want)
  packaging_size: string;
  mrp: number;
  sale_price: number;
  slug: string;
  images: string[];
}
