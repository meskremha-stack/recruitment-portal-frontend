'use client';

import { useState, useEffect } from 'react';
import { announcementsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import FileUpload from '@/components/FileUpload';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'medium',
    is_published: true,
    attachment: null,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementsAPI.adminList();
      setAnnouncements(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await announcementsAPI.adminCreate(form);
      toast.success('Announcement created!');
      setForm({
        title: '',
        content: '',
        priority: 'medium',
        is_published: true,
        attachment: null,
      });
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementsAPI.adminDelete(id);
      toast.success('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to delete.');
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await announcementsAPI.adminUpdate(id, {
        is_published: !currentStatus,
      });
      toast.success(!currentStatus ? 'Published!' : 'Unpublished');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to update.');
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
        <h1 className="page-header">Manage Announcements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={5}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish immediately
                  </span>
                </label>
              </div>
            </div>
            <FileUpload
              label="Attachment (Optional)"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(file) => setForm({ ...form, attachment: file })}
              helpText="Image or document. Max 5MB."
            />
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Create Announcement'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={ann.priority} />
                  {ann.is_published ? (
                    <span className="text-xs text-green-600 font-medium">Published</span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Draft</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                  {ann.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(ann.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePublish(ann.id, ann.is_published)}
                  className="btn-secondary text-xs"
                >
                  {ann.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="btn-danger text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No announcements yet. Create your first one above.
          </p>
        )}
      </div>
    </div>
  );
}