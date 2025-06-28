import React from 'react';
import { Navigate } from 'react-router-dom';

const Protectedroute = ({ children }) => {
  const userToken = localStorage.getItem('authToken');

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default Protectedroute;