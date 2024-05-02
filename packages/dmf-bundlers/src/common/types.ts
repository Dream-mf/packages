export const DefaultRemoteName = 'remote.js';
export const DefaultContainerName = 'container';

export enum ScopeType {
    Host,
    Remote
};

export type FederatedRemote = {
    [key: string]: string;
};

export type FederatedModule = {
    [key: string]: string;
};

export type BundlerConfigProps = {
    scopeType: ScopeType;
    scope?: string;
    useTypescript: boolean;
    devPort: number;
    remotes?: FederatedRemote[];
    exposes?: FederatedModule;
};

export default {
    DefaultRemoteName,
    DefaultContainerName
}