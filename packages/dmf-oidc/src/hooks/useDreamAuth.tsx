import { useAuth } from "react-oidc-context";

/** Hook for use with useAuth from react-oidc-context with extensions from Dream. */
export const useDreamAuth = () => {
  const auth = useAuth();

  const extensions = () => {
    return {
      ...auth,
      userManager: () => {
        console.log("hello world.");
      },
    };
  };

  return extensions;
};
