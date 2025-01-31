import { RosService } from '../services/ros-service';
import type { HostResponse } from '../types';

interface useGetHostByAccessKey {
  rosUrl: string;
  accessKey: string;
}

export const getHostByAccessKey = async ({
  rosUrl,
  accessKey,
}: useGetHostByAccessKey): Promise<HostResponse | null> => {
  try {
    const rosService = RosService.getInstance();
    return await rosService.getHostByAccessKey(rosUrl, accessKey);
  } catch (error) {
    console.error('Failed to fetch hosts by access key.', error);
    return null;
  }
};
