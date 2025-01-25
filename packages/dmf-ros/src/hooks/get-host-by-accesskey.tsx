import { useState } from "react";
import { RosService } from "../services/ros-service";
import type { HostResponse } from "../types";

interface UseGetHostByAccessKeyProps {
  rosUrl: string;
}

interface UseGetHostByAccessKey {
  loading: boolean;
  error: Error | null;
  getHostByAccessKey: (accessKey: string) => Promise<HostResponse>;
}

export const useGetHostByAccessKey = ({
  rosUrl,
}: UseGetHostByAccessKeyProps): UseGetHostByAccessKey => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const rosService = RosService.getInstance();

  const getHostByAccessKey = async (
    accessKey: string,
  ): Promise<HostResponse> => {
    try {
      setLoading(true);
      return await rosService.getHostByAccessKey(rosUrl, accessKey);
    } catch {
      setError(new Error("Failed to fetch remotes by access key"));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getHostByAccessKey,
  };
};
