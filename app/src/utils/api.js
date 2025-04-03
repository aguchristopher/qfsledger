const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async signup(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account');
    }
    
    return data;
  },

  async getUserInfo(token) {
    const response = await fetch(`${API_BASE_URL}/user/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to get user info');
    return response.json();
  },

  async getBalance(token) {
    const response = await fetch(`${API_BASE_URL}/user/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to get balance');
    return response.json();
  },

  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
};
