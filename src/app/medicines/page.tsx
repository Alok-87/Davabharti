'use client';

import MedicineCard from '@/components/shared/card/MedicineCard';
import Filter, { AppliedFilters } from '@/components/shared/filter/Filter';
import Shimmer from '@/components/shared/shimmer/Shimmer';
import SortingDropdown, {
  SortOption,
  sortOptions,
} from '@/components/shared/sorting/SortingDropdown';
import { fetchCategories } from '@/features/categories/categoriesThunks';
import { clearMedicines } from '@/features/medicines/medicinesSlice';
import { fetchMedicines } from '@/features/medicines/medicinesThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GiMedicines } from 'react-icons/gi';

const LIMIT = 20;

/* ---------------- ID → NAME HELPERS ---------------- */

const categoryIdToName = (id: string, categories: any[]) =>
  categories.find((c) => c.id === id)?.name || null;

const subCategoryIdToName = (id: string, categories: any[]) => {
  for (const c of categories) {
    const sub = c.subcategories?.find((s: any) => s.id === id);
    if (sub) return sub.name;
  }
  return null;
};

/* ---------------- CHIP LABEL RESOLVER ---------------- */

const getFilterLabel = (
  sectionId: string,
  value: string,
  categories: any[]
): string | null => {
  if (sectionId === 'category') {
    return categoryIdToName(value, categories);
  }

  if (sectionId === 'subCategory') {
    return subCategoryIdToName(value, categories);
  }

  const staticMap: Record<string, Record<string, string>> = {
    brand: {
      dabur: 'Dabur',
      himalaya: 'Himalaya',
      patanjali: 'Patanjali',
      cipla: 'Cipla',
      'sun-pharma': 'Sun Pharma',
    },
    condition: {
      diabetes: 'Diabetes',
      hypertension: 'Hypertension',
      'cold-flu': 'Cold & Flu',
      'pain-relief': 'Pain Relief',
      'skin-care': 'Skin Care',
    },
    form: {
      tablet: 'Tablet',
      capsule: 'Capsule',
      syrup: 'Syrup',
      ointment: 'Ointment',
      injection: 'Injection',
    },
  };

  return staticMap[sectionId]?.[value] || value;
};

/* ---------------- API PARAM BUILDER (IDS) ---------------- */

const buildFilterParams = (
  filters: AppliedFilters,
  sort: SortOption | null,
  categories: any[]
) => {
  const categoryIds = filters['category'] || [];
  const subCategoryIds = filters['subCategory'] || [];

  return {
    categoryIds: categoryIds.length ? categoryIds.join(',') : undefined,
    subCategoryIds: subCategoryIds.length ? subCategoryIds.join(',') : undefined,
    brand: filters['brand']?.join(',') || undefined,
    condition: filters['condition']?.join(',') || undefined,
    form: filters['form']?.join(',') || undefined,
    column: sort?.column || undefined,
    order_by: sort?.column ? sort.order : undefined,
  };
};

/* ---------------- URL → FILTERS (NAMES → IDS) ---------------- */

const parseFiltersFromSearchParams = (
  searchParams: URLSearchParams,
  categories: any[]
): AppliedFilters => {
  const out: AppliedFilters = {};

  const categoryNames = searchParams.get('categoryNames');
  if (categoryNames) {
    const ids = categoryNames
      .split(',')
      .map((n) => categories.find((c) => c.name === n)?.id)
      .filter(Boolean) as string[];
    if (ids.length) out.category = ids;
  }

  const subCategoryNames = searchParams.get('subCategoryNames');
  if (subCategoryNames) {
    const ids: string[] = [];
    subCategoryNames.split(',').forEach((name) => {
      for (const c of categories) {
        const sub = c.subcategories?.find((s: any) => s.name === name);
        if (sub) {
          ids.push(sub.id);
          break;
        }
      }
    });
    if (ids.length) out.subCategory = ids;
  }

  const brand = searchParams.get('brand');
  if (brand) out.brand = brand.split(',');

  const condition = searchParams.get('condition');
  if (condition) out.condition = condition.split(',');

  const form = searchParams.get('form');
  if (form) out.form = form.split(',');

  return out;
};

const isFiltersEqual = (a: AppliedFilters, b: AppliedFilters) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = (a[k] || []).slice().sort();
    const vb = (b[k] || []).slice().sort();
    if (va.length !== vb.length) return false;
    for (let i = 0; i < va.length; i++) if (va[i] !== vb[i]) return false;
  }
  return true;
};

/* ============================ PAGE ============================ */

