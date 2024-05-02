import React, { ReactElement, ReactNode, useEffect } from 'react';
import { SigninSilentArgs } from 'oidc-client-ts';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import DreamMFContextStore from '../extensions/url-store';
import { DreamMFLogClient } from '@dream.mf/logging';

interface DreamMFContextGuardProps {
	children?: ReactNode | undefined;
	fallback?: ReactNode | undefined;
	stopRedirect?: boolean;
}

/** A authenticated guard (using DreamMFAuthProvider) to ensure items do not render unless isAuthenticated is true.
 * @param children Wrap this component you want to restrict rendering on.
 */
export const DreamMFContextGuard = ({
	children,
	fallback,
	stopRedirect,
}: DreamMFContextGuardProps) => {
	const auth = useAuth();

	const isReadyForRedirect = () => {
		return !hasAuthParams() && !auth.isAuthenticated && !auth.isLoading;
	};

	const isReadyForSignin = () => {
		return hasAuthParams() && !auth.isAuthenticated && !auth.isLoading;
	};

	useEffect(() => {
		if (isReadyForRedirect() && !stopRedirect) {
			DreamMFLogClient.logAuthentication({ message: 'Redirecting you to the identity provider.' });
			DreamMFContextStore.originalRequestPath = `${window.location.pathname}`;
			auth.signinRedirect({
				redirect_uri: auth.settings.redirect_uri,
			} as SigninSilentArgs).catch(console.error);
		}
	}, [auth.isAuthenticated]);

	useEffect(() => {
		if (isReadyForSignin() && !stopRedirect) {
			DreamMFLogClient.logAuthentication({ message: 'Getting token from the identity provider.' });
			auth.signinSilent({
				redirect_uri: auth.settings.redirect_uri,
			} as SigninSilentArgs).catch(console.error);
		}
	}, []);

	useEffect(() => {
		return auth.events.addAccessTokenExpiring((cb) => {
			DreamMFLogClient.logAuthentication({ message: 'Renewing token with the identity provider.' });
			auth.signinSilent({
				redirect_uri: auth.settings.redirect_uri,
			} as SigninSilentArgs).catch(console.error);
		});
	}, [auth.events, auth.signinSilent]);

	switch (auth.activeNavigator) {
		case 'signinSilent':
			return <h3>Signing you in...</h3>;
		case 'signoutRedirect':
			return <h3>Signing you out...</h3>;
	}

	if (auth.error) {
		DreamMFLogClient.logAuthentication({ error: auth.error });
		return (
			<>
				<h3>Error authenticating</h3>
				<h5>{auth.error.message}</h5>
			</>
		);
	}

	return (auth.isAuthenticated ? children : fallback) as ReactElement;
};

export default { DreamMFContextGuard };
