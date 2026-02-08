'use client';

import { useState, useEffect } from 'react';
import { paymentsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await paymentsAPI.adminList(params);
      setPayments(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await paymentsAPI.adminVerify(id, { status, admin_notes: '' });
      toast.success(`Payment ${status}`);
      fetchPayments();
    } catch (err) {
      toast.error('Failed to update payment.');
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
      <h1 className="page-header mb-6">Manage Payments</h1>

      <div className="flex gap-2 mb-6">
        {['', 'pending', 'verified', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {payments.map((pay) => (
          <div key={pay.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-medium text-gray-900">
                  {pay.user_detail?.first_name} {pay.user_detail?.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  {pay.payment_type.replace(/_/g, ' ')} • {pay.payment_method.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-gray-500">
                  Amount: <strong>{pay.amount} {pay.currency}</strong>
                  {pay.transaction_reference && (
                    <> • Ref: {pay.transaction_reference}</>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Submitted: {formatDate(pay.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={pay.status} />
                {pay.receipt_url && (
                  <a
                    href={pay.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 text-sm hover:underline"
                  >
                    Receipt
                  </a>
                )}
                {pay.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(pay.id, 'verified')}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerify(pay.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No payments found.
          </p>
        )}
      </div>
    </div>
  );
}