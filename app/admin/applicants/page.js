'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [search]);

  const fetchApplicants = async () => {
    try {
      const params = { role: 'applicant' };
      if (search) params.search = search;
      const res = await adminAPI.applicants(params);
      setApplicants(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await adminAPI.applicantDetail(id);
      setSelected(res.data);
    } catch (err) {
      toast.error('Failed to load applicant details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleVerify = async (id, currentStatus) => {
    try {
      await adminAPI.updateApplicant(id, { is_verified: !currentStatus });
      toast.success(`Applicant ${!currentStatus ? 'verified' : 'unverified'}`);
      fetchApplicants();
      if (selected && selected.id === id) {
        setSelected({ ...selected, is_verified: !currentStatus });
      }
    } catch (err) {
      toast.error('Failed to update applicant.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back to list
        </button>
        {detailLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="card">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-4">
                {selected.profile_photo_url ? (
                  <img
                    src={selected.profile_photo_url}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-xl">
                      {selected.first_name?.[0]}{selected.last_name?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selected.first_name} {selected.last_name}
                  </h2>
                  <p className="text-gray-500">{selected.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleVerify(selected.id, selected.is_verified)}
                className={selected.is_verified ? 'btn-danger' : 'btn-primary'}
              >
                {selected.is_verified ? 'Revoke Verification' : 'Verify Applicant'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><strong>Phone:</strong> {selected.phone_number || '—'}</div>
              <div><strong>Gender:</strong> {selected.gender || '—'}</div>
              <div><strong>DOB:</strong> {formatDate(selected.date_of_birth) || '—'}</div>
              <div><strong>Nationality:</strong> {selected.nationality || '—'}</div>
              <div><strong>City:</strong> {selected.city || '—'}</div>
              <div><strong>Passport:</strong> {selected.passport_number || '—'}</div>
              <div>
                <strong>Profile Complete:</strong>{' '}
                {selected.profile_complete ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Verified:</strong>{' '}
                {selected.is_verified ? '✅ Yes' : '❌ No'}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {selected.national_id_front_url && (
                <a
                  href={selected.national_id_front_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline block"
                >
                  📄 View National ID (Front)
                </a>
              )}
              {selected.national_id_back_url && (
                <a
                  href={selected.national_id_back_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline block"
                >
                  📄 View National ID (Back)
                </a>
              )}
              {selected.resume_url && (
                <a
                  href={selected.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline block"
                >
                  📎 View Resume/CV
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-header mb-6">Manage Applicants</h1>

      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field max-w-md mb-6"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Phone</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  {a.first_name} {a.last_name}
                </td>
                <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{a.email}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{a.phone_number}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {a.is_verified && <StatusBadge status="verified" />}
                    {a.profile_complete && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDetail(a.id)}
                      className="text-primary-600 hover:underline text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleVerify(a.id, a.is_verified)}
                      className={`text-xs font-medium ${
                        a.is_verified
                          ? 'text-red-600 hover:underline'
                          : 'text-green-600 hover:underline'
                      }`}
                    >
                      {a.is_verified ? 'Unverify' : 'Verify'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {applicants.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No applicants found.
        </p>
      )}
    </div>
  );
}