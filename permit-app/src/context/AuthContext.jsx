import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spclpermittoken'));
  const [role, setRole] = useState(localStorage.getItem('spclpermitrole'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('spclpermittoken', token);
    } else {
      localStorage.removeItem('spclpermittoken');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('spclpermitrole', role);
    } else {
      localStorage.removeItem('spclpermitrole');
    }
  }, [role]);

  const login = (userData, userToken, userRole) => {
    setUser(userData);
    setToken(userToken);
    setRole(userRole);
    return userRole; // Return the role for navigation handling in Login component
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const hasRole = (allowedRoles) => {
    return Array.isArray(allowedRoles) ?
      allowedRoles.includes(role) :
      allowedRoles === role;
  };


  return (
    <AuthContext.Provider value={{
      user,
      token,
      role,
      isAuthenticated: !!token,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
/* import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  //const [role, setRole] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('spclpermitrole'));

    useEffect(() => {
    const token = localStorage.getItem('spclpermittoken');
    const storedRole = localStorage.getItem('spclpermitrole');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole || null);
    }
  }, []);
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (token, userRole) => {
    console.log('Login called with token:', token);
    console.log('Login called with userRole:', userRole);
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
  const hasRole = (allowedRoles) => {
    console.log('Allowed roles:', allowedRoles);
    console.log('User role:', role);
    return allowedRoles.includes(role);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext); */