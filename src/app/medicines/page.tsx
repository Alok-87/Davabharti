import Filter from "@/components/shared/filter/Filter";
import MedicineCard from "@/components/shared/card/MedicineCard";

const products = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    description: 'Used to reduce fever and relieve mild to moderate pain.',
    price: '₹50',
    rating: 5,
    reviewCount: 38,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-01.jpg',
    imageAlt: 'Paracetamol 500mg tablets',
    href: '#',
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    description: 'An antibiotic for bacterial infections like throat, chest, and urinary tract.',
    price: '₹120',
    rating: 5,
    reviewCount: 18,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-02.jpg',
    imageAlt: 'Amoxicillin capsules',
    href: '#',
  },
  {
    id: 3,
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergies, runny nose, and sneezing.',
    price: '₹30',
    rating: 5,
    reviewCount: 14,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-03.jpg',
    imageAlt: 'Cetirizine tablets',
    href: '#',
  },
  {
    id: 4,
    name: 'Ibuprofen 400mg',
    description: 'Helps reduce inflammation, pain, and fever.',
    price: '₹80',
    rating: 4,
    reviewCount: 21,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-04.jpg',
    imageAlt: 'Ibuprofen tablets',
    href: '#',
  },
  {
    id: 5,
    name: 'Azithromycin 500mg',
    description: 'Antibiotic for respiratory tract and skin infections.',
    price: '₹150',
    rating: 4,
    reviewCount: 22,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-05.jpg',
    imageAlt: 'Azithromycin tablets',
    href: '#',
  },
  {
    id: 6,
    name: 'Vitamin C Tablets',
    description: 'Boosts immunity and helps in recovery from cold & flu.',
    price: '₹60',
    rating: 5,
    reviewCount: 64,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-06.jpg',
    imageAlt: 'Vitamin C tablets',
    href: '#',
  },
  {
    id: 7,
    name: 'Metformin 500mg',
    description: 'Used to control blood sugar levels in type 2 diabetes.',
    price: '₹90',
    rating: 4,
    reviewCount: 12,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-07.jpg',
    imageAlt: 'Metformin tablets',
    href: '#',
  },
  {
    id: 8,
    name: 'Omeprazole 20mg',
    description: 'Reduces stomach acid, useful in acidity and ulcers.',
    price: '₹70',
    rating: 4,
    reviewCount: 41,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-08.jpg',
    imageAlt: 'Omeprazole capsules',
    href: '#',
  },
  {
    id: 9,
    name: 'Calcium + Vitamin D3',
    description: 'Strengthens bones and prevents calcium deficiency.',
    price: '₹110',
    rating: 5,
    reviewCount: 24,
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-05-image-card-09.jpg',
    imageAlt: 'Calcium + Vitamin D3 tablets',
    href: '#',
  },
]

const Medicines = () => {
  return (
    <div className="bg-white w-full">
      <div className="mx-auto  px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:gap-x-8">
        {/* Filter Section */}
        <aside className="w-full lg:w-55 mb-6 lg:mb-0">
          <Filter />
        </aside>
        {/* Medicines Grid */}
        <main className="flex-1">
          <h2 className="sr-only">Medicines</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <MedicineCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>

  );
};

export default Medicines;

