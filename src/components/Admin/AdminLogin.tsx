import React from 'react';
import { LoginForm } from '../Auth/LoginForm';
import { useAppStore } from '../../store/useAppStore';
import { Navigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return <LoginForm />;
};
