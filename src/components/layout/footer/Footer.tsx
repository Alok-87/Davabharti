// components/Footer.tsx
import appStore from '@/assets/apple_store.png';
import googlePlay from '@/assets/google_play.png';
import logo from '@/assets/logo.png';
import { MdEmail } from 'react-icons/md';
import { BiPhone } from 'react-icons/bi';
import Version from '@/components/shared/version/Version';
import Image from 'next/image';
import Link from 'next/link';


const Icons = [googlePlay, appStore];

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <Link href="/" className="flex justify-center lg:justify-start">
              <Image src={logo} className="h-20 w-auto" alt="logo" />
            </Link>
            <p className="py-8 text-sm text-gray-500 lg:max-w-xs text-center lg:text-left">
              Trusted across India with over 1 lakh happy customers.
            </p>
            {/* <a
              href="javascript:;"
              className="py-2.5 px-5 h-9 block w-fit bg-primary rounded-full shadow-sm text-xs text-white mx-auto transition-all duration-500 hover:bg-indigo-700 lg:mx-0"
            >
              Contact us
            </a> */}
          </div>

          <div className="lg:mx-auto text-center">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Features</h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/medicines" className="text-gray-600 hover:text-gray-900">
                  Medicines
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/select-prescription" className="text-gray-600 hover:text-gray-900">
                  Quick Order
                </Link>
              </li>
              <li>
                <Link href="/Inquiry" className="text-gray-600 hover:text-gray-900">
                  Inquiry
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-center">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Quick Links</h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link href="/user/orders" className="text-gray-600 hover:text-gray-900">
                  My Orders
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/offers" className="text-gray-600 hover:text-gray-900">
                  Offers
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/Inquiry" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-center">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Services</h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link href="/comming-soon" className="text-gray-600 hover:text-gray-900">
                  Diagnostics
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/comming-soon" className="text-gray-600 hover:text-gray-900">
                  Doctors
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/blogs" className="text-gray-600 hover:text-gray-900">
                  Health Insight
                </Link>
              </li>
              <li>
                <Link href="/comming-soon" className="text-gray-600 hover:text-gray-900">
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-center">
            <h4 className="text-lg text-gray-900 font-medium mb-7"> Policy Info</h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <Link href="/about-us" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-6">
                <Link href="/terms-condition" className="text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-600 hover:text-gray-900">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:mx-auto text-center">
            <h4 className="text-lg text-gray-900 font-medium mb-7"> Contact Us</h4>
            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <a href="tel:+918955801801" className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900">
                  <BiPhone /> +918955801801
                </a>
              </li>
              <li className="mb-6">
                <a href="mailto:care@davabharti.com" className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900">
                  <MdEmail />  care@davabharti.com
                </a>
              </li>


            </ul>
          </div>
        </div>

        <div className="py-7 border-t border-gray-200">
          <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
            <span className="text-sm text-gray-500">
              Copyright © 2025 Dava Bharti. All rights reserved.
            </span>
            <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
              <Link
                href="https://www.facebook.com/davabhartionlinepharmacy"
                target="_blank"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-blue-600 transition"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.073C22 6.504 17.523 2 12 2S2 6.504 2 12.073C2 17.094 5.657 21.128 10.438 22v-7.007H7.898v-2.92h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.47h-1.261c-1.243 0-1.63.774-1.63 1.563v1.88h2.773l-.443 2.92h-2.33V22C18.343 21.128 22 17.094 22 12.073Z" />
                </svg>
              </Link>

              <Link
                href="https://www.instagram.com/davabhartipharma"
                target="_blank"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-pink-500 transition"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 8.5zm5.75-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
                </svg>
              </Link>

              <Link
                href="https://x.com/bharti_dava"
                target="_blank"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-sky-500 transition"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 5.924a8.518 8.518 0 0 1-2.357.646 4.15 4.15 0 0 0 1.804-2.27 8.43 8.43 0 0 1-2.65 1.002 4.178 4.178 0 0 0-7.126 3.814 11.84 11.84 0 0 1-8.605-4.32 4.115 4.115 0 0 0-.565 2.098 4.178 4.178 0 0 0 1.86 3.474 4.168 4.168 0 0 1-1.889-.51v.05a4.19 4.19 0 0 0 3.35 4.104 4.224 4.224 0 0 1-1.884.07 4.19 4.19 0 0 0 3.918 2.907A8.394 8.394 0 0 1 2 19.54a11.83 11.83 0 0 0 6.29 1.84c7.547 0 11.675-6.072 11.675-11.337 0-.172-.005-.344-.013-.515A8.18 8.18 0 0 0 22.23 5.924z" />
                </svg>
              </Link>

              <Link
                href="https://www.linkedin.com/in/dava-bharti-552065248/"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-blue-700"
              >
                <svg className="w-[1rem] h-[1rem] text-white" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M2.8794 11.5527V3.86835H0.318893V11.5527H2.87967H2.8794ZM1.59968 2.81936C2.4924 2.81936 3.04817 2.2293 3.04817 1.49188C3.03146 0.737661 2.4924 0.164062 1.61666 0.164062C0.74032 0.164062 0.167969 0.737661 0.167969 1.49181C0.167969 2.22923 0.723543 2.8193 1.5829 2.8193H1.59948L1.59968 2.81936ZM4.29668 11.5527H6.85698V7.26187C6.85698 7.03251 6.87369 6.80255 6.94134 6.63873C7.12635 6.17968 7.54764 5.70449 8.25514 5.70449C9.18141 5.70449 9.55217 6.4091 9.55217 7.44222V11.5527H12.1124V7.14672C12.1124 4.78652 10.8494 3.68819 9.16483 3.68819C7.78372 3.68819 7.17715 4.45822 6.84014 4.98267H6.85718V3.86862H4.29681C4.33023 4.5895 4.29661 11.553 4.29661 11.553L4.29668 11.5527Z" fill="currentColor" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
      {/* <Version /> */}
    </footer>
  );
};

export default Footer;
