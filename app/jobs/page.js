'use client';

import { useState, useEffect } from 'react';
import { jobsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const { isAuthenticated, isApplicant } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [search, country]);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (country) params.country = country;
      const res = await jobsAPI.list(params);
      setJobs(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobsAPI.apply({ job: jobId, cover_letter: '' });
      toast.success('Application submitted!');
      fetchJobs();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.response?.data?.non_field_errors
          ? err.response.data.non_field_errors[0]
          : 'Failed to apply.');
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Job Opportunities</h1>
          <p className="text-gray-500 mt-1">
            Find your next international career opportunity
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-sm"
        />
        <input
          type="text"
          placeholder="Filter by country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-500">
            Check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={job.status} />
                <span className="text-xs text-gray-400">
                  {formatDate(job.created_at)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{job.company_name}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  📍 {job.country}{job.city ? `, ${job.city}` : ''}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  💼 {job.contract_type?.replace(/_/g, ' ')}
                </span>
                {job.salary_range && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    💰 {job.salary_range}
                  </span>
                )}
                <span className="bg-gray-100 px-2 py-1 rounded">
                  👥 {job.positions_available} positions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="btn-secondary text-sm flex-1 text-center"
                >
                  View Details
                </Link>
                {isAuthenticated && isApplicant && job.status === 'open' && (
                  <button
                    onClick={() => handleApply(job.id)}
                    className="btn-primary text-sm flex-1"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}