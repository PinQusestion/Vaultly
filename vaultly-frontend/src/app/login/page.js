'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Eye, EyeOff, Chrome } from 'lucide-react';
import FormInput from '../../components/FormInput';
import { login } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Api call for login
      const loginResponse = await login(email, password);
      if (loginResponse.error) {
        setErrors({ submit: loginResponse.error });
        toast.error(loginResponse.error);
        setLoading(false);
        return;
      }
      // Show success toast
      toast.success('Login successful! Redirecting...');
      // Redirect User to Dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setErrors({ submit: 'Login failed. Please try again.' });
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
            <Wallet className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vaultly</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to manage your finances</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900 placeholder:text-gray-400 bg-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{errors.submit}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:from-blue-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
            >
              <Chrome className="text-gray-600 group-hover:text-blue-600 transition-colors" size={20} />
              Continue with Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Don't have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            <Link href="#" className="text-blue-600 hover:underline">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
