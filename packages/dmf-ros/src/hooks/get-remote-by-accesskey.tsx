import { useState } from "react";
import { RosService } from "../services/ros-service";
import type { RemoteResponse } from "../types";

interface UseGetRemoteByAccessKeyProps {
  rosUrl: string;
}

interface UseGetRemoteByAccessKey {
  loading: boolean;
  error: Error | null;
  getRemoteByAccessKey: (
    accessKey: string,
    key: string,
  ) => Promise<RemoteResponse>;
}

export const useGetRemoteByAccessKey = ({
  rosUrl,
}: UseGetRemoteByAccessKeyProps): UseGetRemoteByAccessKey => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const rosService = RosService.getInstance();

  const getRemoteByAccessKey = async (
    accessKey: string,
    key: string,
  ): Promise<RemoteResponse> => {
    try {
      setLoading(true);
      return await rosService.getRemoteByAccessKey(rosUrl, accessKey, key);
    } catch {
      setError(new Error("Failed to fetch remotes by access key"));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRemoteByAccessKey,
  };
};
