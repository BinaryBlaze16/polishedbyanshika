import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      const userData = res.user || res;
      const token = res.token;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name}!`);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-rose-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-gold-500/5 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/80 border border-rose-100 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-luxury">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-dark-800 mb-2">Welcome Back</h1>
            <p className="text-dark-400 text-sm">Sign in to access your orders and wishlist</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-dark-500 mb-1">Email</label>
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800 placeholder-dark-300"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-xs text-rose-500 mt-1">{errors.email.message}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-dark-500">Password</label>
                <a href="#" className="text-xs text-rose-500 hover:text-rose-600">Forgot Password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800 placeholder-dark-300"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-rose-500 mt-1">{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold transition-all shadow-glow-rose disabled:opacity-70 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Don't have an account? <Link to="/register" className="text-rose-500 hover:text-rose-600 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
