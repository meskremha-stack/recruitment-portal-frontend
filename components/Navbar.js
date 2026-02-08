'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                RecruitPro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/jobs"
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/announcements"
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
            >
              Announcements
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.first_name}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      {!isAdmin && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/login" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="space-y-1">
              <Link
                href="/jobs"
                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/announcements"
                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Announcements
              </Link>
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-3 space-y-2 px-3">
                  <Link
                    href="/login"
                    className="block w-full text-center btn-secondary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center btn-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}