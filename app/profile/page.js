'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI, paymentsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileUpload from '@/components/FileUpload';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    city: '',
    address: '',
    passport_number: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    payment_type: 'registration_fee',
    amount: '',
    currency: 'ETB',
    payment_method: 'bank_transfer',
    transaction_reference: '',
    receipt: null,
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        nationality: user.nationality || '',
        city: user.city || '',
        address: user.address || '',
        passport_number: user.passport_number || '',
      });
    }
  }, [user]);

  const handleInfoChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(form);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleIDUpload = async (front, back) => {
    setLoading(true);
    try {
      await authAPI.uploadNationalID({ front, back });
      await refreshProfile();
      toast.success('National ID uploaded!');
    } catch (err) {
      toast.error('Failed to upload ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (file) => {
    setLoading(true);
    try {
      await authAPI.uploadResume(file);
      await refreshProfile();
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error('Failed to upload resume.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    setLoading(true);
    try {
      await authAPI.uploadPhoto(file);
      await refreshProfile();
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.receipt) {
      toast.error('Please upload a payment receipt.');
      return;
    }
    setLoading(true);
    try {
      await paymentsAPI.submit(paymentForm);
      toast.success('Payment submitted for verification!');
      setPaymentForm({
        payment_type: 'registration_fee',
        amount: '',
        currency: 'ETB',
        payment_method: 'bank_transfer',
        transaction_reference: '',
        receipt: null,
      });
    } catch (err) {
      toast.error('Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'info', label: 'Personal Info' },
    { key: 'documents', label: 'Documents' },
    { key: 'payment', label: 'Submit Payment' },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="page-header mb-6">My Profile</h1>

        {/* Profile Completion Alert */}
        {!user?.profile_complete && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
            <strong>Profile Incomplete:</strong> Please fill in all required fields
            and upload your documents to complete your profile.
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'info' && (
          <div className="card">
            <form onSubmit={handleInfoSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={form.nationality}
                    onChange={handleInfoChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInfoChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passport_number"
                    value={form.passport_number}
                    onChange={handleInfoChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInfoChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Photo
              </h3>
              <FileUpload
                label="Upload your photo"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handlePhotoUpload}
                currentFile={user?.profile_photo_url}
                helpText="JPG, PNG or WebP. Max 5MB."
              />
              {user?.profile_photo_url && (
                <div className="mt-3">
                  <img
                    src={user.profile_photo_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                National ID *
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUpload
                  label="Front Side"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(file) => handleIDUpload(file, null)}
                  currentFile={user?.national_id_front_url}
                  helpText="JPG, PNG or WebP. Max 5MB."
                />
                <FileUpload
                  label="Back Side"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(file) => handleIDUpload(null, file)}
                  currentFile={user?.national_id_back_url}
                  helpText="JPG, PNG or WebP. Max 5MB."
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                CV / Resume *
              </h3>
              <FileUpload
                label="Upload Resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                currentFile={user?.resume_url}
                helpText="PDF, DOC or DOCX. Max 5MB."
              />
              {user?.resume_url && (
                <a
                  href={user.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm text-primary-600 hover:underline"
                >
                  View current resume →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Payment Proof
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type
                  </label>
                  <select
                    value={paymentForm.payment_type}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, payment_type: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="registration_fee">Registration Fee</option>
                    <option value="service_fee">Service Fee</option>
                    <option value="visa_processing">Visa Processing Fee</option>
                    <option value="medical_exam">Medical Exam Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, payment_method: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cbe_birr">CBE Birr</option>
                    <option value="telebirr">TeleBirr</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    required
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transaction_reference}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        transaction_reference: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="e.g., FT2401XXXXX"
                  />
                </div>
              </div>

              <FileUpload
                label="Payment Receipt *"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(file) =>
                  setPaymentForm({ ...paymentForm, receipt: file })
                }
                helpText="Upload screenshot or receipt. JPG, PNG, PDF. Max 5MB."
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}