import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import keycloak from '../api/keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  initialized: boolean;
  token: string | undefined;
  username: string | undefined;
  roles: string[];
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        responseMode: 'query',
      })
      .then((auth) => {
        setIsAuthenticated(auth);
        setInitialized(true);
      })
      .catch(() => setInitialized(true));

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        keycloak.logout();
      });
    };
  }, []);

  const login = () => keycloak.login({ redirectUri: window.location.origin + '/' });

  const logout = () =>
    keycloak.logout({ redirectUri: window.location.origin });

  const hasRole = (role: string): boolean =>
    keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role);

  const roles: string[] = [
    ...(keycloak.realmAccess?.roles ?? []),
    ...Object.values(keycloak.resourceAccess ?? {}).flatMap(
      (r) => r.roles ?? []
    ),
  ];

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        initialized,
        token: keycloak.token,
        username: keycloak.tokenParsed?.preferred_username,
        roles,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
