import { createContext } from 'react';
// Import User type from the provider file where it's closely related to the state
import type { User } from './AuthContext'; // Using 'type' import

// Interface defining the shape of the context value
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  reAuthenticate: () => void;
}

// Create the actual context object
export const AuthContext = createContext<AuthContextType | undefined>(undefined);