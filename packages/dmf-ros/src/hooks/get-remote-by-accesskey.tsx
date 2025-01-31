import { RosService } from '../services/ros-service';
import type { RemoteResponse } from '../types';

interface useGetRemoteByAccessKeyProps {
  rosUrl: string;
  accessKey: string;
  remoteKey: string;
}

export const useGetRemoteByAccessKey = async ({
  rosUrl,
  accessKey,
  remoteKey,
}: useGetRemoteByAccessKeyProps): Promise<RemoteResponse | null> => {
  try {
    const rosService = RosService.getInstance();
    return await rosService.getRemoteByAccessKey(rosUrl, accessKey, remoteKey);
  } catch (error) {
    console.error(
      'Failed to fetch remote details by access key and remote key.',
      error
    );
    return null;
  }
};
