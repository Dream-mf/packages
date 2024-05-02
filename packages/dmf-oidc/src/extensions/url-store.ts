const keyOriginalRequestPath = 'DreamMF_OriginalRequestPath';

/**
 * Saves/retrieves auth-related data to/from session storage
 */
class DreamMFContextStore {
	get originalRequestPath(): string {
		return window.sessionStorage.getItem(keyOriginalRequestPath) ?? '';
	}

	set originalRequestPath(value: string) {
		window.sessionStorage.setItem(keyOriginalRequestPath, value);
	}

	clear() {
		window.sessionStorage.removeItem(keyOriginalRequestPath);
	}
}

const authStore = new DreamMFContextStore();
export default authStore;
