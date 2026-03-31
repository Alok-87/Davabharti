import { SectionMedicine } from "./homepage";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string;
  images: string; // Assuming we take the first image
}

export function mapMedicinesToProducts(medicines: SectionMedicine[]): Product[] {
  if (!Array.isArray(medicines)) {
    return [];
  }

  return medicines.map((medicine) => ({
    id: medicine.id,
    slug: medicine.slug,
    name: medicine.product_name,
    price: medicine.sale_price,
    description: medicine.packaging_size,
    images: medicine.images?.[0] || '/no-image.png', // Use first image or a placeholder
  }));
}
