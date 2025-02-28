import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAdmin: boolean;
  isAuth: boolean;
  login: (token: string, refreshToken: string, isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return !!localStorage.getItem("access_token");
  });

  const login = (token: string, refreshToken: string, isAdmin: boolean) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("isAdmin", isAdmin.toString());

    setIsAuth(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("isAdmin");

    setIsAuth(false);
    setIsAdmin(false);
  }

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("access_token"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isAuth, login, logout}} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be within a AuthProvider");
  }
  return context;
}