import type { HostResponse, RemoteResponse } from "../types";
import { API_ENDPOINTS } from "../constants";

export class RosService {
  private static instance: RosService;
  private constructor() {}

  public static getInstance(): RosService {
    if (!RosService.instance) {
      RosService.instance = new RosService();
    }
    return RosService.instance;
  }

  /**
   * Fetches host information using an access key and base path
   * @param basePath - The base URL for the API
   * @param accessKey - The access key to identify the host
   * @returns Promise<HostResponse>
   */
  public async getHostByAccessKey(
    basePath: string,
    accessKey: string,
  ): Promise<HostResponse> {
    const response = await fetch(`${basePath}${API_ENDPOINTS.GET_HOST(accessKey)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as HostResponse;
  }

  /**
   * Fetches remotes information for a host using an access key and base path
   * @param basePath - The base URL for the API
   * @param accessKey - The access key to identify the host
   * @returns Promise<RemoteResponse[]>
   */
  public async getRemotesByAccessKey(
    basePath: string,
    accessKey: string,
  ): Promise<RemoteResponse[]> {
    const response = await fetch(`${basePath}${API_ENDPOINTS.GET_REMOTES(accessKey)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as RemoteResponse[];
  }

  /**
   * Fetches a specific remote by access key and remote key
   * @param basePath - The base URL for the API
   * @param accessKey - The access key to identify the host
   * @param key - The key of the remote to fetch
   * @returns Promise<RemoteResponse>
   */
  public async getRemoteByAccessKey(
    basePath: string,
    accessKey: string,
    key: string,
  ): Promise<RemoteResponse> {
    const response = await fetch(`${basePath}${API_ENDPOINTS.GET_REMOTE(accessKey, key)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as RemoteResponse;
  }
}
