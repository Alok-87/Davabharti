'use client';
import React from 'react';
import AuthGuard from '../(auth)/components/AuthGuard';

function layout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export default layout;
