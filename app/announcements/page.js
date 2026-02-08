'use client';

import { useState, useEffect } from 'react';
import { announcementsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnn, setSelectedAnn] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await announcementsAPI.list();
        setAnnouncements(res.data.results || res.data || []);
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="page-header mb-2">Announcements</h1>
      <p className="text-gray-500 mb-8">
        Stay updated with the latest news and information
      </p>

      {announcements.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No announcements yet
          </h3>
          <p className="text-gray-500">
            Check back later for updates.
          </p>
        </div>
      ) : selectedAnn ? (
        <div>
          <button
            onClick={() => setSelectedAnn(null)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
          >
            ← Back to all announcements
          </button>
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={selectedAnn.priority} />
              <span className="text-sm text-gray-400">
                {formatDate(selectedAnn.published_at || selectedAnn.created_at)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedAnn.title}
            </h2>
            <div className="text-gray-600 whitespace-pre-line">
              {selectedAnn.content}
            </div>
            {selectedAnn.attachment_url && (
              <a
                href={selectedAnn.attachment_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-primary-600 hover:underline"
              >
                📎 View Attachment
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setSelectedAnn(ann)}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={ann.priority} />
                <span className="text-sm text-gray-400">
                  {formatDate(ann.published_at || ann.created_at)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {ann.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}