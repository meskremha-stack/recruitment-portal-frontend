'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/applicants', label: 'Applicants', icon: '👥' },
  { href: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}