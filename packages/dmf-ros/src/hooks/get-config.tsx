import { ENV_ROS_HOSTURL, DEFAULT_HOST_URL } from "../constants";

/**
 * Returns the configured host URL from DREAMMF_ROS_HOSTURL (environment) variables or default value
 * @returns string The host URL
 */
export const useGetConfig = (): string => {
  return process.env[ENV_ROS_HOSTURL] || DEFAULT_HOST_URL;
}
