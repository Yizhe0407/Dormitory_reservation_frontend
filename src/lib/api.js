const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  reserve: {
    add: async (reservationData) => {
      const response = await fetch(`${API_URL}/api/reserve/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '預約失敗');
      }
    },
    all: async () => {
      const response = await fetch(`${API_URL}/api/reserve/all`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('取得預約資料失敗');
      }

      return response.json();
    },
    qualified: async (info) => {
      console.log(info);
      const response = await fetch(`${API_URL}/api/reserve/qualified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        throw new Error('標記合格失敗');
      }
    },
    unqualified: async (info) => {
      const response = await fetch(`${API_URL}/api/reserve/unqualified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        throw new Error('標記不合格失敗');
      }
    },
  },
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登入失敗');
      }

      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登出失敗');
      }
    },

    me: async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('驗證失敗');
      }

      return response.json();
    },
  },
};
