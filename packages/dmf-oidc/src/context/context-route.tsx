import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import DreamMFContextStore from "../extensions/url-store";
import { DreamMFLogClient } from "@dream.mf/logging";

export interface DreamMFAuthRouteProps {
  /** The function you want to use to enable redirection, usually react router's navigate. */
  navigate: (url: string) => void;
  /** Any logic we should execute before redirecting. */
  onBeforeRedirect?: () => void;
  /** The message we show while we redirect.  */
  loginMessage?: string;
}

export const DreamMFAuthRoute = ({
  navigate,
  onBeforeRedirect,
  loginMessage,
}) => {
  const auth = useAuth();

  /** Handle any cleanup or before redirect logic before redirecting */
  /** --------------------------------------------------- */

  useEffect(() => {
    if (auth.isAuthenticated) {
      DreamMFLogClient.logAuthentication({
        message: "Successful login, redirecting you back.",
      });
      const url = DreamMFContextStore.originalRequestPath;
      DreamMFContextStore.clear();
      onBeforeRedirect && onBeforeRedirect();
      navigate && navigate(url);
    }
  }, [auth.isAuthenticated]);

  /** Handle rendering based on login message */
  /** --------------------------------------------------- */

  return (
    <>{loginMessage ? loginMessage : "One minute, we are logging you in.."}</>
  );
};

export default DreamMFAuthRoute;
