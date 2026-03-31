import AuthGuard from '../(auth)/components/AuthGuard';
import UserSidebar from './components/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex justify-center bg-gray-50 pb-10 px-1">
      <div className="w-full max-w-7xl flex flex-col md:flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="mt-0 lg:mt-6">
          <UserSidebar />
        </aside>

        {/* Main Content */}
        <main className="bg-gray-50 mt-6 flex-1">{children}</main>
      </div>
    </div>
    </AuthGuard>
  );
}
