'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await adminAPI.dashboard();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Applicants',
      value: stats?.total_applicants || 0,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Verified Applicants',
      value: stats?.verified_applicants || 0,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Complete Profiles',
      value: stats?.complete_profiles || 0,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Jobs',
      value: stats?.active_jobs || 0,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Pending Payments',
      value: stats?.pending_payments || 0,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div>
      <h1 className="page-header mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`card ${card.bg}`}>
            <div className={`text-4xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-sm text-gray-600 mt-2 font-medium">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}