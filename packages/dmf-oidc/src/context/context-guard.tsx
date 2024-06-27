import React, { ReactElement, ReactNode, useEffect, useMemo } from "react";
import { SigninSilentArgs } from "oidc-client-ts";
import { hasAuthParams, useAuth } from "react-oidc-context";
import DreamMFContextStore from "../extensions/url-store";
import { DreamMFLogClient } from "@dream.mf/logging";
import { registerUserProfile } from "@dream.mf/core";

interface DreamMFContextGuardProps {
  children?: ReactNode | undefined;
  fallback?: ReactNode | undefined;
  stopRedirect?: boolean;
}

/** A authenticated guard (using DreamMFAuthProvider) to ensure items do not render unless isAuthenticated is true.
 * @param children Wrap this component you want to restrict rendering on.
 */
export const DreamMFContextGuard = ({
  children,
  fallback,
  stopRedirect,
}: DreamMFContextGuardProps) => {
  const auth = useAuth();

  // If we want to just use a fallback and hide something
  if (stopRedirect && !auth.isAuthenticated) {
    return fallback;
  }

  const isReadyForRedirect = () => {
    return !hasAuthParams() && !auth.isAuthenticated && !auth.isLoading;
  };

  const isReadyForSignin = () => {
    return hasAuthParams() && !auth.isAuthenticated && !auth.isLoading;
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      registerUserProfile(auth.user.profile);
    }
  }, [auth.user]);

  useEffect(() => {
    if (isReadyForRedirect() && !stopRedirect) {
      DreamMFLogClient.logAuthentication({
        message: "Redirecting you to the identity provider.",
      });
      DreamMFContextStore.originalRequestPath = `${window.location.pathname}`;
      auth.signinRedirect().catch(console.error);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (isReadyForSignin() && !stopRedirect) {
      DreamMFLogClient.logAuthentication({
        message: "Getting token from the identity provider.",
      });
      auth
        .signinSilent({
          redirect_uri: auth.settings.redirect_uri,
        } as SigninSilentArgs)
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    return auth.events.addAccessTokenExpiring((cb) => {
      DreamMFLogClient.logAuthentication({
        message: "Renewing token with the identity provider.",
      });
      auth
        .signinSilent({
          redirect_uri: auth.settings.redirect_uri,
        } as SigninSilentArgs)
        .catch(console.error);
    });
  }, [auth.events, auth.signinSilent]);

  if (auth.error) {
    DreamMFLogClient.logAuthentication({ error: auth.error });
  }

  const returnRender = () =>
    (auth.isAuthenticated ? children : fallback) as ReactElement;
  return useMemo(() => returnRender());
};

export default { DreamMFContextGuard };
