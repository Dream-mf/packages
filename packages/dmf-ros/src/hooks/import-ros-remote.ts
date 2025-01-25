import {
  type ImportRemoteOptions,
  importRemote,
  registerRuntimeRemote,
} from "@dream.mf/core";
import { useState } from "react";
import { RosService } from "../services/ros-service";

interface useRoseRemotesProps {
  rosUrl: string;
  accessKey: string;
}

interface UseRoseRemotes {
  importRosRemote: <T>(options: ImportRosRemoteOptions) => Promise<T>;
}

export interface ImportRosRemoteOptions {
  /** The key of the remote to find in ROS, eg: about */
  remoteKey: string;
  /** The module (component) being exposed, eg: "HealthComponent" */
  module: string;
  /** Optional override for local development, put a url in here, and if its
   *  found, we will load the remote from that url */
  fllbackUrl?: string;
}

export const useRoseRemotes = ({
  rosUrl,
  accessKey,
}: useRoseRemotesProps): UseRoseRemotes => {
  const rosService = RosService.getInstance();

  const importRosRemote = async <T>({
    remoteKey,
    module,
    fllbackUrl,
  }: ImportRosRemoteOptions): Promise<T> => {
    const remoteDetails = await rosService.getRemoteByAccessKey(
      rosUrl,
      accessKey,
      remoteKey,
    );
    const url = fllbackUrl != null ? fllbackUrl : remoteDetails.url;
    return importRemote<T>({
      remoteUrl: url,
      scope: remoteDetails.scope,
      module: module,
      remoteUrlFallback: null,
    } as ImportRemoteOptions);
  };

  return {
    importRosRemote,
  };
};
