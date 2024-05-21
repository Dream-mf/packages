import { FederationRuntimePlugin } from "@module-federation/runtime/types";
import { DreamMFLogClient } from "@dream.mf/logging";
import { registerRuntimeRemote } from "@dream.mf/core";

export interface ImportRemotesPluginOptions {}

export default ImportRemotesPlugin = (
  config: ImportRemotesPluginOptions,
): FederationRuntimePlugin => {
  return {
    name: "dream-import-remotes-plugin",
    async beforeRequest(request) {
      const { id, options, origin } = request;
      const [remoteScope] = id.split("/");
      const remote = origin.options.remotes.find((r) => r.name === remoteScope);

      // const remoteUrl = await fetchRemoteConfiguration(
      //   config.baseUrl,
      //   remote.alias,
      // );
      // remote["entry"] = remoteUrl.value;

      // registerRuntimeRemote(remote.alias, null, remoteUrl.value);
      // DreamMFLogClient.logFederation(remoteUrl.value, remote.alias, null);

      return request;
    },
  };
};
