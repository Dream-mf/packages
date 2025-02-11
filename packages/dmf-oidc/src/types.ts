import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';

/** Auth Provider config type */
export type DreamMFAuthConfig = UserManagerSettings & {
	useFetchInterceptor: boolean;
	useAxiosInterceptor: boolean;
};

/** Extended interface to include our types for fetches */
export interface DreamMFRequestInit extends RequestInit {
    useAuthentication?: boolean;
}

/** Basic environment variable driven oidc configuration for providers */
export const BaseAuthConfig: DreamMFAuthConfig = {
	authority: '',
	client_id: '',
	client_secret: '',
	redirect_uri: '',
	scope: '',
	post_logout_redirect_uri: '',
	response_type: 'code',
	metadataUrl: '',
	useFetchInterceptor: false,
	useAxiosInterceptor: false,
	userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export default {
	BaseAuthConfig,
};
