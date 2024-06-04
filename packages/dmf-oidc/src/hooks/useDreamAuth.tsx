import { AuthContextProps, useAuth } from "react-oidc-context";

export interface useDreamAuthApi extends AuthContextProps {
  /** Handles the logout flow and cleans up stateful keys if you set clearState to true */
  handleLogout: (onLogout: Function, clearState: boolean) => Promise<void>;
  /** Clears any oidc user state keys */
  clearOidcState: () => void;
  /** Clears local storage from any oidc state keys */
  clearLocalStorage: () => void;
  /** Clears session storage from any oidc state keys */
  clearSessionStorage: () => void;
}

/** Hook for use with useAuth from react-oidc-context with extensions from Dream. */
export const useDreamAuth = (): useDreamAuthApi => {
  const auth = useAuth();

  const clearLocalStorage = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("oidc.")) {
        localStorage.removeItem(key);
      }
    });
  };

  const clearSessionStorage = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("oidc.")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const clearOidcState = () => {
    const { settings } = auth;
    localStorage.removeItem(`oidc.user:${settings.authority}:${settings.client_id}`);
    sessionStorage.removeItem(`oidc.user:${settings.authority}:${settings.client_id}`);
  };

  const handleLogout = async (onLogoutCallback: Function, clearState: boolean) => {
    if (clearState) {
        clearOidcState();
        clearLocalStorage();
        clearSessionStorage();
    }
    await auth.revokeTokens(["access_token","refresh_token"]);
    await auth.removeUser();
    return auth.signoutRedirect().then(() => onLogoutCallback());
  };

  return {
    ...auth,
    handleLogout,
    clearOidcState,
    clearLocalStorage,
    clearSessionStorage,
  } as useDreamAuthApi;
};
