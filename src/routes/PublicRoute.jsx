import React from 'react';
import { Navigate } from 'react-router-dom';  // ¡AGREGA ESTA LÍNEA!
import { useAuthStore } from '../store/useAuthStore.js';

const PublicRoute = ({ children }) => {
  const { authUser  } = useAuthStore();


  if (authUser) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;