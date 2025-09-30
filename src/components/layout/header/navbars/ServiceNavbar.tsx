import React from 'react'

const ServiceNavbar = () => {
  return (
    <div className="w-full  bg-white border-b border-gray-200 ">
      <div className="flex flex-wrap  items-center justify-center mx-auto max-w-screen-xl p-4">
        {/* Mobile Menu Button */}
        <button
          data-collapse-toggle="mega-menu-full"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="mega-menu-full"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        {/* Menu Items */}
        <div className="items-center justify-center font-medium hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex items-center gap-8 font-medium">
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Medicine
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Healthcare
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Healthcare
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Doctor Consult
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Lab Test
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Health Insights
            </li>
            <li className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
              Offers
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ServiceNavbar