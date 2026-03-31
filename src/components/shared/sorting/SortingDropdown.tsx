'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface SortOption {
  value: string;
  label: string;
  column: string;
  order: 'ASC' | 'DESC';
}

export const sortOptions: SortOption[] = [
  { value: 'default', label: 'Recommended', column: '', order: 'ASC' },
  { value: 'name-asc', label: 'Name: A to Z', column: 'product_name', order: 'ASC' },
  { value: 'name-desc', label: 'Name: Z to A', column: 'product_name', order: 'DESC' },
  { value: 'price-asc', label: 'Price: Low to High', column: 'sale_price', order: 'ASC' },
  { value: 'price-desc', label: 'Price: High to Low', column: 'sale_price', order: 'DESC' },
  { value: 'code-asc', label: 'Product Code: A to Z', column: 'product_code', order: 'ASC' },
  { value: 'code-desc', label: 'Product Code: Z to A', column: 'product_code', order: 'DESC' },
];

interface SortingDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sortOption: SortOption) => void;
  disabled?: boolean;
}

const SortingDropdown = ({
  selectedSort,
  onSortChange,
  disabled = false,
}: SortingDropdownProps) => {
  const handleValueChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value) || sortOptions[0];
    onSortChange(option);
  };

  return (
    <div className="w-full ">
      <Select value={selectedSort.value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger className="w-full h-8 border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="flex items-center justify-between w-full cursor-pointer ">
            <span className="text-sm text-gray-700 truncate">Sort: {selectedSort.label}</span>
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="bg-white border-gray-200 shadow-lg max-h-60">
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingDropdown;
