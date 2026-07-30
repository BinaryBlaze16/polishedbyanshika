import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      const userData = res.user || res;
      const token = res.token || 'user_token';
      login(userData, token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-rose-500/5 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md bg-white/80 border border-rose-100 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-luxury">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-dark-800 mb-2">Create Account</h1>
            <p className="text-dark-400 text-sm">Join the luxury nail art community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-500 mb-1">Full Name</label>
              <input 
                type="text" 
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800"
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm text-dark-500 mb-1">Email</label>
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800"
              />
              {errors.email && <span className="text-xs text-rose-500 mt-1">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm text-dark-500 mb-1">Phone (Optional)</label>
              <input 
                type="tel" 
                {...register('phone')}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800"
              />
            </div>

            <div>
              <label className="block text-sm text-dark-500 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-rose-500 mt-1">{errors.password.message}</span>}
            </div>

            <div>
              <label className="block text-sm text-dark-500 mb-1">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                {...register('confirmPassword', { 
                  validate: value => value === password || "Passwords do not match"
                })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors text-dark-800"
              />
              {errors.confirmPassword && <span className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold transition-all shadow-glow-rose disabled:opacity-70 mt-4">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Already have an account? <Link to="/login" className="text-rose-500 hover:text-rose-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
