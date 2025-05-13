import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext, AuthContextType } from './AuthContextValue'; // Import context and type

export interface User { // Export User interface
  login: string;
  id: string;
  avatar_url: string; // Added field for GitHub avatar URL
  // Add other relevant user fields if needed
}

interface AuthProviderProps { // Remove AuthContextType and AuthContext definitions
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Attempt to load user/token from storage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false); // Finished loading attempt
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    // Optionally redirect to login page or home page after logout
    // window.location.href = '/'; // Simple redirect
  };

  // Function to clear auth state and redirect to GitHub auth start
  const reAuthenticate = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    // Redirect to the endpoint that initiates GitHub OAuth flow
    window.location.href = '/api/auth/github';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, reAuthenticate }}> {/* Add reAuthenticate to provider value */}
      {children}
    </AuthContext.Provider>
  );
};
