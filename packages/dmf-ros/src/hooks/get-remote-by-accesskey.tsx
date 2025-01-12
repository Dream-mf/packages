import { useState } from "react";
import { RosService } from "../services/ros-service";
import type { RemoteResponse } from "../types";

interface UseGetRemoteByAccessKey {
  loading: boolean;
  error: Error | null;
  getRemoteByAccessKey: (
    accessKey: string,
    key: string,
  ) => Promise<RemoteResponse>;
  getRemoteByAccessKeyWithBasePath: (
    basePath: string,
    accessKey: string,
    key: string,
  ) => Promise<RemoteResponse>;
}

export const useGetRemoteByAccessKey = (): UseGetRemoteByAccessKey => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const rosService = RosService.getInstance();

  const getRemoteByAccessKey = async (
    accessKey: string,
    key: string,
  ): Promise<RemoteResponse> => {
    const basePath = process.env.REACT_APP_API_BASE_URL || "";
    return getRemoteByAccessKeyWithBasePath(basePath, accessKey, key);
  };

  const getRemoteByAccessKeyWithBasePath = async (
    basePath: string,
    accessKey: string,
    key: string,
  ): Promise<RemoteResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await rosService.getRemoteByAccessKey(basePath, accessKey, key);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRemoteByAccessKey,
    getRemoteByAccessKeyWithBasePath,
  };
};