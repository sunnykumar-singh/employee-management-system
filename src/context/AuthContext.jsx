import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';
import { storage } from '../utils/storage.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    storage.setToken(data.token);
    storage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const updateUser = (nextUser) => {
    storage.setUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    storage.clear();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      updateUser,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
