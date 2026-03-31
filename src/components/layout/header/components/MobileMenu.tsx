// import React, { useState } from 'react'

// function MobileMenu() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//      const pathname = usePathname();
//       const isHomePage = pathname === '/';

//       useEffect(() => {
//         const token = getToken();
//         ;
//         if (token) {
//           setToken(token);
//           restore();
//         }
//       }, []);

//       const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//       };

//       const toggleDropdown = (index: any) => {
//         setActiveDropdown(activeDropdown === index ? null : index);
//       };

//   return (
//     <>
//        <div className="w-full bg-white border-b border-gray-200  md:hidden">
//         <div className="flex items-center justify-between p-4">
//           {/* Hamburger Menu Button */}
//           <button
//             onClick={toggleMenu}
//             type="button"
//             className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
//             aria-label="Open menu"
//           >
//             {isMenuOpen ? (
//               <IoIosClose className="w-6 h-6" />
//             ) : (
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 17 14"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M1 1h15M1 7h15M1 13h15"
//                 />
//               </svg>
//             )}
//           </button>

//           {/* Logo */}
//           <Link href="/">
//             <Image src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
//           </Link>

//           {/* Login and Cart */}
//           <div className="flex items-center gap-4">
//             <Link href="#" className="flex items-center gap-1 hover:text-blue-600">
//               {user ? <AccountDropdown /> : <FaRegUser className="text-xl text-gray-700" />}
//             </Link>
//             <a href="#" className="flex items-center gap-1 hover:text-blue-600">
//               <IoCartOutline className="text-xl" />
//             </a>
//           </div>
//         </div>

//         {/* Mobile Search Bar - Always visible on mobile */}
//         <div className="px-4 pb-4">
//           <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
//             <FiSearch className="text-gray-600" />
//             <input
//               type="text"
//               className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
//               placeholder="Search for Medicine"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu - Slides in from side */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-50 bg-white md:hidden mt-32 overflow-y-auto">
//           <div className="p-4 space-y-6">
//             {/* Location Section */}
//             <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-md">
//               <IoLocation className="text-gray-600" />
//               <input
//                 type="text"
//                 className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
//                 placeholder="Enter location"
//               />
//               <MdOutlineMyLocation className="text-gray-600" />
//             </div>

//             {/* Service Menu Items */}
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
//               <ul className="space-y-2">
//                 {serviceMenuItems.map((item, index) => (
//                   <li key={index} className="py-2 px-3 text-gray-700 border-b border-gray-100">
//                     <Link href={item.href}>{item.name}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Categories Section with Dropdowns */}
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
//               <ul className="space-y-2">
//                 {categories.map((category, index) => (
//                   <li key={index} className="text-gray-700 border-b border-gray-100">
//                     <button
//                       onClick={() => toggleDropdown(index)}
//                       className="w-full py-2 px-3 flex justify-between items-center hover:bg-gray-50"
//                     >
//                       {category.name}
//                       <IoIosArrowDown
//                         className={`h-4 w-4 text-gray-400 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`}
//                       />
//                     </button>
//                     {activeDropdown === index && (
//                       <ul className="ml-4 bg-gray-50 rounded-md mt-1">
//                         {category.items.map((item, itemIndex) => (
//                           <li
//                             key={itemIndex}
//                             className="py-2 px-3 text-gray-600 border-b border-gray-100 last:border-b-0"
//                           >
//                             {item}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//     </>
//   )
// }

// export default MobileMenu
