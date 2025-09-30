import { IoIosArrowDown } from 'react-icons/io';

const CategoriesNavbar = () => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between space-x-6">
          {/* Dropdown Item */}
          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Health Resource Center <IoIosArrowDown className="h-3 w-3" />
            </div>
            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-md rounded-md w-56 py-2 z-50">
              <div className="block px-4 py-2 text-gray-700 hover:bg-gray-100">All Diseases</div>
              <div className="block px-4 py-2 text-gray-700 hover:bg-gray-100">All Medicines</div>
              <div className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Medicines by Therapeutic Class
              </div>
            </div>
          </div>

          {/* Other Nav Items */}
          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Hair Care <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Fitness & Health <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Sexual Wellness <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Vitamins & Nutrition <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Supports & Braces <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Immunity Boosters <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              Homeopathy <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>

          <div className="relative group py-4">
            <div className="flex items-center text-gray-800 font-medium text-sm gap-1">
              First Aid <IoIosArrowDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesNavbar;
