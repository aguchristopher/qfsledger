const API_BASE_URL = 'https://qfsledger-dashboard.onrender.com/api'
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

  async signup(email, password, firstName, lastName, username, country, phoneNumber) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password, firstName, lastName, username, country, phoneNumber})
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

  async getUser(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getBalance(token) {
    const response = await fetch(`${API_BASE_URL}/user/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  },

  async getTransactions(token, page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/user/transactions?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async updateBalance(token, data) {
    const response = await fetch(`${API_BASE_URL}/user/balance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update balance');
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
  },

  async sendPhrase(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/send-phrase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to link wallet');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  async linkWallet(token, walletData) {
    const response = await fetch(`${API_BASE_URL}/user/link-wallet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(walletData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to link wallet');
    }
    return data;
  },

  async requestPasswordReset(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request password reset');
    }
    return response.json();
  },

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
    return response.json();
  }
};
