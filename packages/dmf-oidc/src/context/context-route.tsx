import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import DreamMFContextStore from "../extensions/url-store";
import { DreamMFContextGuard } from "./context-guard";
import { DreamMFLogClient } from "@dream.mf/logging";

export interface HandleAuthRouteProps {
  navigation: Function;
}

export const HandleAuthRoute = ({ navigate }) => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      DreamMFLogClient.logAuthentication({
        message: "Successful login, redirecting you back.",
      });
      const url = DreamMFContextStore.originalRequestPath;
      DreamMFContextStore.clear();
      navigate(url);
    }
  }, [auth.isAuthenticated]);

  return (
    <>
      <DreamMFContextGuard
        fallback={<>You do not have access to this component.</>}
      />
      <>One minute, we are logging you in...</>
    </>
  );
};

export default {
  HandleAuthRoute,
};
