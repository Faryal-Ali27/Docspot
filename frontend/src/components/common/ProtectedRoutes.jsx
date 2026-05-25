import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location, message: 'Authentication required. Please sign in.' }} replace />;
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      showToast('Access denied! Administrator privileges are required to access the Admin Panel.', 'error');
    }
  }, [loading, user, showToast]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location, message: 'Authentication required. Please sign in as Administrator.' }} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
