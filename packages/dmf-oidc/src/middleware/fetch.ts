import { UserManager } from "oidc-client-ts";
import { DreamMFAuthConfig } from "../types";
import { DreamMFLogClient } from "@dream.mf/logging";

/**
 * Appends an interceptor that appends a Bearer Token to the Authorization header
 * and a correlation id in uuidv4 format. You need to set a config field called
 * useAuthentication: true to enable authentication.
 *
 * Example: fetch('https://www.gooogle.com/', { useAuthentication: true })
 */
export async function addInterceptors(config: DreamMFAuthConfig) {
  if (!config.useFetchInterceptor) {
    return;
  }
  DreamMFLogClient.logInfo({ message: `Appending fetch interceptor.` });
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const [input, init] = args;
    if (!init) {
      DreamMFLogClient.logEvent({
        eventName: "fetch",
        details: { url: input, user: null },
      });
      return await originalFetch(input, init);
    }
    const fetchConfig = { ...init };
    const useAuth = init["useAuthentication"] === true;
    if (useAuth) {
      const userManager = new UserManager(config);
      const user = await userManager.getUser();
      const id = crypto.randomUUID();
      DreamMFLogClient.logEvent({
        eventName: "fetch",
        details: { url: input, id: id, user: user.profile },
      });
      if (user) {
        fetchConfig.headers = {
          "X-Correlation-Id": id,
          Authorization: `Bearer ${await user?.id_token}`,
        };
      }
    }
    return await originalFetch(input, fetchConfig);
  };
}

export default {
  addInterceptors,
};
