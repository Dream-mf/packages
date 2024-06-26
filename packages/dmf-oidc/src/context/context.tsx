import React, { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "react-oidc-context";
import core from "../core";
import { addInterceptors } from "../middleware/fetch";
import { DreamMFAuthConfig } from "../types";
import { DreamMFLogClient } from "@dream.mf/logging";

interface DreamMFAuthProviderProps {
  children?: ReactNode | undefined;
  automaticSilentRenew?: boolean | undefined;
  config: DreamMFAuthConfig;
}

export const DreamMFAuthProvider = ({
  children,
  automaticSilentRenew,
  config,
}: DreamMFAuthProviderProps) => {
  useEffect(() => {
    core.setupRuntime(config);
    addInterceptors(config);
    DreamMFLogClient.logAuthentication({
      message: "AuthProvider starting up...",
    });
  }, []);

  return (
    <AuthProvider
      automaticSilentRenew={
        automaticSilentRenew === undefined ? false : automaticSilentRenew
      }
      {...config}
    >
      {children}
    </AuthProvider>
  );
};

export default { DreamMFAuthProvider };
