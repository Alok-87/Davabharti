import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import HydrationMarker from './home/components/HydrationMarker';
import ReduxProvider from '@/store/ReduxProvider';
import { Toaster } from '@/components/ui/sonner';
import { ModalProvider } from '@/context/ModalContext';
import AuthModal from './(auth)/components/AuthModal';
import GlobalModalHandler from './GlobalModalHandler';
import RootClientProviders from './RootClientProviders';
import Script from "next/script";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dava Bharti | Dava Bharti | Online Pharmacy in India | Buy Medicines Online',
  description: 'Dava Bharti | Dava Bharti | Online Pharmacy in India | Buy Medicines Online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>

        {/* --- ✅ Google Analytics Script --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CCJ9B0X630"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CCJ9B0X630');
          `}
        </Script>
        {/* ----------------------------------- */}

        <RootClientProviders>{children}</RootClientProviders>
      </body>
    </html>
  );
}
