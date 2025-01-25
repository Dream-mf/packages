import { useState } from "react";
import { RosService } from "../services/ros-service";
import type { RemoteResponse } from "../types";

interface UseGetRemotesByAccessKeyProps {
  rosUrl: string;
}

interface UseGetRemotesByAccessKey {
  loading: boolean;
  error: Error | null;
  getRemotesByAccessKey: (accessKey: string) => Promise<RemoteResponse[]>;
}

export const useGetRemotesByAccessKey = ({
  rosUrl,
}: UseGetRemotesByAccessKeyProps): UseGetRemotesByAccessKey => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const rosService = RosService.getInstance();

  const getRemotesByAccessKey = async (
    accessKey: string,
  ): Promise<RemoteResponse[]> => {
    try {
      setLoading(true);
      return await rosService.getRemotesByAccessKey(rosUrl, accessKey);
    } catch {
      setError(new Error("Failed to fetch remotes by access key"));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRemotesByAccessKey,
  };
};
