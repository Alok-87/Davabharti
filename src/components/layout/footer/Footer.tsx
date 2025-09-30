// components/Footer.tsx
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import googlePlay from '@/assets/google_play.png';
import appStore from '@/assets/apple_store.png';
import Image from 'next/image';
import logo from '@/assets/logo.png';

const Icons = [googlePlay, appStore];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <Image src={logo} alt="Logo" className="h-12 w-auto" />
          <p className="text-sm leading-relaxed">
            Your trusted pharmacy partner. Delivering genuine medicines, healthcare essentials, and
            wellness products at your doorstep.
          </p>
          {/* App Links */}
          <div className="flex items-center gap-3 mt-5">
            {Icons.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Store Button ${index}`}
                className="w-40 cursor-pointer rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/medicines" className="hover:text-white">
                Medicines
              </Link>
            </li>
            <li>
              <Link href="/wellness" className="hover:text-white">
                Wellness
              </Link>
            </li>
            <li>
              <Link href="/diagnostics" className="hover:text-white">
                Diagnostics
              </Link>
            </li>
            <li>
              <Link href="/devices" className="hover:text-white">
                Healthcare Devices
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Our Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-white">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-white">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social & Copyright */}
      <div className="border-t border-gray-700 mt-10 py-6 px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">© {new Date().getFullYear()} Davabharti. All rights reserved.</p>
        <div className="flex items-center gap-5 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">
            <FaFacebookF />
          </Link>
          <Link href="#" className="hover:text-white">
            <FaInstagram />
          </Link>
          <Link href="#" className="hover:text-white">
            <FaTwitter />
          </Link>
          <Link href="#" className="hover:text-white">
            <FaLinkedinIn />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
