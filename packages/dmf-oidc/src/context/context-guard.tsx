import React, { ReactElement, ReactNode, useEffect, useMemo } from "react";
import { SigninSilentArgs } from "oidc-client-ts";
import { hasAuthParams, useAuth } from "react-oidc-context";
import DreamMFContextStore from "../extensions/url-store";
import { DreamMFLogClient } from "@dream.mf/logging";
import { registerUserProfile } from "@dream.mf/core";

interface DreamMFAuthGuardProps {
  children?: ReactNode | undefined;
  /** The fallback component to render if we are not authenticated and set stopRedirect to true. */
  fallback?: ReactNode | undefined;
  /** Should we stop the redirect and render the fallback if not authenticated. */
  stopRedirect?: boolean | undefined;
}

/** A authenticated guard (using DreamMFAuthProvider) to ensure items do not render unless isAuthenticated is true.
 * @param children Wrap this component you want to restrict rendering on.
 */
export const DreamMFAuthGuard = ({
  children,
  fallback = <></>,
  stopRedirect = false,
}: DreamMFAuthGuardProps) => {
  const auth = useAuth();

  /** Handle any dream core logic */
  /** --------------------------------------------------- */

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      registerUserProfile(auth.user.profile);
    }
  }, [auth.user]);

  /** Handle redirection for authentication logic */
  /** --------------------------------------------------- */

  useEffect(() => {
    if (!auth.isAuthenticated && !stopRedirect) {
      DreamMFLogClient.logAuthentication({
        message: "Redirecting you to the identity provider.",
      });
      DreamMFContextStore.originalRequestPath = `${window.location.pathname}`;
      auth.signinRedirect().catch(console.error);
    }
  }, [auth.isAuthenticated]);

  /** Handle token expiring and renewal */
  /** --------------------------------------------------- */

  const handleTokenExpiring = () => {
    auth.events.addAccessTokenExpiring((cb) => {
      DreamMFLogClient.logAuthentication({
        message: "Renewing token with the identity provider.",
      });
      auth
        .signinSilent({
          redirect_uri: auth.settings.redirect_uri,
        } as SigninSilentArgs)
        .catch(console.error);
    });
  };

  useEffect(() => {
    handleTokenExpiring();
    return () => {
      auth.events.removeAccessTokenExpiring(handleTokenExpiring);
    };
  }, [auth.events, auth.signinSilent]);

  /** Handle error handling */
  /** --------------------------------------------------- */

  if (auth.error) {
    DreamMFLogClient.logAuthentication({ error: auth.error });
    return <>{auth.error}</>;
  }

  /** Handle rendering based on auth and fallbacks */
  /** --------------------------------------------------- */

  const returnRender = () =>
    (auth.isAuthenticated ? children : fallback) as ReactElement;
  return useMemo(() => returnRender(), [auth.isAuthenticated]);
};

export default DreamMFAuthGuard;
