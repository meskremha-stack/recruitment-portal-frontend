'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: '🌍',
    title: 'Global Opportunities',
    desc: 'Access verified job openings across the Middle East, Europe, Asia, and more.',
  },
  {
    icon: '🔒',
    title: 'Secure Process',
    desc: 'Your documents and personal data are encrypted and stored securely.',
  },
  {
    icon: '📋',
    title: 'Easy Application',
    desc: 'Submit your profile, upload documents, and apply to jobs in minutes.',
  },
  {
    icon: '✅',
    title: 'Verified Employers',
    desc: 'All employers and job requirements are vetted by our recruitment team.',
  },
  {
    icon: '💳',
    title: 'Transparent Payments',
    desc: 'Track every payment with receipt uploads and admin verification.',
  },
  {
    icon: '📢',
    title: 'Real-Time Updates',
    desc: 'Stay informed with announcements and application status tracking.',
  },
];

const stats = [
  { value: '5,000+', label: 'Applicants Registered' },
  { value: '200+', label: 'Jobs Posted' },
  { value: '15+', label: 'Countries' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Your Gateway to{' '}
              <span className="text-primary-300">International</span>{' '}
              Employment
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              RecruitPro connects skilled Ethiopian professionals with trusted
              employers worldwide. Start your journey to a better career today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg"
                >
                  Go to {isAdmin ? 'Admin Panel' : 'Dashboard'}
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/jobs"
                    className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-700 transition-all"
                  >
                    Browse Jobs
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RecruitPro?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide a comprehensive, transparent, and secure recruitment
              experience from application to deployment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your International Career?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Register today, complete your profile, and let us connect you with
            the best opportunities worldwide.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary-700 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}