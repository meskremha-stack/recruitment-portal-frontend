'use client';

import { useState, useEffect } from 'react';
import { jobsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company_name: '',
    country: '',
    city: '',
    description: '',
    requirements: '',
    benefits: '',
    salary_range: '',
    contract_type: 'full_time',
    positions_available: 1,
    status: 'open',
    is_active: true,
    deadline: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await jobsAPI.adminList();
      setJobs(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (!data.deadline) delete data.deadline;
      await jobsAPI.adminCreate(data);
      toast.success('Job created!');
      setForm({
        title: '',
        company_name: '',
        country: '',
        city: '',
        description: '',
        requirements: '',
        benefits: '',
        salary_range: '',
        contract_type: 'full_time',
        positions_available: 1,
        status: 'open',
        is_active: true,
        deadline: '',
      });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to create job.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      await jobsAPI.adminUpdate(id, { is_active: !currentActive });
      toast.success(!currentActive ? 'Activated' : 'Deactivated');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update job.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await jobsAPI.adminDelete(id);
      toast.success('Job deleted.');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-header">Manage Jobs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Job'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Type
                </label>
                <select
                  name="contract_type"
                  value={form.contract_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary_range"
                  value={form.salary_range}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., $500-$800/month"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Positions Available
                </label>
                <input
                  type="number"
                  name="positions_available"
                  value={form.positions_available}
                  onChange={handleChange}
                  min="1"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements *
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits
              </label>
              <textarea
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                rows={3}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Create Job'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={job.status} />
                  {!job.is_active && (
                    <span className="text-xs text-red-500 font-medium">Inactive</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">
                  {job.company_name} • {job.country}
                  {job.city ? `, ${job.city}` : ''} •{' '}
                  {job.application_count} applications
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created {formatDate(job.created_at)}
                  {job.deadline && ` • Deadline: ${formatDate(job.deadline)}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(job.id, job.is_active)}
                  className="btn-secondary text-xs"
                >
                  {job.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn-danger text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No jobs yet. Create your first job posting above.
          </p>
        )}
      </div>
    </div>
  );
}