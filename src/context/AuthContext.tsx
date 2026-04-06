import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "customer" | "provider" | "admin" | "super-admin";

type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
};

type DemoAccount = AuthUser & {
  password: string;
  redirectTo: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; redirectTo?: string; message?: string };
  logout: () => void;
};

const STORAGE_KEY = "smallshop-auth-user";

export const demoAccounts: DemoAccount[] = [
  {
    name: "Demo Customer",
    email: "customer@smallshop.com",
    password: "demo123",
    role: "customer",
    redirectTo: "/",
  },
  {
    name: "Demo Provider",
    email: "provider@smallshop.com",
    password: "demo123",
    role: "provider",
    redirectTo: "/provider/dashboard",
  },
  {
    name: "Demo Admin",
    email: "admin@smallshop.com",
    password: "demo123",
    role: "admin",
    redirectTo: "/admin/dashboard",
  },
  {
    name: "Demo Super Admin",
    email: "superadmin@smallshop.com",
    password: "demo123",
    role: "super-admin",
    redirectTo: "/super-admin/dashboard",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email: string, password: string) => {
    const account = demoAccounts.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );

    if (!account) {
      return {
        success: false,
        message: "Invalid demo credentials. Use one of the demo accounts below.",
      };
    }

    const nextUser: AuthUser = {
      name: account.name,
      email: account.email,
      role: account.role,
    };

    setUser(nextUser);

    return {
      success: true,
      redirectTo: account.redirectTo,
    };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
