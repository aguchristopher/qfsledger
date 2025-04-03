'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '@/utils/api';

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
   const signup = async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.signup(email, password);
        
        // Store token
        localStorage.setItem('token', response.token);
        setUser(response.user);
        
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'terms' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.signup(formData.email, formData.password);
      toast.success('Signup successful! Please verify your email.');
      router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8 p-8 bg-white/5 rounded-2xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create an account</h2>
          <p className="mt-2 text-gray-400">Join QFS Ledger today</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Create a password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-600 bg-white/5 text-white focus:ring-white/20"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I agree to the{' '}
              <Link href="/terms" className="text-white hover:text-gray-200">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-white hover:text-gray-200">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-gray-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