const Medicines = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const { items: medicines, loading, error, total } = useAppSelector(
    (s) => s.medicines
  );
  const { items: categories, loading: categoriesLoading } = useAppSelector(
    (s) => s.categories
  );

  const [page, setPage] = useState(0);
  const hasMore = medicines.length < total;

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});
  const [tempFilters, setTempFilters] = useState<AppliedFilters>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [initializing, setInitializing] = useState(true);
  const [showScroll, setShowScroll] = useState(false);

  const lastAppliedFromUrlRef = useRef<string | null>(null);

  /* ---------------- FETCH CATEGORIES ---------------- */

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [categories.length, categoriesLoading, dispatch]);

  /* ---------------- INIT FROM URL ---------------- */

  useEffect(() => {
    const params = new URLSearchParams(searchParamsHook.toString());

    const hasNameFilters =
      params.get('categoryNames') || params.get('subCategoryNames');

    if (hasNameFilters && categories.length === 0) return;

    const urlFilters = parseFiltersFromSearchParams(params, categories);
    const key = JSON.stringify(urlFilters);

    if (lastAppliedFromUrlRef.current === key && !initializing) return;

    setInitializing(true);
    dispatch(clearMedicines());

    setAppliedFilters(urlFilters);
    setTempFilters(urlFilters);

    dispatch(
      fetchMedicines({
        limit: LIMIT,
        offset: 0,
        ...buildFilterParams(urlFilters, selectedSort, categories),
      })
    );

    lastAppliedFromUrlRef.current = key;
    setInitializing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsHook.toString(), categories]);

  /* ---------------- FETCH ON CHANGE ---------------- */

  useEffect(() => {
    if (initializing) return;

    setPage(0);

    dispatch(
      fetchMedicines({
        limit: LIMIT,
        offset: 0,
        ...buildFilterParams(appliedFilters, selectedSort, categories),
      })
    );

    const params = new URLSearchParams();

    const catNames = (appliedFilters.category || [])
      .map((id) => categoryIdToName(id, categories))
      .filter(Boolean);

    const subNames = (appliedFilters.subCategory || [])
      .map((id) => subCategoryIdToName(id, categories))
      .filter(Boolean);

    if (catNames.length) params.set('categoryNames', catNames.join(','));
    if (subNames.length)
      params.set('subCategoryNames', subNames.join(','));
    if (appliedFilters.brand?.length)
      params.set('brand', appliedFilters.brand.join(','));
    if (appliedFilters.condition?.length)
      params.set('condition', appliedFilters.condition.join(','));
    if (appliedFilters.form?.length)
      params.set('form', appliedFilters.form.join(','));

    if (selectedSort?.column) {
      params.set('column', selectedSort.column);
      params.set('order_by', selectedSort.order);
    }

    router.replace(`/medicines?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, selectedSort, initializing]);

  /* ---------------- LOAD MORE ---------------- */

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(
      fetchMedicines({
        limit: LIMIT,
        offset: next,
        ...buildFilterParams(appliedFilters, selectedSort, categories),
      })
    );
  };

  const applyFilters = (filters: AppliedFilters) => {
    if (isFiltersEqual(filters, appliedFilters)) return;
    setAppliedFilters(filters);
    setTempFilters(filters);
  };

  const removeFilter = (sectionId: string, value: string) => {
    setAppliedFilters((prev) => {
      const updated = { ...prev };
      updated[sectionId] = updated[sectionId]?.filter((v) => v !== value) || [];
      if (updated[sectionId].length === 0) delete updated[sectionId];
      return updated;
    });
  };

  /* ---------------- SCROLL TO TOP ---------------- */

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------------- CHIPS ---------------- */

  const chips = Object.entries(appliedFilters).flatMap(
    ([section, values]) =>
      values
        .map((value) => ({
          section,
          value,
          label: getFilterLabel(section, value, categories),
        }))
        .filter((c) => c.label)
  );

  /* ---------------- LOADING ---------------- */

  if (initializing || categoriesLoading) {
    return null;
  }

  /* ============================ UI (UNCHANGED) ============================ */

  return (
    <div className="bg-white w-full px-4 sm:px-6 md:px-1 max-w-7xl mx-auto md:mt-4">
      <div className="flex flex-col lg:flex-row lg:gap-x-8 relative">
        <aside className="w-full lg:w-64 lg:sticky lg:top-36 h-fit">
          <Filter
            appliedFilters={appliedFilters}
            setAppliedFilters={applyFilters}
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
          />
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip) => (
              <span
                key={`${chip.section}-${chip.value}`}
                className="inline-flex items-center gap-1 bg-gray-100 text-xs px-3 py-1.5 rounded-full border"
              >
                {chip.label}
                <button
                  onClick={() =>
                    removeFilter(chip.section, chip.value)
                  }
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Shimmer key={i} className="p-2" elements={[
                   { width: 'w-full', height: 'h-40', rounded: 'rounded-lg' },
                    { width: 'w-3/4', height: 'h-4' },
                    { width: 'w-1/2', height: 'h-4' },
                ]} />
              ))
            ) : medicines.length ? (
              medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  product={{
                    id: medicine.id,
                    slug: medicine.slug,
                    name: medicine.product_name,
                    description: medicine.packaging_size ?? '',
                    price: `₹${medicine.sale_price}`,
                    imageSrc: medicine.images?.[0] ?? '/placeholder.jpg',
                    imageAlt: medicine.product_name,
                    in_stock: medicine.in_stock,
                    href: '#',
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <GiMedicines className="text-5xl mx-auto" />
                <p>No medicines found</p>
              </div>
            )}
          </div>

          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Load More
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-4">
              Failed to load medicines
            </p>
          )}
        </main>
      </div>

      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Medicines;
