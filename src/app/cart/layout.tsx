import AuthGuard from '@/app/(auth)/components/AuthGuard';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}