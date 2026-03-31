
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type AuthModalType = 'login' | 'signup' | null;

interface ModalContextType {
  authModal: AuthModalType;
  openAuthModal: (type: AuthModalType, redirectUrl?: string) => void; // Changed to optional
  closeAuthModal: () => void;
  redirectUrl: string | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [authModal, setAuthModal] = useState<AuthModalType>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const openAuthModal = useCallback((type: AuthModalType, url?: string) => {
    setAuthModal(type);
    setRedirectUrl(url || null);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
    setRedirectUrl(null);
  }, []);

  return (
    <ModalContext.Provider value={{ authModal, openAuthModal, closeAuthModal, redirectUrl }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
