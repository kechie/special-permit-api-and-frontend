import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
/* // src/components/PrivateRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const { isAuthenticated, hasRole } = useAuth()

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (allowedRoles.length && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }
  return element
}

export default PrivateRoute
 */