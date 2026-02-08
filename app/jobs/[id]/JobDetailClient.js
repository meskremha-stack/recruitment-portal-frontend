'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function JobDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, isApplicant } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await jobsAPI.detail(id);
        setJob(res.data);
      } catch (err) {
        toast.error('Job not found.');
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobsAPI.apply({
        job: parseInt(id),
        cover_letter: coverLetter,
      });
      toast.success('Application submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Failed to apply.';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Back to Jobs
      </button>

      <div className="card mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company_name}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
          <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
            📍 {job.country}
            {job.city ? `, ${job.city}` : ''}
          </span>
          <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
            💼 {job.contract_type?.replace(/_/g, ' ')}
          </span>
          {job.salary_range && (
            <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
              💰 {job.salary_range}
            </span>
          )}
          <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
            👥 {job.positions_available} positions
          </span>
          {job.deadline && (
            <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg">
              ⏰ Deadline: {formatDate(job.deadline)}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Job Description
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Requirements
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {job.requirements}
            </p>
          </div>

          {job.benefits && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Benefits
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {job.benefits}
              </p>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && isApplicant && job.status === 'open' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Apply for this Position
          </h2>
          <div className="space-y-4">
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="input-field"
              placeholder="Tell the employer why you're a great fit..."
            />
            <button
              onClick={handleApply}
              disabled={applying}
              className="btn-primary flex items-center"
            >
              {applying ? <LoadingSpinner size="sm" /> : 'Submit Application'}
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">
            Please sign in to apply for this position.
          </p>
          <a href="/login" className="btn-primary inline-block">
            Sign In to Apply
          </a>
        </div>
      )}
    </div>
  );
}
