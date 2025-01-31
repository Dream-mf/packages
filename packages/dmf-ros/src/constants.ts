/**
 * Environment variable name for the ROS host URL
 */
export const ENV_ROS_HOSTURL = "DREAMMF_ROS_HOSTURL";

/**
 * Default host URL if environment variable is not set
 */
export const DEFAULT_HOST_URL = "https://localhost:5001";

/**
 * Default filename for remote entry
 */
export const REMOTE_ENTRY_FILE = "remoteEntry.js";

/**
 * API endpoint patterns
 */
export const API_ENDPOINTS = {
  /**
   * Get host by access key
   * @param accessKey - The access key to identify the host
   */
  GET_HOST: (accessKey: string) => `api/dreammf/hosts/${accessKey}/`,

  /**
   * Get all remotes for a host
   * @param accessKey - The access key to identify the host
   */
  GET_REMOTES: (accessKey: string) => `api/dreammf/hosts/${accessKey}/remotes`,

  /**
   * Get specific remote by key
   * @param accessKey - The access key to identify the host
   * @param key - The key of the remote to fetch
   */
  GET_REMOTE: (accessKey: string, key: string) => `api/dreammf/hosts/${accessKey}/remote/${key}`,
  
} as const;