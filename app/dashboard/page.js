'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { jobsAPI, paymentsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsRes, payRes] = await Promise.all([
          jobsAPI.myApplications(),
          paymentsAPI.myPayments(),
        ]);
        setApplications(appsRes.data.results || appsRes.data || []);
        setPayments(payRes.data.results || payRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome, {user?.first_name}! 👋
          </h1>
          <p className="text-primary-100">
            Manage your applications, documents, and payments from your dashboard.
          </p>
          {!user?.profile_complete && (
            <Link
              href="/profile"
              className="inline-block mt-4 bg-white text-primary-700 px-5 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Complete Your Profile →
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">
              {applications.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Applications</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {payments.filter((p) => p.status === 'verified').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Verified Payments</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {payments.filter((p) => p.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Pending Payments</div>
          </div>
          <div className="card text-center">
            <div className={`text-3xl font-bold ${user?.profile_complete ? 'text-green-600' : 'text-orange-500'}`}>
              {user?.profile_complete ? '✓' : '!'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Profile {user?.profile_complete ? 'Complete' : 'Incomplete'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Applications
                </h2>
                <Link href="/jobs" className="text-sm text-primary-600 hover:underline">
                  Browse Jobs
                </Link>
              </div>
              {applications.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">
                  No applications yet. Start by browsing available jobs.
                </p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {app.job_title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Applied {formatDate(app.applied_at)}
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment History
                </h2>
                <Link href="/dashboard" className="text-sm text-primary-600 hover:underline">
                  Submit Payment
                </Link>
              </div>
              {payments.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">
                  No payment records found.
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((pay) => (
                    <div
                      key={pay.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {pay.payment_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pay.amount} {pay.currency}
                        </div>
                      </div>
                      <StatusBadge status={pay.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}