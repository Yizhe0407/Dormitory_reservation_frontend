const API_URL = '/api';
const TIMEOUT_MS = 10000; // 10 秒超時

console.log('Using API URL:', API_URL);

// 處理 API 錯誤
const handleApiError = async (response) => {
  const text = await response.text();
  console.error('API Error:', {
    status: response.status,
    statusText: response.statusText,
    body: text,
    headers: Object.fromEntries(response.headers.entries())
  });

  let message;
  try {
    const data = JSON.parse(text);
    message = data.message || data.error;
  } catch (e) {
    message = text;
  }

  throw new Error(message || '請求失敗');
};

// 處理 API 響應
const handleApiResponse = async (response) => {
  const text = await response.text();
  console.log('API Response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: text
  });

  if (!response.ok) {
    throw new Error(text || response.statusText);
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Error parsing response:', e);
    throw new Error('無法解析響應數據');
  }
};

// 帶超時的 fetch
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('請求超時，請稍後再試');
    }
    throw error;
  }
};

// 獲取認證標頭
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('未找到認證令牌');
  }
  return { 'Authorization': `Bearer ${token}` };
};

// 處理登入響應
const handleLoginResponse = async (response) => {
  const text = await response.text();
  console.log('Raw login response:', text);
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  let data;
  try {
    data = JSON.parse(text);
    console.log('Parsed response data:', data);
  } catch (e) {
    console.error('Error parsing login response:', e);
    throw new Error('無法解析登入響應');
  }

  if (!response.ok) {
    console.error('Login failed:', {
      status: response.status,
      data
    });
    throw new Error(data.message || '登入失敗');
  }

  if (!data.token || !data.admin) {
    console.error('Invalid login response format:', data);
    throw new Error('伺服器響應格式錯誤');
  }

  return {
    token: data.token,
    user: data.admin
  };
};

export const api = {
  reserve: {
    add: async (reservationData) => {
      try {
        console.log('Add reservation request:', {
          url: `${API_URL}/reserve/add`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: reservationData
        });
        
        const response = await fetchWithTimeout(`${API_URL}/reserve/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Add reservation error:', error);
        throw error;
      }
    },
    all: async () => {
      try {
        const url = `${API_URL}/reserve/all`;
        console.log('Get all reservations request:', {
          url,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('Get all reservations raw response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        const data = await handleApiResponse(response);
        console.log('Get all reservations parsed data:', data);

        // 確保返回格式正確
        if (!data || !Array.isArray(data.reserves)) {
          console.warn('Invalid response format from /reserve/all:', data);
          return { reserves: [] };
        }

        return data;
      } catch (error) {
        console.error('Get all reservations error:', error);
        if (error.message.includes('timeout') || error.message.includes('FUNCTION_INVOCATION_TIMEOUT')) {
          return { reserves: [] };
        }
        throw error;
      }
    },
    unchecked: async () => {
      try {
        const url = `${API_URL}/reserve/unchecked`;
        console.log('Get pending reservations request:', {
          url,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Get pending reservations error:', error);
        throw error;
      }
    },
    pass: async () => {
      try {
        const url = `${API_URL}/reserve/pass`;
        console.log('Get pending reservations request:', {
          url,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Get pending reservations error:', error);
        throw error;
      }
    },
    failed: async () => {
      try {
        const url = `${API_URL}/reserve/failed`;
        console.log('Get failed reservations request:', {
          url,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Get pending reservations error:', error);
        throw error;
      }
    },
    qualified: async (info) => {
      try {
        console.log('Mark qualified request:', {
          url: `${API_URL}/reserve/qualified`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: info
        });
        
        const response = await fetchWithTimeout(`${API_URL}/reserve/qualified`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(info),
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Mark qualified error:', error);
        throw error;
      }
    },
    unqualified: async (info) => {
      try {
        console.log('Mark unqualified request:', {
          url: `${API_URL}/reserve/unqualified`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: info
        });
        
        const response = await fetchWithTimeout(`${API_URL}/reserve/unqualified`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(info),
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Mark unqualified error:', error);
        throw error;
      }
    }
  },
  auth: {
    login: async (credentials) => {
      try {
        const requestBody = {
          username: credentials.username.trim(),
          password: credentials.password.trim()
        };
        
        console.log('Login request:', {
          url: `${API_URL}/auth/login`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        });
        
        const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        });

        const result = await handleLoginResponse(response);
        console.log('Login successful:', result);
        return result;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    me: async () => {
      try {
        const headers = getAuthHeaders();
        console.log('Fetching user info with headers:', headers);
        
        const response = await fetchWithTimeout(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        return await handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      }
    },

    logout: async () => {
      try {
        const response = await fetchWithTimeout(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        await handleApiResponse(response);
        localStorage.removeItem('authToken');
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  }
};
