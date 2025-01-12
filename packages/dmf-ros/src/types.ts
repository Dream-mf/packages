/**
 * Represents a module with basic information.
 */
export interface ModuleResponse {
  /** Unique identifier of the module. */
  id: number;
  /** Name of the module. */
  name: string;
  /** Timestamp when the module was created. */
  created_Date: number;
  /** Timestamp when the module was last updated. */
  updated_Date: number;
}

/**
 * Represents detailed information about a remote resource.
 */
export interface RemoteResponse {
  /** Unique identifier of the remote. */
  id: number;
  /** Name of the remote. */
  name: string;
  /** Unique key associated with the remote. */
  key: string;
  /** Scope of the remote. */
  scope: string;
  /** URL of the remote resource. */
  url: string;
  /** Repository URL associated with the remote. */
  repository: string;
  /** Name of the contact person for the remote. */
  contactName: string;
  /** Email of the contact person for the remote. */
  contactEmail: string;
  /** Documentation URL for the remote. */
  documentationUrl: string;
  /** List of modules associated with the remote. */
  modules: ModuleResponse[];
  /** Timestamp when the remote was created. */
  created_Date: number;
  /** Timestamp when the remote was last updated. */
  updated_Date: number;
}

/**
 * Represents a summary of a remote resource.
 */
export interface RemoteSummaryResponse {
  /** Unique identifier of the remote summary. */
  id: number;
  /** Name of the remote summary. */
  name: string;
  /** Unique key associated with the remote summary. */
  key: string;
  /** Scope of the remote summary. */
  scope: string;
  /** URL of the remote resource. */
  url: string;
  /** List of modules associated with the remote summary. */
  modules: ModuleResponse[];
  /** Timestamp when the remote summary was created. */
  created_Date: number;
  /** Timestamp when the remote summary was last updated. */
  updated_Date: number;
}

/**
 * Represents host information.
 */
export interface HostResponse {
  /** Unique identifier of the host. */
  id: number;
  /** Name of the host. */
  name: string;
  /** Description of the host. */
  description: string;
  /** URL of the host. */
  url: string;
  /** Unique key associated with the host. */
  key: string;
  /** Environment of the host (e.g., production, staging). */
  environment: string;
  /** Repository URL associated with the host. */
  repository: string;
  /** Name of the contact person for the host. */
  contactName: string;
  /** Email of the contact person for the host. */
  contactEmail: string;
  /** Documentation URL for the host. */
  documentationUrl: string;
  /** Timestamp when the host was created. */
  created_Date: number;
  /** Timestamp when the host was last updated. */
  updated_Date: number;
}
