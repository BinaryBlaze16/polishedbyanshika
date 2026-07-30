import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: (userData, token) => set({ 
        user: userData, 
        token: token || (userData && 'session_token') || null 
      }),
      
      logout: () => set({ user: null, token: null }),
      
      updateUser: (data) => set((state) => ({ 
        user: state.user ? { ...state.user, ...data } : null 
      })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      isAuthenticated: () => Boolean(get().user && get().token),
      
      isAdmin: () => Boolean(get().user && get().token && get().user?.role === 'admin'),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
