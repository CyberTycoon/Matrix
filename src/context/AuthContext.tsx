import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

interface UserData {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Clear any existing session on page load
    localStorage.removeItem('matrix-math-user');
    setUser(null);
  }, []);

  const login = (username: string, password: string) => {
    // Get stored users from localStorage
    const users = JSON.parse(localStorage.getItem('matrix-math-users') || '[]') as UserData[];
    const user = users.find(u => u.username === username);

    if (!user) {
      // New user - store credentials
      users.push({ username, password });
      localStorage.setItem('matrix-math-users', JSON.stringify(users));
      setUser(username);
      localStorage.setItem('matrix-math-user', username);
      return true;
    }

    // Existing user - verify password
    if (user.password === password) {
      setUser(username);
      localStorage.setItem('matrix-math-user', username);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('matrix-math-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 