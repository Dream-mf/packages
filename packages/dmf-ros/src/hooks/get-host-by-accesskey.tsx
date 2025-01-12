import { useState } from "react";
import { RosService } from "../services/ros-service";
import type { HostResponse } from "../types";

interface UseGetHostByAccessKey {
  loading: boolean;
  error: Error | null;
  getHostByAccessKey: (accessKey: string) => Promise<HostResponse>;
  getHostByAccessKeyWithBasePath: (
    basePath: string,
    accessKey: string,
  ) => Promise<HostResponse>;
}

export const useGetHostByAccessKey = (): UseGetHostByAccessKey => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const rosService = RosService.getInstance();

  const getHostByAccessKey = async (
    accessKey: string,
  ): Promise<HostResponse> => {
    const basePath = process.env.REACT_APP_API_BASE_URL || "";
    return getHostByAccessKeyWithBasePath(basePath, accessKey);
  };

  const getHostByAccessKeyWithBasePath = async (
    basePath: string,
    accessKey: string,
  ): Promise<HostResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await rosService.getHostByAccessKey(basePath, accessKey);
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
    getHostByAccessKey,
    getHostByAccessKeyWithBasePath,
  };
};
