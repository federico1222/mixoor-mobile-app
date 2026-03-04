import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SESSION_COOKIE_KEY } from "../../constants";
import { useMobileWallet } from "@wallet-ui/react-native-kit";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account } = useMobileWallet();

  // Check for existing session on mount and when account changes
  useEffect(() => {
    if (!account?.address) {
      setIsAuthenticated(false);
      return;
    }

    AsyncStorage.getItem(SESSION_COOKIE_KEY).then((cookie) => {
      setIsAuthenticated(!!cookie);
    });
  }, [account?.address]);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
