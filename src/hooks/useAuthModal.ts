'use client';
import { useModal } from '@/context/ModalContext';

export function useAuthModal() {
  const { openAuthModal, closeAuthModal } = useModal();

  const openLogin = (redirectUrl?: string) => openAuthModal('login', redirectUrl);
  const openSignup = (redirectUrl?: string) => openAuthModal('signup', redirectUrl);

  return {
    openLogin,
    openSignup,
    closeAuthModal,
  };
}
