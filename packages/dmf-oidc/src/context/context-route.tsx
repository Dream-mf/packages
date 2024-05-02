import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import DreamMFContextStore from '../extensions/url-store';
import { DreamMFContextGuard } from './context-guard';
import { DreamMFLogClient } from '@dream.mf/logging';

export const HandleAuthRoute = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth.isAuthenticated) {
			DreamMFLogClient.logAuthentication({ message: 'Successful login, redirecting you back.' });
			const url = DreamMFContextStore.originalRequestPath;
			DreamMFContextStore.clear();
			navigate(url);
		}
	}, [auth.isAuthenticated]);

	return (
		<>
			<DreamMFContextGuard
				fallback={<>You do not have access to this component.</>}
			/>
			<>One minute, we are logging you in...</>
		</>
	);
};

export default {
	HandleAuthRoute,
};
