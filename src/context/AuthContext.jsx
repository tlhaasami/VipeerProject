import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('viper_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('viper_auth_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('viper_auth_user');
    }
  }, [currentUser]);

  const login = async (username, password, selectedDomain) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await dataService.authenticate(username, password, selectedDomain);
      if (res.success) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      } else {
        setAuthError(res.reason);
        return { success: false, reason: res.reason, userDomain: res.userDomain };
      }
    } catch (err) {
      setAuthError('SYSTEM_ERROR');
      return { success: false, reason: 'SYSTEM_ERROR', message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError(null);
    sessionStorage.removeItem('viper_auth_user');
  };

  // Switch domain helper for seamless demo & viva evaluation
  const switchDomain = async (targetDomain) => {
    const users = JSON.parse(localStorage.getItem('viper_users') || '[]');
    const targetUser = users.find(u => u.domain.toLowerCase() === targetDomain.toLowerCase());
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        login,
        logout,
        switchDomain,
        isAuthenticated: !!currentUser,
        domain: currentUser?.domain || null
      }}
    >
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
