import { RosService } from '../services/ros-service';
import type { RemoteResponse } from '../types';

interface useGetRemotesByAccessKeyProps {
  rosUrl: string;
  accessKey: string;
}

export const useGetRemotesByAccessKey = async ({
  rosUrl,
  accessKey,
}: useGetRemotesByAccessKeyProps): Promise<RemoteResponse[]> => {
  try {
    const rosService = RosService.getInstance();
    return await rosService.getRemotesByAccessKey(rosUrl, accessKey);
  } catch (error) {
    console.error('Failed to fetch remotes by access key.', error);
    return [];
  }
};
