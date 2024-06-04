import { useAuth } from "react-oidc-context";

/** Hook for use with useAuth from react-oidc-context with extensions from Dream. */
export const useDreamAuth = () => {
  const auth = useAuth();

  /** Clears local storage from any oidc state keys */
  const clearLocalStorage = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("oidc.")) {
        localStorage.removeItem(key);
      }
    });
  };

  /** Clears session storage from any oidc state keys */
  const clearSessionStorage = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("oidc.")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  /** Handles the logout flow and cleans up stateful keys if you set clearState to true */
  const handleLogout = async (onLogout: Function, clearState: boolean) => {
    return auth.signoutRedirect().then(() => {
      if (clearState) {
        clearLocalStorage();
        clearSessionStorage();
      }
      onLogout();
    });
  };

  const extensions = {
    ...auth,
    handleLogout,
    clearLocalStorage,
    clearSessionStorage,
  };

  return extensions;
};
