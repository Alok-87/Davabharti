// components/GlobalModalHandler.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';

export default function GlobalModalHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuthModal } = useModal();
  const [hasHandledModal, setHasHandledModal] = useState(false);

  useEffect(() => {
    // Only run on client side after hydration
    const modalParam = searchParams.get('openAuthModal');

    if (modalParam === 'signup' && !hasHandledModal) {
      console.log('Opening signup modal from URL parameter');
      
      // Set flag first to prevent re-triggering
      setHasHandledModal(true);
      
      // Open modal first
      openAuthModal('signup');

      // Clean URL after a short delay to ensure modal is open
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('openAuthModal');
        
        // Use replaceState to avoid navigation and hydration issues
        window.history.replaceState({}, '', url.toString());
        
        console.log('URL cleaned, modal should be open');
      }, 100);
    }
  }, [searchParams, openAuthModal, hasHandledModal]);

  return null;
}