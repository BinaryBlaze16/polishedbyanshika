import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { user, token } = useAuthStore();
  const isAdmin = Boolean(user && token && user.role === 'admin');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
