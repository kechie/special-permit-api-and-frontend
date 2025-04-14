import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('spclpermittoken');
    const storedRole = localStorage.getItem('spclpermitrole');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole || null);
    }
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem('spclpermittoken', token);
    localStorage.setItem('spclpermitrole', userRole);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('spclpermittoken');
    localStorage.removeItem('spclpermitrole');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);