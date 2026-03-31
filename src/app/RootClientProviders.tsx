'use client';

import { ReactNode } from 'react';
import ReduxProvider from '@/store/ReduxProvider';
import { ModalProvider } from '@/context/ModalContext';
import AuthModal from './(auth)/components/AuthModal';
import GlobalModalHandler from './GlobalModalHandler';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import HydrationMarker from './home/components/HydrationMarker';
import { SocketProvider } from '@/context/SocketContext';

export default function RootClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <SocketProvider>
        <ModalProvider>
          <Header />
          <AuthModal />
          {/* <GlobalModalHandler /> */}
          {children}
          <Footer />
          <HydrationMarker />
          <Toaster position="top-right" theme="light" />
        </ModalProvider>
      </SocketProvider>
    </ReduxProvider>
  );
}

