import axios from 'axios';

/**
 * Base API URL
 * MUST be set in Vercel as NEXT_PUBLIC_API_URL
 * Example: https://api.yourdomain.com/api
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * Attach access token
 * ============================
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * Refresh token on 401
 * ============================
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      try {
        const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');

        if (tokens?.refresh) {
          const res = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: tokens.refresh,
          });

          const newTokens = {
            access: res.data.access,
            refresh: res.data.refresh || tokens.refresh,
          };

          localStorage.setItem('tokens', JSON.stringify(newTokens));

          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ============================
 * AUTH APIs
 * ============================
 */
export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: (data) => api.post('/accounts/logout/', data),
  getProfile: () => api.get('/accounts/profile/'),

  updateProfile: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    return api.patch('/accounts/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadNationalID: ({ front, back }) => {
    const formData = new FormData();
    if (front) formData.append('national_id_front', front);
    if (back) formData.append('national_id_back', back);

    return api.post('/accounts/profile/upload-id/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    return api.post('/accounts/profile/upload-resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('profile_photo', file);

    return api.post('/accounts/profile/upload-photo/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: (data) =>
    api.put('/accounts/change-password/', data),
};

/**
 * ============================
 * JOBS APIs
 * ============================
 */
export const jobsAPI = {
  list: (params) => api.get('/jobs/', { params }),
  detail: (id) => api.get(`/jobs/${id}/`),
  apply: (data) => api.post('/jobs/apply/', data),
  myApplications: () => api.get('/jobs/my-applications/'),

  // Admin
  adminList: (params) => api.get('/jobs/admin/manage/', { params }),
  adminCreate: (data) => api.post('/jobs/admin/manage/', data),
  adminUpdate: (id, data) =>
    api.patch(`/jobs/admin/manage/${id}/`, data),
  adminDelete: (id) =>
    api.delete(`/jobs/admin/manage/${id}/`),
  adminApplications: (params) =>
    api.get('/jobs/admin/applications/', { params }),
  adminUpdateApplication: (id, data) =>
    api.patch(`/jobs/admin/applications/${id}/`, data),
};

/**
 * ============================
 * ANNOUNCEMENTS APIs
 * ============================
 */
export const announcementsAPI = {
  list: (params) => api.get('/announcements/', { params }),
  detail: (id) => api.get(`/announcements/${id}/`),

  // Admin
  adminList: (params) =>
    api.get('/announcements/admin/manage/', { params }),

  adminCreate: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v);
    });

    return api.post('/announcements/admin/manage/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  adminUpdate: (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v);
    });

    return api.patch(`/announcements/admin/manage/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  adminDelete: (id) =>
    api.delete(`/announcements/admin/manage/${id}/`),
};

/**
 * ============================
 * PAYMENTS APIs
 * ============================
 */
export const paymentsAPI = {
  submit: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v);
    });

    return api.post('/payments/submit/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  myPayments: () => api.get('/payments/my-payments/'),
  myPaymentDetail: (id) =>
    api.get(`/payments/my-payments/${id}/`),

  // Admin
  adminList: (params) =>
    api.get('/payments/admin/list/', { params }),
  adminVerify: (id, data) =>
    api.patch(`/payments/admin/verify/${id}/`, data),
};

/**
 * ============================
 * ADMIN DASHBOARD APIs
 * ============================
 */
export const adminAPI = {
  dashboard: () => api.get('/accounts/admin/dashboard/'),
  applicants: (params) =>
    api.get('/accounts/admin/applicants/', { params }),
  applicantDetail: (id) =>
    api.get(`/accounts/admin/applicants/${id}/`),
  updateApplicant: (id, data) =>
    api.patch(`/accounts/admin/applicants/${id}/`, data),
};

export default api;
