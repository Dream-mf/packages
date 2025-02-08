const keyOriginalRequestPath = 'DreamMF_OriginalRequestPath';

/**
 * Saves/retrieves auth-related data to/from session storage
 */
class DreamMFContextStore {
  get originalRequestPath(): string {
    // Allow nextjs silliness
    if (typeof window === 'undefined') {
      return '';
    }
    return window.sessionStorage.getItem(keyOriginalRequestPath) ?? '';
  }

  set originalRequestPath(value: string) {
    // Allow nextjs silliness
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(keyOriginalRequestPath, value);
    }
  }

  clear() {
    // Allow nextjs silliness
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(keyOriginalRequestPath);
    }
  }
}

const authStore = new DreamMFContextStore();
export default authStore;
