// export interface Medicine {
//   typeOfMedicine: string;
//   status: string;
//   prescriptionRequired: boolean;
//   isReturnable: boolean;
//   productCode: string;
//   productName: string;
//   productCompany: string;
//   packagingSize: string;
//   pregnancyInteraction: string;
//   expertAdvice: string;
//   sideEffects: string;
//   medicineInteraction: string;
//   productComposition: string;
//   usesIndications: string;
//   howToUse: string;
//   howItWorks: string;
//   faq: string;
//   interactionsWarnings: string;
//   alcoholInteraction: string;
//   description: string;
//   mrp: number;
//   salePrice: number;
//   categoryIds: string[];
//   subCategoryIds: string[];
//   images?: string[]; // optional — API in progress
// }
// export interface Medicine {
//   id: string;
//   type_of_medicine?: string;
//   status?: string;
//   product_name: string;      // backend name
//   packaging_size?: string;
//   mrp?: string;
//   sale_price?: string;
//   categories?: string[];
//   subcategories?: string[];
// }

// Response wrapper for the list endpoint. Many APIs return { data, meta } or { items, total }.
// This type aims to be flexible; parse in the API function.
// export interface MedicinesListResponse {
//   items: Medicine[];
//   total: number;
//   limit?: number;
//   offset?: number;
//   categoryIds?: string;
//    brand?: string;
//   form?: string;
//   condition?: string;
// }

// ✅ Simplified type for medicine list (used in sections, home page, etc.)
export interface Medicine {
  id: string;
  slug: string;
  type_of_medicine?: string;
  status?: string;
  product_name: string; // backend name
  packaging_size?: string;
  mrp?: string;
  images?: string[];
  sale_price?: string;
  categories?: string[];
  subcategories?: string[];
  in_stock: string;
}

// ✅ Detailed type for /medicine/:id
export interface Category {
  name: string;
  isActive?: boolean;
  categoryId: string;
}

export interface SubCategory {
  name: string;
  categoryId: string;
  subCategoryId: string;
}

export interface MedicineDetail {
  id: string;
  slug: string;
  typeOfMedicine: string;
  status: string;
  prescriptionRequired: boolean;
  isReturnable: boolean;
  productCode: string;
  productName: string;
  productCompany: string;
  packagingSize: string;
  pregnancyInteraction: string;
  expertAdvice: string;
  sideEffects: string;
  medicineInteraction: string;
  productComposition: string;
  usesIndications: string;
  howToUse: string;
  howItWorks: string;
  faq: string;
  description: string;
  mrp: string;
  salePrice: string;
  interactionsWarnings: string | null;
  alcoholInteraction: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  subCategories: SubCategory[];
  images: string[];
  inStock: string;
}

// ✅ Response wrapper for list endpoint
export interface MedicinesListResponse {
  items: Medicine[];
  total: number;
  limit?: number;
  offset?: number;
  categoryIds?: string;
  brand?: string;
  form?: string;
  condition?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
